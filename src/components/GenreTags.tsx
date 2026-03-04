// components/GenreTags.tsx
import { GENRE_MAP } from "@/lib/genres";

type GenreTagsProps = {
    genreIds: number[];
    max?: number;
};

export const GenreTags = ({ genreIds, max = 2 }: GenreTagsProps) => {
    const genres = genreIds
        .map((id) => GENRE_MAP[id])
        .filter(Boolean)
        .slice(0, max);

    if (genres.length === 0) return null;

    return (
        <div className="flex gap-1 flex-wrap">
            {genres.map((genre) => (
                <span
                    key={genre}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-text-secondary"
                >
          {genre}
        </span>
            ))}
        </div>
    );
};