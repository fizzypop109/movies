// components/Recommendations.tsx
import { useEffect, useState, useCallback } from "react";
import { Movie } from "@/types";
import { MovieRow } from "@/components/MovieRow";
import { useWatchlist } from "@/hooks";
import { MdAutoAwesome, MdRefresh } from "react-icons/md";

type RecommendationsProps = {
    watchlist: ReturnType<typeof useWatchlist>;
    onSelect: (movie: Movie) => void;
};

export const Recommendations = ({ watchlist, onSelect }: RecommendationsProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    const fetchRecs = useCallback(async (pageNum: number) => {
        const ids = watchlist.items.map((item) => item.movie_id);

        if (ids.length === 0) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Shuffle the IDs and pick a different set of 5 each time
            const shuffled = [...ids].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 5);

            const res = await fetch(
                `/api/movies/recommendations?ids=${selected.join(",")}&page=${pageNum}`
            );
            const data = await res.json();

            const watchlistIds = new Set(ids);
            const filtered = (data.results || []).filter(
                (movie: Movie) => !watchlistIds.has(movie.id)
            );

            setMovies(filtered);
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setLoading(false);
        }
    }, [watchlist.items]);

    useEffect(() => {
        fetchRecs(0);
    }, [fetchRecs]);

    const handleRefresh = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRecs(nextPage);
    };

    if (!loading && watchlist.items.length === 0) return null;
    if (!loading && movies.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <MdAutoAwesome className="size-5 text-primary" />
                <h2 className="text-sm font-semibold text-text-primary">
                    Recommended for You
                </h2>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="ml-auto flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                >
                    <MdRefresh
                        className={`size-4 ${loading ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="flex gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="shrink-0 w-28 aspect-[2/3] rounded-lg bg-muted animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <MovieRow movies={movies} onSelect={onSelect} />
            )}
        </div>
    );
};