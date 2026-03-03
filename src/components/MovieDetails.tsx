import { IoMdClose } from "react-icons/io";
import { Movie } from "@/types";
import {useSession, useWatchlist} from "@/hooks";

type MovieDetailsProps = {
    movie: Movie;
    onClose?: () => void;
    watchlist?: ReturnType<typeof useWatchlist>;
};

export const MovieDetails = ({ movie, onClose, watchlist }: MovieDetailsProps) => {
    const { session } = useSession();

    const year = movie.release_date?.split("-")[0];
    const rating = movie.vote_average?.toFixed(1);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <div className="relative w-full max-w-[450px] lg:max-w-[800px] max-h-[90vh] bg-surface rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                    <IoMdClose className="size-5" />
                </button>

                {/* Scrollable content */}
                <div className="overflow-y-auto max-h-[90vh]">
                    {/* Backdrop image */}
                    <div className="relative aspect-video w-full">
                        {movie.backdrop_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted" />
                        )}
                        {/* Gradient fade into content */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="px-5 pb-6 -mt-10 relative">
                        <div className="flex items-start gap-4">
                            {/* Poster thumbnail */}
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-20 lg:w-30 rounded-lg shadow-lg border-2 border-surface"
                                />
                            )}

                            <div className="flex-1 pt-2">
                                <h2 className="text-xl font-bold text-text-primary">
                                    {movie.title}
                                </h2>

                                <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                                    {year && <span>{year}</span>}
                                    {year && rating && <span>·</span>}
                                    {rating && (
                                        <span className="flex items-center gap-1">
                      <span className="text-accent">★</span> {rating}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Overview */}
                        {movie.overview && (
                            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                                {movie.overview}
                            </p>
                        )}

                        {/* Action buttons */}
                        {watchlist && session && (
                            <div className="mt-5 flex flex-col gap-2">
                                {watchlist.getStatus(movie.id) ? (
                                    <>
                                        <div className="flex gap-2">
                                            {(["want_to_see", "seen", "maybe"] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => watchlist.updateStatus(movie.id, status)}
                                                    className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                                                        watchlist.getStatus(movie.id) === status
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-text-secondary"
                                                    }`}
                                                >
                                                    {status === "want_to_see" ? "Want to See" : status === "seen" ? "Seen" : "Maybe"}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => { watchlist.removeMovie(movie.id); }}
                                            className="w-full py-2.5 text-destructive text-xs font-medium rounded-xl bg-muted hover:bg-destructive/10 transition-colors"
                                        >
                                            Remove from Watchlist
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => watchlist.addMovie(movie, "want_to_see")}
                                            className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 rounded-xl transition-colors"
                                        >
                                            Want to See
                                        </button>
                                        <button
                                            onClick={() => watchlist.addMovie(movie, "maybe")}
                                            className="px-4 py-3 bg-muted hover:bg-border text-text-primary rounded-xl transition-colors text-sm"
                                        >
                                            Maybe
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};