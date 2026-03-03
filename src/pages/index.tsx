// pages/index.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Navigation } from "@/components";
import { Explore } from "@/components/Explore";
import { Watchlist } from "@/components/Watchlist";
import { Auth } from "@/components/Auth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Page } from "@/types";

export default function Home() {
  const [page, setPage] = useState<Page>("list");
  const [session, setSession] = useState<Session | null>(null);

  const watchlist = useWatchlist(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
          <Auth />
        </div>
    );
  }

  return (
      <div className="bg-background p-4 pb-20 flex flex-col h-screen font-sans">
        {page === "list" && <Watchlist watchlist={watchlist} />}
        {page === "explore" && <Explore watchlist={watchlist} />}
        <Navigation activePage={page} updatePage={setPage} />
      </div>
  );
}