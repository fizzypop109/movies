// components/Explore.tsx
import { useState } from "react";
import { Search } from "@/components/Search";
import { MovieCard } from "@/components/MovieCard";
import { MovieSection } from "@/components/MovieSection";
import { Movie } from "@/types";
import { MovieDetails } from "@/components/MovieDetails";
import { MdUpcoming, MdLocalMovies } from "react-icons/md";
import {useWatchlist} from "@/hooks";

type ExploreProps = {
    watchlist: ReturnType<typeof useWatchlist>;
};

export const Explore = ({ watchlist }: ExploreProps) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearch = async (value: string) => {
        setSearch(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }

        const res = await fetch(
            `/api/movies/search?query=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setResults(data.results);
    };

    return (
        <>
            <div className="min-h-0 w-full flex flex-col flex-1 items-center justify-start gap-4">
                <Search onChange={handleSearch} />

                {results && results.length > 0 ? (
                    <div className="w-full min-h-0 flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-row xl:flex-wrap gap-4 overflow-y-auto pb-4">
                        {results.map((result) => (
                            <MovieCard
                                key={result.id}
                                movie={result}
                                onClick={() => setSelectedMovie(result)}
                            />
                        ))}
                    </div>
                ) : search.length >= 2 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                        <span className="text-4xl mb-2">🍿</span>
                        <p className="text-sm">No results found</p>
                    </div>
                ) : (
                    <div className="w-full flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto pb-4">
                        <MovieSection
                            title="Now Showing"
                            endpoint="/api/movies/now-playing"
                            icon={<MdLocalMovies className="size-5 text-accent" />}
                            onSelect={setSelectedMovie}
                        />

                        <MovieSection
                            title="Upcoming"
                            endpoint="/api/movies/upcoming"
                            icon={<MdUpcoming className="size-5 text-primary" />}
                            onSelect={setSelectedMovie}
                        />
                    </div>
                )}
            </div>

            {selectedMovie && (
                <MovieDetails
                    movie={selectedMovie}
                    watchlist={watchlist}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </>
    );
};