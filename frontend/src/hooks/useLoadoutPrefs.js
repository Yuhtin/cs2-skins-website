import { useCallback, useEffect, useState } from 'react';
import { getLoadoutPrefs, setLoadoutPref } from '../lib/api';
import { ALLOCATOR_TEAM } from '../lib/loadout-prefs';

// Loads the RetakesAllocator weapon preferences for the current user.
// Returns a normalized shape keyed by frontend team strings ('CT'/'T') so
// callers don't need to know the allocator's PascalCase JSON keys.
//
// Internal storage from the API is the raw allocator JSON:
//   { Terrorist: { FullBuyPrimary: 400, ... }, CounterTerrorist: { ... } }
//
// We expose:
//   prefs: { CT: { PistolRound: 202, ... }, T: { ... } }
//   setPref(team, slot, csItem|null): optimistic update + server roundtrip
export function useLoadoutPrefs() {
  const [rawPrefs, setRawPrefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLoadoutPrefs();
      setRawPrefs(data?.prefs ?? {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Frontend-friendly view: { CT: {...}, T: {...} }
  const prefs = {
    CT: rawPrefs?.[ALLOCATOR_TEAM.CT] ?? {},
    T:  rawPrefs?.[ALLOCATOR_TEAM.T]  ?? {},
  };

  const setPref = useCallback(async (team, slot, csItem) => {
    // Optimistic update — patch local state first so the UI feels instant.
    setRawPrefs((prev) => {
      const teamKey = ALLOCATOR_TEAM[team];
      const next = { ...prev };
      const teamObj = { ...(next[teamKey] ?? {}) };
      if (csItem == null) {
        delete teamObj[slot];
      } else {
        teamObj[slot] = Number(csItem);
      }
      next[teamKey] = teamObj;
      return next;
    });
    try {
      const result = await setLoadoutPref({ team, slot, csItem });
      if (result?.prefs) setRawPrefs(result.prefs);
    } catch (err) {
      // Roll back by re-fetching authoritative state
      setError(err.message);
      refresh();
      throw err;
    }
  }, [refresh]);

  return { prefs, loading, error, refresh, setPref };
}
