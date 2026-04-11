import { useCallback, useEffect, useState } from 'react';
import { getSkins, getKnife, getGloves, getAgent } from '../lib/api';

// Loads and caches the full user loadout for both teams.
// Returns a map keyed by `${weaponInternal}.${team}` → skin data.
export function useLoadout() {
  const [loadout, setLoadout] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ctSkins, tSkins, ctKnife, tKnife, ctGloves, tGloves, ctAgent, tAgent] = await Promise.all([
        getSkins(2).catch(() => []),
        getSkins(3).catch(() => []),
        getKnife(2).catch(() => null),
        getKnife(3).catch(() => null),
        getGloves(2).catch(() => null),
        getGloves(3).catch(() => null),
        getAgent(2).catch(() => null),
        getAgent(3).catch(() => null),
      ]);

      const next = {};
      for (const s of ctSkins || []) next[`${s.weapon_name}.CT`] = s;
      for (const s of tSkins || []) next[`${s.weapon_name}.T`] = s;
      if (ctKnife) next['knife_ct.CT'] = ctKnife;
      if (tKnife) next['knife_t.T'] = tKnife;
      if (ctGloves) next['ct_gloves.CT'] = ctGloves;
      if (tGloves) next['tt_gloves.T'] = tGloves;
      if (ctAgent) next['ct_agent.CT'] = ctAgent;
      if (tAgent) next['tt_agent.T'] = tAgent;

      setLoadout(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loadout, loading, error, refresh };
}
