import { useCallback, useState } from "react";
import { HEROES, type Role } from "../data/heroes";

const STORAGE_KEY = "dota-hero-roles";

/** Stored as { [heroId]: Role[] } */
type RoleOverrides = Record<number, Role[]>;

function load(): RoleOverrides {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as RoleOverrides;
    } catch {
        // ignore
    }
    return {};
}

function save(overrides: RoleOverrides): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
        // ignore
    }
}

/** Returns the effective roles for a hero (override if present, else defaults). */
function effectiveRoles(heroId: number, overrides: RoleOverrides): Role[] {
    if (overrides[heroId] !== undefined) return overrides[heroId];
    return HEROES.find((h) => h.id === heroId)?.roles ?? [];
}

export function useHeroRoles() {
    const [overrides, setOverrides] = useState<RoleOverrides>(load);

    /**
     * Toggle `role` for a single hero.
     * If the hero already has the role → remove it.
     * If the hero doesn't have the role → add it.
     */
    const toggleRole = useCallback((heroId: number, role: Role) => {
        setOverrides((prev) => {
            const current = effectiveRoles(heroId, prev);
            const hasRole = current.includes(role);
            const next: RoleOverrides = {
                ...prev,
                [heroId]: hasRole
                    ? current.filter((r) => r !== role)
                    : [...current, role],
            };
            save(next);
            return next;
        });
    }, []);

    /**
     * Set `role` to `enabled` for all given hero IDs.
     * Used by the "Select all / Deselect all" buttons.
     */
    const setRoleForMany = useCallback(
        (heroIds: number[], role: Role, enabled: boolean) => {
            setOverrides((prev) => {
                const next: RoleOverrides = { ...prev };
                heroIds.forEach((id) => {
                    const current = effectiveRoles(id, prev);
                    if (enabled && !current.includes(role)) {
                        next[id] = [...current, role];
                    } else if (!enabled && current.includes(role)) {
                        next[id] = current.filter((r) => r !== role);
                    }
                });
                save(next);
                return next;
            });
        },
        [],
    );

    /**
     * Returns a Set of hero IDs that currently have `role` in their roles.
     */
    const enabledIdsForRole = useCallback(
        (role: Role): Set<number> => {
            const result = new Set<number>();
            HEROES.forEach((hero) => {
                if (effectiveRoles(hero.id, overrides).includes(role)) {
                    result.add(hero.id);
                }
            });
            return result;
        },
        [overrides],
    );

    /**
     * Returns all heroes that currently have `role` in their effective roles.
     */
    const heroesForRole = useCallback(
        (role: Role) => {
            return HEROES.filter((h) =>
                effectiveRoles(h.id, overrides).includes(role),
            );
        },
        [overrides],
    );

    return { toggleRole, setRoleForMany, enabledIdsForRole, heroesForRole };
}
