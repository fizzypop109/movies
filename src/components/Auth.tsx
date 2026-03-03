import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        await supabase.auth.signInWithOtp({ email });
        setSent(true);
        setLoading(false);
    };

    if (sent) {
        return (
            <div className="flex flex-col items-center gap-3 p-6">
                <span className="text-4xl">📧</span>
                <p className="text-text-primary font-medium">Check your email</p>
                <p className="text-sm text-text-secondary text-center">
                    We sent a magic link to {email}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto p-6">
            <h2 className="text-lg font-bold text-text-primary">
                Sign in to use the watchlist
            </h2>

            <input
                type="email"
                placeholder="your@email.com"
                disabled={loading}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-primary text-sm"
            />

            <button
                onClick={handleLogin}
                disabled={loading || !email}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-black/30 text-primary-foreground font-semibold py-3 rounded-xl transition-colors"
            >
                {loading ? "Sending..." : "Send Magic Link"}
            </button>
        </div>
    );
};