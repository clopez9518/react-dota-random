import { useMemo, useState } from "react";
import { HEROES, type Role } from "../data/heroes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Settings, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { HeroTile } from "./HeroTile";
import { cn } from "@/lib/utils";

type RoleKey = Role | "All";

interface Props {
    role: RoleKey;
    label: string;
    active: boolean;
    /** IDs of heroes that currently have this role assigned */
    enabledIds: Set<number>;
    onSelectRole: () => void;
    /** Toggle the role for a single hero */
    onToggleHero: (id: number) => void;
    /** Set the role for many heroes at once (select all / deselect all) */
    onSetAll: (ids: number[], enabled: boolean) => void;
}

export const RoleChip = ({
    label, active, enabledIds, onSelectRole, onToggleHero, onSetAll,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const totalHeroes = HEROES.length;

    // All heroes matching the search query (shown in the popover)
    const filtered = useMemo(
        () => HEROES.filter((h) => h.name.toLowerCase().includes(query.toLowerCase())),
        [query],
    );

    // How many of the currently-visible heroes have this role assigned
    const enabledCount = filtered.filter((h) => enabledIds.has(h.id)).length;

    return (
        <div className="relative">
            {/* Role selector button */}
            <button
                onClick={onSelectRole}
                className={cn(
                    "group relative flex h-12 min-w-[120px] items-center justify-between gap-3 rounded-full border px-4 pr-10 text-sm font-medium transition-all",
                    active
                        ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_0_24px_-6px_var(--primary)]"
                        : "border-border bg-card/60 text-foreground hover:border-primary/30 hover:bg-card",
                )}
            >
                <span className="truncate">{label}</span>
                {/* Shows how many heroes are enabled for this role */}
                <span
                    className={cn(
                        "text-xs tabular-nums",
                        active ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                >
                    {enabledIds.size + '/' + totalHeroes}
                </span>
            </button>

            {/* Settings icon → opens hero management popover */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        aria-label={`Manage ${label} heroes`}
                        className={cn(
                            "absolute right-1 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border transition",
                            active
                                ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                                : "border-border bg-background/60 text-muted-foreground hover:text-foreground",
                        )}
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    sideOffset={10}
                    className="w-[340px] p-0 dark"
                >
                    {/* Popover header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div>
                            <div className="text-sm font-semibold">{label}</div>
                            <div className="text-xs text-muted-foreground">
                                {enabledCount}/{filtered.length} heroes with this role
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Search bar */}
                    <div className="px-4 pb-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search hero..."
                                className="h-8 pl-8 text-sm"
                            />
                        </div>
                    </div>

                    {/* Hero grid — highlighted = hero has this role assigned */}
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
                                    No heroes match &quot;{query}&quot;
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Footer — select/deselect all visible heroes */}
                    <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => onSetAll(filtered.map((h) => h.id), false)}
                        >
                            Remove all
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-primary hover:text-primary"
                            onClick={() => onSetAll(filtered.map((h) => h.id), true)}
                        >
                            Add all
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
