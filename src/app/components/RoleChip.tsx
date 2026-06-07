import { useMemo, useState } from "react";
import { Search, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HEROES, type Role } from "../data/heroes";
import { HeroTile } from "./HeroTile";

type RoleKey = Role | "All";

interface Props {
    role: RoleKey;
    label: string;
    active: boolean;
    enabledIds: Set<number>;
    onSelectRole: () => void;
    onToggleHero: (id: number) => void;
    onSetAll: (ids: number[], enabled: boolean) => void;
}

export const RoleChip = ({
    label,
    active,
    enabledIds,
    onSelectRole,
    onToggleHero,
    onSetAll,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const totalHeroes = HEROES.length;

    const filtered = useMemo(
        () => HEROES.filter((h) => h.name.toLowerCase().includes(query.toLowerCase())),
        [query],
    );

    const enabledCount = filtered.filter((h) => enabledIds.has(h.id)).length;

    return (
        <div className="relative">
            <button
                onClick={onSelectRole}
                className={cn(
                    "group relative flex h-11 min-w-[126px] items-center justify-between gap-3 rounded-lg border px-3 pr-10 text-sm font-medium transition-all",
                    active
                        ? "border-primary/60 bg-primary text-primary-foreground shadow-[0_16px_32px_-24px_var(--primary)]"
                        : "border-border/80 bg-card/35 text-foreground hover:border-primary/40 hover:bg-card/60",
                )}
            >
                <span className="truncate">{label}</span>
                <span
                    className={cn(
                        "text-xs tabular-nums",
                        active ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                >
                    {enabledIds.size}/{totalHeroes}
                </span>
            </button>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        aria-label={`Administrar heroes de ${label}`}
                        className={cn(
                            "absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md border transition",
                            active
                                ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                                : "border-border/70 bg-background/45 text-muted-foreground hover:bg-background/75 hover:text-foreground",
                        )}
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    sideOffset={10}
                    className="w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-lg border-border/80 p-0 dark"
                >
                    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                        <div>
                            <div className="text-sm font-semibold">{label}</div>
                            <div className="text-xs text-muted-foreground">
                                {enabledCount}/{filtered.length} heroes activos
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Cerrar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-4 py-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar heroe..."
                                className="h-9 rounded-md border-border/80 bg-background/60 pl-8 text-sm"
                            />
                        </div>
                    </div>

                    <ScrollArea className="h-[300px] px-3">
                        <div className="grid grid-cols-3 gap-2 pb-3">
                            {filtered.map((h) => (
                                <HeroTile
                                    key={h.id}
                                    hero={h}
                                    enabled={enabledIds.has(h.id)}
                                    onClick={() => onToggleHero(h.id)}
                                />
                            ))}
                            {filtered.length === 0 && (
                                <div className="col-span-3 py-8 text-center text-xs text-muted-foreground">
                                    No hay heroes para &quot;{query}&quot;
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="flex items-center justify-between border-t border-border/70 px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => onSetAll(filtered.map((h) => h.id), false)}
                        >
                            Quitar todos
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-primary hover:text-primary"
                            onClick={() => onSetAll(filtered.map((h) => h.id), true)}
                        >
                            Agregar todos
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
