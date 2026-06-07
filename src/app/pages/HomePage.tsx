import { useMemo, useState } from "react";
import { AlertCircle, Dice5, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RoleChip } from "../components/RoleChip";
import { ResultCard } from "../components/ResultCard";
import { ROLES } from "../data/heroes";
import type { Hero, Role } from "../data/heroes";
import { useHeroRoles } from "../hooks/useHeroRoles";

type RoleKey = Role | "All";

const ALL_ROLES: { key: RoleKey; label: string }[] = [
    { key: "All", label: "All" },
    ...ROLES.filter((r) => r !== "All").map((r) => ({ key: r as RoleKey, label: r })),
];

export const HomePage = () => {
    const [selectedRole, setSelectedRole] = useState<RoleKey>("All");
    const [result, setResult] = useState<Hero | null>(null);
    const [rolling, setRolling] = useState(false);

    const { toggleRole, setRoleForMany, enabledIdsForRole, heroesForRole } = useHeroRoles();

    const pool = useMemo(() => {
        if (selectedRole === "All") {
            return heroesForRole("All");
        }

        return heroesForRole(selectedRole as Role);
    }, [selectedRole, heroesForRole]);

    const roll = () => {
        if (pool.length === 0) return;

        setRolling(true);
        setTimeout(() => {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            setResult(pick);
            setRolling(false);
        }, 320);
    };

    const visibleResult = result && pool.find((h) => h.id === result.id) ? result : null;

    return (
        <div className="min-h-screen bg-background text-foreground dark">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.18_0.018_250),oklch(0.105_0.014_250)_48%,oklch(0.08_0.012_250))]"
            />

            <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-6 border-b border-border/70 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 border border-border/70 bg-card/35 px-3 py-1.5 text-xs font-medium uppercase text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Random Draft
                        </div>
                        <h1 className="text-balance text-4xl font-semibold leading-none tracking-tight sm:text-6xl">
                            Dota Random
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Choose your role and let fate decide your next hero.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-right sm:min-w-48">
                        <div className="border border-border/70 bg-card/30 p-3">
                            <div className="text-2xl font-semibold tabular-nums">{pool.length}</div>
                            <div className="text-xs uppercase text-muted-foreground">Heroes in pool</div>
                        </div>
                        <div className="border border-border/70 bg-card/30 p-3">
                            <div className="text-2xl font-semibold tabular-nums">{ALL_ROLES.length}</div>
                            <div className="text-xs uppercase text-muted-foreground">Roles</div>
                        </div>
                    </div>
                </header>

                <section className="py-6">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Select a role
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ALL_ROLES.map((r) => {
                            const chipRole = r.key === "All" ? "All" : (r.key as Role);
                            const enabledIds = enabledIdsForRole(chipRole);

                            return (
                                <RoleChip
                                    key={r.key}
                                    role={r.key}
                                    label={r.label}
                                    active={selectedRole === r.key}
                                    enabledIds={enabledIds}
                                    onSelectRole={() => setSelectedRole(r.key)}
                                    onToggleHero={(id) => toggleRole(id, chipRole)}
                                    onSetAll={(ids, on) => setRoleForMany(ids, chipRole, on)}
                                />
                            );
                        })}
                    </div>
                </section>

                <section className="grid items-stretch gap-5 border-t border-border/70 pt-5 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="flex min-h-72 flex-col justify-between border border-border/70 bg-card/35 p-5 backdrop-blur sm:p-6">
                        <div>
                            <div className="text-xs font-medium uppercase text-muted-foreground">Current Pool</div>
                            <h2 className="mt-2 text-2xl font-semibold">
                                {selectedRole === "All" ? "All" : selectedRole}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                {pool.length > 0
                                    ? "Roll the dice to reveal your next hero."
                                    : "No heroes enabled for this role. Adjust the pool from the settings icon."}
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <Button
                                size="lg"
                                onClick={roll}
                                disabled={pool.length === 0 || rolling}
                                className={cn(
                                    "h-12 w-full justify-between rounded-lg border border-primary/30 bg-primary px-4 text-sm font-semibold text-primary-foreground",
                                    "shadow-[0_14px_34px_-22px_var(--primary)] hover:bg-primary/90",
                                )}
                            >
                                <span>Random Hero</span>
                                <Dice5 className={cn("h-5 w-5", rolling && "animate-spin")} />
                            </Button>
                            <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                                <span>
                                    {pool.length} hero{pool.length === 1 ? "" : "s"} in the pool
                                </span>
                                <span>{selectedRole === "All" ? "All" : selectedRole}</span>
                            </div>
                            {pool.length === 0 && (
                                <div className="flex items-center gap-2 border border-destructive/35 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    No heroes enabled for this role.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="min-h-90">
                        {visibleResult ? (
                            <ResultCard hero={visibleResult} key={visibleResult.id} />
                        ) : (
                            <div className="flex h-full min-h-90 flex-col items-center justify-center gap-3 border border-dashed border-border/80 bg-card/20 text-center text-muted-foreground">
                                <Sparkles className="h-6 w-6 text-primary/80" />
                                <p className="text-sm">Click "Random Hero" to reveal the result</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
