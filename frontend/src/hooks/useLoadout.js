import { useCallback, useEffect, useState } from 'react';
import { getSkins, getKnife, getGloves, getAgent } from '../lib/api';
import { getWeaponByDefindex, KNIVES } from '../lib/weapons';
import { ensureSkinCatalog, getSkinByDefindexAndPaint } from '../lib/skins';
import { ensureRarityCatalog, getRarityColor } from '../lib/rarity';
import { ensureGlovesCatalog, getGlovesCatalog } from '../lib/equipment-catalogs';

// Loads and caches the full user loadout for both teams.
// Returns a map keyed by `${weaponInternal}.${team}` → enriched skin/equipment row.
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
        glovesData,
        agentData,
      ] = await Promise.all([
        getSkins('CT').catch(() => []),
        getSkins('T').catch(() => []),
        getKnife('CT').catch(() => null),
        getKnife('T').catch(() => null),
        // Gloves + agent endpoints both return ALL teams in one response,
        // so we only need to hit each one once.
        getGloves('CT').catch(() => null),
        getAgent('CT').catch(() => null),
        ensureSkinCatalog(),
        ensureRarityCatalog(),
        ensureGlovesCatalog(),
      ]);

      const next = {};

      // --- Enrich a weapon skin row with catalog image + paint_name + rarity color ---
      const enrichSkin = (row) => {
        if (!row) return row;
        const paint = row.weapon_paint_id;
        if (paint == null || Number(paint) === 0) return row;
        const skin = getSkinByDefindexAndPaint(row.weapon_defindex, paint);
        const rarityColor = getRarityColor(row.weapon_defindex, paint);
        if (!skin && !rarityColor) return row;
        return {
          ...row,
          ...(skin && { image: skin.image, paint_name: skin.paint_name }),
          ...(rarityColor && { rarity_color: rarityColor }),
        };
      };

      // --- Map regular weapon skin rows ---
      const mapSkins = (rows, team) => {
        if (!Array.isArray(rows)) return;
        for (const row of rows) {
          const weapon = getWeaponByDefindex(row.weapon_defindex);
          if (!weapon) continue;
          next[`${weapon.internal}.${team}`] = enrichSkin(row);
        }
      };
      mapSkins(ctSkins, 'CT');
      mapSkins(tSkins, 'T');

      // --- Enrich knife row ---
      // Backend returns { knife: 'weapon_knife_karambit' } per team.
      // We look up the KNIVES catalog by the stripped internal name to get
      // the defindex + display name, and build a predictable image path.
      const enrichKnife = (row) => {
        if (!row?.knife) return null;
        const model = String(row.knife);
        const internal = model.replace(/^weapon_/, '');
        const meta = KNIVES.find((k) => k.internal === internal);
        if (!meta) return null;
        return {
          knife: model,             // keep the raw model string for the backend round-trip
          internal,                 // 'knife_karambit', 'bayonet', ...
          displayName: meta.displayName,
          defindex: meta.defindex,
          image: `/weapons/${model}.png`,
        };
      };
      const ctKnifeEnriched = enrichKnife(ctKnife);
      const tKnifeEnriched = enrichKnife(tKnife);
      if (ctKnifeEnriched) next['knife_ct.CT'] = ctKnifeEnriched;
      if (tKnifeEnriched) next['knife_t.T'] = tKnifeEnriched;

      // --- Enrich gloves (one combined response, split per team) ---
      // gloves_addon_data response shape:
      //   { gloves_models: [{weapon_team, weapon_defindex}, ...],
      //     gloves_skins: [{weapon_team, weapon_defindex, weapon_paint_id, ...}, ...] }
      // Backend convention: team 3 = CT, 2 = T.
      const glovesCatalog = getGlovesCatalog();
      const enrichGloves = (teamStr) => {
        if (!glovesData?.gloves_models) return null;
        const teamNum = teamStr === 'CT' ? 3 : 2;
        const model = glovesData.gloves_models.find((g) => Number(g.weapon_team) === teamNum);
        if (!model) return null;
        const skin = glovesData.gloves_skins?.find(
          (s) => Number(s.weapon_team) === teamNum && Number(s.weapon_defindex) === Number(model.weapon_defindex),
        );
        const paint = skin?.weapon_paint_id;
        const catalogEntry = glovesCatalog.find(
          (g) =>
            Number(g.weapon_defindex) === Number(model.weapon_defindex) &&
            String(g.paint) === String(paint ?? ''),
        );
        return {
          weapon_defindex: model.weapon_defindex,
          weapon_paint_id: paint,
          weapon_wear: skin?.weapon_wear,
          weapon_seed: skin?.weapon_seed,
          image: catalogEntry?.image,
          paint_name: catalogEntry?.paint_name,
        };
      };
      const ctGlovesEnriched = enrichGloves('CT');
      const tGlovesEnriched = enrichGloves('T');
      if (ctGlovesEnriched) next['ct_gloves.CT'] = ctGlovesEnriched;
      if (tGlovesEnriched) next['tt_gloves.T'] = tGlovesEnriched;

      // --- Enrich agent rows (one combined response) ---
      // agent_get returns { agent_ct, agent_t } — both in one row.
      // CharacterPreview + EquipmentRail consumers read .agent as the model string.
      if (agentData?.agent_ct) next['ct_agent.CT'] = { agent: agentData.agent_ct };
      if (agentData?.agent_t) next['tt_agent.T'] = { agent: agentData.agent_t };

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
