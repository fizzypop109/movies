// components/MovieCard.tsx
import { Movie } from "@/types";
import { GenreTags } from "@/components/GenreTags";

type MovieCardProps = {
    movie: Movie;
    onClick?: () => void;
};

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
    const rating = movie.vote_average?.toFixed(1);

    return (
        <button className="group flex flex-col text-left" onClick={onClick}>
            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-md">
                {movie.poster_path ? (
                    <img
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-4xl text-muted-foreground">🎬</span>
                    </div>
                )}

                {rating && Number(rating) > 0 && (
                    <span className="absolute top-2 right-2 bg-black/70 text-accent text-xs font-bold px-2 py-0.5 rounded-full">
            ★ {rating}
          </span>
                )}
            </div>

            <p className="mt-2 text-sm font-medium text-text-primary line-clamp-2">
                {movie.title}
            </p>

            <div className="flex items-center gap-2 mt-1">
                {movie.release_date && (
                    <p className="text-xs text-text-secondary">
                        {movie.release_date.split("-")[0]}
                    </p>
                )}
            </div>

            {movie.genre_ids && <GenreTags genreIds={movie.genre_ids} />}
        </button>
    );
};