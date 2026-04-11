import { useCallback, useEffect, useState } from 'react';
import { getSkins, getKnife, getGloves, getAgent } from '../lib/api';
import { getWeaponByDefindex } from '../lib/weapons';
import { ensureSkinCatalog, getSkinByDefindexAndPaint } from '../lib/skins';

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
      const [
        ctSkins,
        tSkins,
        ctKnife,
        tKnife,
        ctGloves,
        tGloves,
        ctAgent,
        tAgent,
        // catalog is awaited in parallel but not destructured — we access via the sync lookup
      ] = await Promise.all([
        getSkins('CT').catch(() => []),
        getSkins('T').catch(() => []),
        getKnife('CT').catch(() => null),
        getKnife('T').catch(() => null),
        getGloves('CT').catch(() => null),
        getGloves('T').catch(() => null),
        getAgent('CT').catch(() => null),
        getAgent('T').catch(() => null),
        ensureSkinCatalog(),
      ]);

      const next = {};

      // Enrich a skin row with image + paint_name from the Nereziel catalog.
      const enrich = (row) => {
        if (!row) return row;
        const paint = row.weapon_paint_id;
        if (paint == null || Number(paint) === 0) return row; // default paint, no enrichment
        const skin = getSkinByDefindexAndPaint(row.weapon_defindex, paint);
        if (!skin) return row;
        return { ...row, image: skin.image, paint_name: skin.paint_name };
      };

      // Map skin rows keyed by weapon internal name.
      const mapSkins = (rows, team) => {
        if (!Array.isArray(rows)) return;
        for (const row of rows) {
          const weapon = getWeaponByDefindex(row.weapon_defindex);
          if (!weapon) continue;
          next[`${weapon.internal}.${team}`] = enrich(row);
        }
      };
      mapSkins(ctSkins, 'CT');
      mapSkins(tSkins, 'T');

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
