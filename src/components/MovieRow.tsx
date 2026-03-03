// components/MovieRow.tsx
import { Movie } from "@/types";

type MovieRowProps = {
    movies: Movie[];
    onSelect: (movie: Movie) => void;
};

export const MovieRow = ({ movies, onSelect }: MovieRowProps) => {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {movies.map((movie) => (
                <button
                    key={movie.id}
                    onClick={() => onSelect(movie)}
                    className="shrink-0 w-28 group text-left flex flex-col"
                >
                    <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-md">
                        {movie.poster_path ? (
                            <img
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-2xl text-muted-foreground">🎬</span>
                            </div>
                        )}

                        {movie.vote_average > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-black/70 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                ★ {movie.vote_average.toFixed(1)}
              </span>
                        )}
                    </div>

                    <p className="mt-1.5 text-xs font-medium text-text-primary line-clamp-2">
                        {movie.title}
                    </p>
                </button>
            ))}
        </div>
    );
};