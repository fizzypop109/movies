import { Theme, THEMES, useTheme } from "@/context/ThemeContext";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const LABELS: Record<Theme, string> = {
    light: "Light",
    dark: "Dark",
    system: "System",
};

export const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [localTheme, setLocalTheme] = useState<Theme>(theme);

    useEffect(() => {
        setLocalTheme(theme);
    }, [theme]);

    const hasChanges = localTheme !== theme;

    const onSave = () => {
        if (!hasChanges) return;
        setTheme(localTheme);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full gap-6">
            <div>
                <h1 className="text-xl font-bold text-text-primary">Settings</h1>
                <p className="text-sm text-text-secondary mt-1">
                    Customize your experience
                </p>
            </div>

            {/* Theme Section */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-primary">Theme</h3>

                <div className="flex flex-col gap-2">
                    {THEMES.map((t) => {
                        const isSelected = t === localTheme;

                        return (
                            <button
                                key={t}
                                onClick={() => setLocalTheme(t)}
                                className={`
                  group flex items-center justify-between
                  rounded-xl px-4 py-3 text-sm font-medium
                  border transition-all
                  ${
                                    isSelected
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-surface text-text-primary hover:border-primary/40 hover:bg-muted"
                                }
                `}
                            >
                                <span>{LABELS[t]}</span>
                                <FaCheck
                                    className={`size-4 transition-opacity ${
                                        isSelected ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={onSave}
                disabled={!hasChanges}
                className={`
          w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors
          ${
                    hasChanges
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                        : "bg-disabled text-muted-foreground cursor-not-allowed"
                }
        `}
            >
                Save Changes
            </button>

            {/* Sign Out */}
            <div className="mt-auto pb-4">
                <button
                    onClick={handleSignOut}
                    className="w-full py-3 rounded-xl text-sm font-medium text-destructive bg-muted hover:bg-destructive/10 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};