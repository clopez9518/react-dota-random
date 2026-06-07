
import { Badge } from "@/components/ui/badge";
import { heroFull, type Hero } from "../data/heroes";

interface Props {
    hero: Hero;
}

export const ResultCard = ({ hero }: Props) => {
    return (
        <div className="group relative h-full min-h-[360px] overflow-hidden rounded-lg border border-border/80 bg-card animate-in fade-in zoom-in-95 duration-300">
            <div className="relative h-full min-h-[360px] w-full overflow-hidden">
                <img
                    src={heroFull(hero.slug)}
                    alt={hero.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-background/60 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs font-medium uppercase text-muted-foreground">
                            Tu heroe
                        </div>
                        <div className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">{hero.name}</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:justify-end">
                        {hero.roles.map((r) => (
                            <Badge
                                key={r}
                                variant="secondary"
                                className="h-6 rounded-md border-primary/25 bg-primary/15 px-2.5 text-primary"
                            >
                                {r}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
