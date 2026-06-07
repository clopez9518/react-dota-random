import { cn } from "@/lib/utils";
import type { Hero } from "../data/heroes";
import { heroPortrait } from "../data/heroes"

interface Props {
    hero: Hero;
    enabled: boolean;
    onClick: () => void;
}


export const HeroTile = ({ hero, enabled, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative aspect-[16/9] overflow-hidden rounded-md border bg-card transition-all",
                enabled
                    ? "border-primary/70 opacity-100 shadow-[0_14px_26px_-24px_var(--primary)]"
                    : "border-border/80 opacity-45 grayscale hover:opacity-80 hover:grayscale-0",
            )}
            title={hero.name}
        >
            <img
                src={heroPortrait(hero.slug)}
                alt={hero.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 pt-4 pb-1">
                <div className="truncate text-[10px] font-medium text-white">
                    {hero.name}
                </div>
            </div>
            {enabled && (
                <div className="absolute right-1 top-1 h-2 w-2 rounded-sm bg-primary" />
            )}
        </button>
    )
}
