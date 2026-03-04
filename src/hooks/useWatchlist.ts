// src/hooks/useWatchlist.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Movie } from "@/types";
import { Session } from "@supabase/supabase-js";

export type WatchlistStatus = "want_to_see" | "seen" | "maybe";

export type WatchlistItem = {
    id: string;
    movie_id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    status: WatchlistStatus;
    rating: number | null;
    genre_ids: number[];
    created_at: string;
};

export const useWatchlist = (session: Session | null) => {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        if (!session) return;

        const { data, error } = await supabase
            .from("watchlist")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) setItems(data);
    }, [session]);

    useEffect(() => {
        let cancelled = false;

        const fetchWatchlist = async () => {
            if (!session) {
                if (!cancelled) {
                    setItems([]);
                    setLoading(false);
                }
                return;
            }

            const { data, error } = await supabase
                .from("watchlist")
                .select("*")
                .order("created_at", { ascending: false });

            if (!cancelled) {
                if (!error && data) setItems(data);
                setLoading(false);
            }
        };

        fetchWatchlist();

        return () => {
            cancelled = true;
        };
    }, [session]);

    const addMovie = async (movie: Movie, status: WatchlistStatus = "want_to_see") => {
        if (!session) return;

        const { error } = await supabase.from("watchlist").upsert(
            {
                user_id: session.user.id,
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids || [],
                status,
            },
            { onConflict: "user_id,movie_id" }
        );

        if (!error) await refetch();
    };

    const rateMovie = async (movieId: number, rating: number) => {
        if (!session) return;

        const { error } = await supabase
            .from("watchlist")
            .update({ rating })
            .eq("movie_id", movieId);

        if (!error) await refetch();
    };

    const updateStatus = async (movieId: number, status: WatchlistStatus) => {
        if (!session) return;

        const { error } = await supabase
            .from("watchlist")
            .update({ status })
            .eq("movie_id", movieId);

        if (!error) await refetch();
    };

    const removeMovie = async (movieId: number) => {
        if (!session) return;

        const { error } = await supabase
            .from("watchlist")
            .delete()
            .eq("movie_id", movieId);

        if (!error) await refetch();
    };

    const getStatus = (movieId: number): WatchlistStatus | null => {
        const item = items.find((i) => i.movie_id === movieId);
        return item?.status ?? null;
    };

    return { items, loading, addMovie, rateMovie, updateStatus, removeMovie, getStatus };
};