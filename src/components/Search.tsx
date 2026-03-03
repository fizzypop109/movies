import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";

type SearchProps = {
    onChange: (value: string) => void;
};

export const Search = ({ onChange }: SearchProps) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => onChange(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="flex items-center gap-3 w-full bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <IoIosSearch className="size-5 text-text-secondary shrink-0" />

            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-text-primary placeholder:text-text-secondary/60 focus:outline-none text-sm"
            />

            {query.length > 0 && (
                <button
                    onClick={() => setQuery("")}
                    className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
                >
                    <IoMdClose className="size-4" />
                </button>
            )}
        </div>
    );
};