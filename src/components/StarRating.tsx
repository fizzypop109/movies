// components/StarRating.tsx
import { useState } from "react";

type StarRatingProps = {
    rating: number | null;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md";
};

export const StarRating = ({
                               rating,
                               onChange,
                               readonly = false,
                               size = "md",
                           }: StarRatingProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    const display = hovered ?? rating ?? 0;
    const starSize = size === "sm" ? "text-sm" : "text-xl";

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    className={`${starSize} transition-colors ${
                        readonly ? "cursor-default" : "cursor-pointer"
                    } ${star <= display ? "text-accent" : "text-border"}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};