// components/WatchlistFilters.tsx
import { useState } from "react";
import { GENRE_MAP } from "@/lib/genres";
import { MdFilterList, MdSort, MdClose } from "react-icons/md";

export type SortOption = "date_added" | "rating" | "release_date" | "title";
export type SortDirection = "asc" | "desc";

type WatchlistFiltersProps = {
    sort: SortOption;
    direction: SortDirection;
    selectedGenres: number[];
    availableGenres: number[];
    onSortChange: (sort: SortOption, direction: SortDirection) => void;
    onGenreChange: (genres: number[]) => void;
};

const SORT_LABELS: Record<SortOption, string> = {
    date_added: "Date Added",
    rating: "My Rating",
    release_date: "Release Date",
    title: "Title",
};

export const WatchlistFilters = ({
                                     sort,
                                     direction,
                                     selectedGenres,
                                     availableGenres,
                                     onSortChange,
                                     onGenreChange,
                                 }: WatchlistFiltersProps) => {
    const [showFilters, setShowFilters] = useState(false);

    const toggleGenre = (genreId: number) => {
        if (selectedGenres.includes(genreId)) {
            onGenreChange(selectedGenres.filter((id) => id !== genreId));
        } else {
            onGenreChange([...selectedGenres, genreId]);
        }
    };

    const toggleDirection = () => {
        onSortChange(sort, direction === "asc" ? "desc" : "asc");
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                        selectedGenres.length > 0
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-surface text-text-secondary hover:border-primary/40"
                    }`}
                >
                    <MdFilterList className="size-4" />
                    Filter
                    {selectedGenres.length > 0 && (
                        <span className="bg-primary text-primary-foreground rounded-full size-4 flex items-center justify-center text-[10px]">
              {selectedGenres.length}
            </span>
                    )}
                </button>

                <div className="flex items-center gap-1 ml-auto">
                    <select
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value as SortOption, direction)}
                        className="bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                    >
                        {Object.entries(SORT_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={toggleDirection}
                        className="p-2 border border-border rounded-xl text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <MdSort
                            className={`size-4 transition-transform ${
                                direction === "asc" ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-wrap gap-1.5">
                    {availableGenres.map((genreId) => {
                        const isActive = selectedGenres.includes(genreId);
                        return (
                            <button
                                key={genreId}
                                onClick={() => toggleGenre(genreId)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                {GENRE_MAP[genreId]}
                                {isActive && <MdClose className="size-3" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};