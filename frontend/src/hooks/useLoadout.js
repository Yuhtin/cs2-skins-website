import { useCallback, useEffect, useState } from 'react';
import { getSkins, getKnife, getGloves, getAgent } from '../lib/api';
import { getWeaponByDefindex } from '../lib/weapons';

// Loads and caches the full user loadout for both teams.
// Returns a map keyed by `${weaponInternal}.${team}` → skin row.
// Equipment keys: `knife_ct.CT`, `knife_t.T`, `ct_gloves.CT`, `tt_gloves.T`, `ct_agent.CT`, `tt_agent.T`.
export function useLoadout() {
  const [loadout, setLoadout] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ctSkins, tSkins, ctKnife, tKnife, ctGloves, tGloves, ctAgent, tAgent] = await Promise.all([
        getSkins('CT').catch(() => []),
        getSkins('T').catch(() => []),
        getKnife('CT').catch(() => null),
        getKnife('T').catch(() => null),
        getGloves('CT').catch(() => null),
        getGloves('T').catch(() => null),
        getAgent('CT').catch(() => null),
        getAgent('T').catch(() => null),
      ]);

      const next = {};

      // Map skin rows (from getall) keyed by weapon internal name.
      const mapSkins = (rows, team) => {
        if (!Array.isArray(rows)) return;
        for (const row of rows) {
          const weapon = getWeaponByDefindex(row.weapon_defindex);
          if (!weapon) continue;
          next[`${weapon.internal}.${team}`] = row;
        }
      };
      mapSkins(ctSkins, 'CT');
      mapSkins(tSkins, 'T');

      // Equipment: simple key assignment.
      if (ctKnife && ctKnife.knife) next['knife_ct.CT'] = ctKnife;
      if (tKnife && tKnife.knife) next['knife_t.T'] = tKnife;
      if (ctGloves && Object.keys(ctGloves).length) next['ct_gloves.CT'] = ctGloves;
      if (tGloves && Object.keys(tGloves).length) next['tt_gloves.T'] = tGloves;
      if (ctAgent && Object.keys(ctAgent).length) next['ct_agent.CT'] = ctAgent;
      if (tAgent && Object.keys(tAgent).length) next['tt_agent.T'] = tAgent;

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
