import { useEffect, useState } from "react";
import { Movie } from "@/types";
import { MovieRow } from "@/components/MovieRow";
import { useWatchlist } from "@/hooks";
import { MdAutoAwesome } from "react-icons/md";

type RecommendationsProps = {
    watchlist: ReturnType<typeof useWatchlist>;
    onSelect: (movie: Movie) => void;
};

export const Recommendations = ({ watchlist, onSelect }: RecommendationsProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            // Get movie IDs from watchlist
            const ids = watchlist.items.map((item) => item.movie_id);

            if (ids.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `/api/movies/recommendations?ids=${ids.join(",")}`
                );
                const data = await res.json();

                // Filter out movies already in watchlist
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
        };

        fetchRecs();
    }, [watchlist.items]);

    if (!loading && watchlist.items.length === 0) return null;
    if (!loading && movies.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <MdAutoAwesome className="size-5 text-primary" />
                <h2 className="text-sm font-semibold text-text-primary">
                    Recommended for You
                </h2>
                <span className="text-xs text-text-secondary ml-auto">
          {movies.length > 0 && `${movies.length} movies`}
        </span>
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