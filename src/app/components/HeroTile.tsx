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
                "group relative aspect-[16/9] overflow-hidden rounded-md border transition-all",
                enabled
                    ? "border-primary/60 shadow-[0_0_0_1px_var(--primary)/30,0_6px_18px_-8px_var(--primary)]"
                    : "border-border opacity-50 grayscale hover:opacity-80 hover:grayscale-0",
            )}
            title={hero.name}
        >
            <img
                src={heroPortrait(hero.slug)}
                alt={hero.name}
                loading="lazy"
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pt-3 pb-1">
                <div className="truncate text-[10px] font-medium text-white">
                    {hero.name}
                </div>
            </div>
            {enabled && (
                <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
            )}
        </button>
    )
}
