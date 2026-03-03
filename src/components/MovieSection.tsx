// components/MovieSection.tsx
import { useEffect, useState } from "react";
import { Movie } from "@/types";
import { MovieRow } from "@/components/MovieRow";

type MovieSectionProps = {
    title: string;
    endpoint: string;
    icon: React.ReactNode;
    onSelect: (movie: Movie) => void;
};

export const MovieSection = ({ title, endpoint, icon, onSelect }: MovieSectionProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(endpoint);
                const data = await res.json();
                setMovies(data.results);
            } catch (error) {
                console.error(`Failed to fetch ${title}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [endpoint]);

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
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
            ) : movies.length > 0 ? (
                <MovieRow movies={movies} onSelect={onSelect} />
            ) : (
                <p className="text-sm text-text-secondary">No movies found</p>
            )}
        </div>
    );
};