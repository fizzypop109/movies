import { CiViewList } from "react-icons/ci";
import { MdOutlineExplore } from "react-icons/md";
import { Dispatch, JSX, SetStateAction } from "react";
import { Page } from "@/types";

type NavigationProps = {
    activePage: Page;
    updatePage: Dispatch<SetStateAction<Page>>;
};

type Option = {
    label: string;
    icon: JSX.Element;
    activeIcon: JSX.Element;
    key: Page;
};

const options: Option[] = [
    {
        label: "Watchlist",
        icon: <CiViewList className="size-6" />,
        activeIcon: <CiViewList className="size-6 stroke-1" />,
        key: "list",
    },
    {
        label: "Explore",
        icon: <MdOutlineExplore className="size-6" />,
        activeIcon: <MdOutlineExplore className="size-6" />,
        key: "explore",
    },
];

export const Navigation = ({ activePage, updatePage }: NavigationProps) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40">
            <div className="bg-surface/80 backdrop-blur-lg border-t border-border">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {options.map((option) => {
                        const isActive = activePage === option.key;

                        return (
                            <button
                                key={option.key}
                                onClick={() => updatePage(option.key)}
                                className="relative flex flex-col items-center gap-1 py-3 px-6 transition-colors"
                            >
                                {/* Active indicator dot */}
                                {isActive && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                                )}

                                <span
                                    className={
                                        isActive ? "text-primary" : "text-text-secondary"
                                    }
                                >
                  {isActive ? option.activeIcon : option.icon}
                </span>

                                <span
                                    className={`text-[10px] font-medium ${
                                        isActive ? "text-primary" : "text-text-secondary"
                                    }`}
                                >
                  {option.label}
                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Safe area spacer for phones with home indicators */}
            <div className="bg-surface/80 h-[env(safe-area-inset-bottom)]" />
        </nav>
    );
};