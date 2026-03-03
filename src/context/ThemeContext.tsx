"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib";

export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const resolved =
            theme === "system" ? (systemDark ? "dark" : "light") : theme;

        root.classList.toggle("dark", resolved === "dark");
    };

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        applyTheme(newTheme);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from("profiles")
                .update({ theme: newTheme })
                .eq("id", user.id);
        }
    };

    // On mount
    useEffect(() => {
        const loadTheme = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                applyTheme("system");
                return;
            }

            const { data } = await supabase
                .from("profiles")
                .select("theme")
                .eq("id", user.id)
                .maybeSingle();

            const theme = (data?.theme ?? "system") as Theme;

            if (!data?.theme) {
                await supabase.from("profiles").upsert({
                    id: user.id,
                    theme: "system",
                });
            }

            setThemeState(theme);
            applyTheme(theme);
        };

        loadTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context;
};