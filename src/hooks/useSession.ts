import {useEffect, useState} from "react";
import {supabase} from "@/lib";
import {Session} from "@supabase/supabase-js";

export const useSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => setSession(session)
        );

        return () => subscription.unsubscribe();
    }, []);

    return { session, loading }
}