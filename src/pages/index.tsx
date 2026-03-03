import { useState } from "react";
import { Navigation } from "@/components";
import { Explore } from "@/components/Explore";
import { Watchlist } from "@/components/Watchlist";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Page } from "@/types";
import {useSession} from "@/hooks";

export default function Home() {
  const {session, loading} = useSession();

  const [page, setPage] = useState<Page>("list");

  const watchlist = useWatchlist(session);

  if (loading) {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="bg-surface rounded-xl px-6 py-4 shadow-lg">
            <p className="text-sm text-text-primary">Loading...</p>
          </div>
        </div>
      )
  }

  return (
      <div className="bg-background p-4 pb-20 flex flex-col h-screen font-sans">
        {page === "list" && <Watchlist watchlist={watchlist} />}
        {page === "explore" && <Explore watchlist={watchlist} />}
        <Navigation activePage={page} updatePage={setPage} />
      </div>
  );
}