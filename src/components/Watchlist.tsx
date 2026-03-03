// components/Watchlist.tsx
import { useState } from "react";
import { WatchlistStatus, useWatchlist } from "@/hooks/useWatchlist";
import { MovieDetails } from "@/components/MovieDetails";
import { Movie } from "@/types";

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

    const filtered = watchlist.items.filter((item) => item.status === activeTab);

    return (
        <>
            <div className="flex flex-col flex-1 min-h-0 w-full gap-4">
                <h1 className="text-xl font-bold text-text-primary">My Watchlist</h1>

                {/* Tabs */}
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.status}
                            onClick={() => setActiveTab(tab.status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeTab === tab.status
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

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
                                onClick={() =>
                                    setSelectedMovie({
                                        id: item.movie_id,
                                        title: item.title,
                                        poster_path: item.poster_path,
                                        vote_average: item.vote_average,
                                        release_date: item.release_date,
                                    } as Movie)
                                }
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
                                </div>
                                <p className="mt-2 text-sm font-medium text-text-primary line-clamp-2">
                                    {item.title}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                        <span className="text-4xl mb-2">🎬</span>
                        <p className="text-sm">No movies here yet</p>
                        <p className="text-xs mt-1">Explore and add some movies!</p>
                    </div>
                )}
            </div>

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