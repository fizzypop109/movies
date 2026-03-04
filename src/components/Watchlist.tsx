// components/Watchlist.tsx
import { useMemo, useState } from "react";
import { WatchlistStatus, useWatchlist } from "@/hooks/useWatchlist";
import { MovieDetails } from "@/components/MovieDetails";
import { Movie } from "@/types";
import { StarRating } from "@/components/StarRating";
import { GenreTags } from "@/components/GenreTags";
import {
    WatchlistFilters,
    SortOption,
    SortDirection,
} from "@/components/WatchlistFilters";

type WatchlistProps = {
    watchlist: ReturnType<typeof useWatchlist>;
};

const tabs: { label: string; status: WatchlistStatus }[] = [
    { label: "Want to See", status: "want_to_see" },
    { label: "Seen", status: "seen" },
    { label: "Maybe", status: "maybe" },
];

export const Watchlist = ({ watchlist }: WatchlistProps) => {
    const [activeTab, setActiveTab] = useState<WatchlistStatus>("want_to_see");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [loadingMovie, setLoadingMovie] = useState(false);
    const [sort, setSort] = useState<SortOption>("date_added");
    const [direction, setDirection] = useState<SortDirection>("desc");
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

    const tabItems = watchlist.items.filter((item) => item.status === activeTab);

    // Get all genres available in the current tab
    const availableGenres = useMemo(() => {
        const genreSet = new Set<number>();
        tabItems.forEach((item) => {
            (item.genre_ids || []).forEach((id) => genreSet.add(id));
        });
        return Array.from(genreSet).sort();
    }, [tabItems]);

    // Filter and sort
    const filtered = useMemo(() => {
        let result = [...tabItems];

        // Filter by genres
        if (selectedGenres.length > 0) {
            result = result.filter((item) =>
                selectedGenres.some((g) => (item.genre_ids || []).includes(g))
            );
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;

            switch (sort) {
                case "date_added":
                    comparison =
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
                case "rating":
                    comparison = (a.rating ?? 0) - (b.rating ?? 0);
                    break;
                case "release_date":
                    comparison =
                        new Date(a.release_date || 0).getTime() -
                        new Date(b.release_date || 0).getTime();
                    break;
                case "title":
                    comparison = a.title.localeCompare(b.title);
                    break;
            }

            return direction === "asc" ? comparison : -comparison;
        });

        return result;
    }, [tabItems, selectedGenres, sort, direction]);

    const handleSelectMovie = async (movieId: number) => {
        setLoadingMovie(true);
        try {
            const res = await fetch(`/api/movies/${movieId}`);
            const data = await res.json();
            setSelectedMovie(data);
        } catch (error) {
            console.error("Failed to fetch movie details:", error);
        } finally {
            setLoadingMovie(false);
        }
    };

    return (
        <>
            <div className="flex flex-col flex-1 min-h-0 w-full gap-4">
                <h1 className="text-xl font-bold text-text-primary">My Watchlist</h1>

                {/* Tabs */}
                <div className="flex gap-2">
                    {tabs.map((tab) => {
                        const count = watchlist.items.filter(
                            (i) => i.status === tab.status
                        ).length;

                        return (
                            <button
                                key={tab.status}
                                onClick={() => {
                                    setActiveTab(tab.status);
                                    setSelectedGenres([]);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeTab === tab.status
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Filters */}
                {tabItems.length > 0 && (
                    <WatchlistFilters
                        sort={sort}
                        direction={direction}
                        selectedGenres={selectedGenres}
                        availableGenres={availableGenres}
                        onSortChange={(s, d) => {
                            setSort(s);
                            setDirection(d);
                        }}
                        onGenreChange={setSelectedGenres}
                    />
                )}

                {/* List */}
                {watchlist.loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary text-sm">Loading...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-2 gap-4 pb-4">
                        {filtered.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelectMovie(item.movie_id)}
                                className="group flex flex-col text-left"
                            >
                                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-md">
                                    {item.poster_path ? (
                                        <img
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <span className="text-4xl text-muted-foreground">🎬</span>
                                        </div>
                                    )}

                                    {item.rating && (
                                        <span className="absolute top-2 right-2 bg-black/70 text-accent text-xs font-bold px-2 py-0.5 rounded-full">
                      ★ {item.rating}
                    </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm font-medium text-text-primary line-clamp-2">
                                    {item.title}
                                </p>

                                {item.genre_ids && item.genre_ids.length > 0 && (
                                    <div className="mt-1">
                                        <GenreTags genreIds={item.genre_ids} />
                                    </div>
                                )}

                                {item.rating && (
                                    <div className="mt-1">
                                        <StarRating rating={item.rating} readonly size="sm" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                ) : tabItems.length > 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                        <span className="text-4xl mb-2">🔍</span>
                        <p className="text-sm">No movies match your filters</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                        <span className="text-4xl mb-2">🎬</span>
                        <p className="text-sm">No movies here yet</p>
                        <p className="text-xs mt-1">Explore and add some movies!</p>
                    </div>
                )}
            </div>

            {loadingMovie && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-surface rounded-xl px-6 py-4 shadow-lg">
                        <p className="text-sm text-text-primary">Loading movie...</p>
                    </div>
                </div>
            )}

            {selectedMovie && (
                <MovieDetails
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    watchlist={watchlist}
                />
            )}
        </>
    );
};