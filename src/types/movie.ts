export type Genre = {
    id: number;
    name: string;
};

export type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    video: boolean;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    genres?: Genre[];
    original_language: string;
    original_title: string;
    popularity: number;
}