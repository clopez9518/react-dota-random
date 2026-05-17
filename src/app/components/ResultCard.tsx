
import { Badge } from "@/components/ui/badge";
import { heroFull, type Hero } from "../data/heroes";

interface Props {
    hero: Hero | null;
}

export const ResultCard = ({ hero }: Props) => {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card animate-in fade-in zoom-in-95 duration-300">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                    src={heroFull(hero.slug)}
                    alt={hero.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                            Your hero
                        </div>
                        <div className="text-2xl font-semibold">{hero.name}</div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                        {hero.roles.map((r) => (
                            <Badge key={r} variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                                {r}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
