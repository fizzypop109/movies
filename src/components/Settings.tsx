import { Theme, THEMES, useTheme } from "@/context/ThemeContext";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";

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

    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h2 className="text-lg font-semibold text-text-primary">
                    Settings
                </h2>
                <p className="text-sm text-text-secondary">
                    Customize your experience
                </p>
            </div>

            {/* Theme Section */}
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-primary">
                    Theme
                </h3>

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
                                        : "border-border bg-surface text-text-primary hover:border-primary/60 hover:bg-muted"
                                }
                `}
                            >
                                <span>{LABELS[t]}</span>

                                <FaCheck
                                    className={`transition-opacity ${
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
          mt-auto rounded-xl px-4 py-3 text-sm font-semibold
          transition-all
          ${
                    hasChanges
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                        : "bg-disabled text-text-secondary cursor-not-allowed"
                }
        `}
            >
                Save Changes
            </button>
        </div>
    );
};