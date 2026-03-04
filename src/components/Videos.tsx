import { useEffect, useState } from "react";
import { MdPlayCircle } from "react-icons/md";
import {IoMdClose} from "react-icons/io";

type VideosProps = {
    movieId: number;
};

type VideosType = {
    key: string;
    name: string;
    type: string;
};

export const Videos = ({ movieId }: VideosProps) => {
    const [trailers, setTrailers] = useState<VideosType[]>([]);
    const [activeTrailer, setActiveTrailer] = useState<VideosType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrailers = async () => {
            try {
                const res = await fetch(`/api/movies/${movieId}/videos`);
                const data = await res.json();
                setTrailers(data.results || []);
            } catch (error) {
                console.error("Failed to fetch trailers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrailers();
    }, [movieId]);

    if (loading || trailers.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {activeTrailer ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary truncate">
                            {activeTrailer.name}
                        </p>
                        <button
                            onClick={() => setActiveTrailer(null)}
                            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors shrink-0 ml-2"
                        >
                            <IoMdClose className="size-4" />
                            <span>Close</span>
                        </button>
                    </div>

                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${activeTrailer.key}?autoplay=1`}
                            title={activeTrailer.name}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {trailers.slice(0, 3).map((trailer) => (
                        <button
                            key={trailer.key}
                            onClick={() => setActiveTrailer(trailer)}
                            className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-border transition-colors text-left"
                        >
                            <MdPlayCircle className="size-8 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {trailer.name}
                                </p>
                                <p className="text-xs text-text-secondary">{trailer.type}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};