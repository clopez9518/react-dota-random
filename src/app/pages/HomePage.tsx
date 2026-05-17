import { useEffect, useMemo, useState } from "react";
import { ROLES } from '../data/heroes'
import type { Role, Hero } from '../data/heroes'
import { AlertCircle, Shuffle, Sparkles } from "lucide-react";
import { RoleChip } from "../components/RoleChip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResultCard } from "../components/ResultCard";
import { useHeroRoles } from "../hooks/useHeroRoles";

type RoleKey = Role | "All";

const ALL_ROLES: { key: RoleKey; label: string }[] = [
    { key: "All", label: "All Roles" },
    ...ROLES.filter((r) => r !== "All").map((r) => ({ key: r as RoleKey, label: r })),
];

export const HomePage = () => {

    const [selectedRole, setSelectedRole] = useState<RoleKey>("All");
    const [result, setResult] = useState<Hero | null>(null);
    const [rolling, setRolling] = useState(false);

    const { toggleRole, setRoleForMany, enabledIdsForRole, heroesForRole } = useHeroRoles();

    const pool = useMemo(() => {
        if (selectedRole === "All") {
            // All heroes that have "All" in their roles
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

    // Reset result if it no longer fits the current pool
    useEffect(() => {
        if (result && !pool.find((h) => h.id === result.id)) setResult(null);
    }, [pool, result]);

    return (
        <div className="min-h-screen bg-background text-foreground dark">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_50%_0%,oklch(0.30_0.12_285/.35),transparent_60%)]"
            />
            <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
                <header className="mb-10 text-center">
                    <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                        Dota{" "}
                        <span className="bg-gradient-to-r from-primary to-[oklch(0.75_0.18_320)] bg-clip-text text-transparent">
                            Random Hero
                        </span>
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Select your role and pick your champion.
                    </p>
                </header>

                <section className="mb-8">
                    <div className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        Select role · click{" "}
                        <span className="inline-grid h-5 w-5 place-items-center rounded-full border border-border">
                            <Sparkles className="h-3 w-3" />
                        </span>{" "}
                        to manage heroes
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {ALL_ROLES.map((r) => {
                            // "All" chip uses the "All" role; specific roles use their role key
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

                <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm sm:p-10">
                    <div className="grid items-center gap-8 sm:grid-cols-2">
                        <div className="flex flex-col items-center gap-3 sm:items-start">
                            <Button
                                size="lg"
                                onClick={roll}
                                disabled={pool.length === 0 || rolling}
                                className={cn(
                                    "h-14 w-full max-w-sm rounded-xl text-base font-semibold",
                                    "bg-gradient-to-r from-primary to-[oklch(0.6_0.22_300)]",
                                    "shadow-[0_10px_40px_-12px_var(--primary)] hover:opacity-95",
                                )}
                            >
                                <Shuffle className={cn("mr-2 h-5 w-5", rolling && "animate-spin")} />
                                Random Hero
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                {pool.length} hero{pool.length === 1 ? "" : "es"} in pool ·{" "}
                                {selectedRole === "All" ? "All Roles" : selectedRole}
                            </p>
                            {pool.length === 0 && (
                                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    No heroes enabled for this role.
                                </div>
                            )}
                        </div>

                        <div className="min-h-[220px]">
                            {result ? (
                                <ResultCard hero={result} key={result.id} />
                            ) : (
                                <div className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 text-muted-foreground">
                                    <Sparkles className="h-6 w-6 opacity-60" />
                                    <p className="text-sm">Click "Random Hero" to select</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
