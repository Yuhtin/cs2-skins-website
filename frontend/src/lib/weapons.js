// Canonical weapon catalog with display names.
// Historical quirk: CS internal name `weapon_m4a1` is the M4A4 (non-silenced);
// `weapon_m4a1_silencer` is the M4A1-S. Upstream data misnames them — we fix the
// display layer, not the image/file paths (which still follow CS naming).

// `csItem` is the CounterStrikeSharp `CsItem` enum integer used by the
// RetakesAllocator's UserSettings.WeaponPreferences JSON blob — see
// CSSharp's CsItem.cs for the canonical mapping.
export const WEAPONS = [
  // Rifles
  { internal: 'ak47',          displayName: 'AK-47',         category: 'rifles', subgroup: 'rifle',          team: 'T',    cs2Id: 7,   csItem: 400, image: '/weapons/weapon_ak47.png' },
  { internal: 'm4a1',          displayName: 'M4A4',          category: 'rifles', subgroup: 'rifle',          team: 'CT',   cs2Id: 16,  csItem: 402, image: '/weapons/weapon_m4a1.png' },
  { internal: 'm4a1_silencer', displayName: 'M4A1-S',        category: 'rifles', subgroup: 'rifle',          team: 'CT',   cs2Id: 60,  csItem: 401, image: '/weapons/weapon_m4a1_silencer.png' },
  { internal: 'aug',           displayName: 'AUG',           category: 'rifles', subgroup: 'mid_tier_rifle', team: 'CT',   cs2Id: 8,   csItem: 407, image: '/weapons/weapon_aug.png' },
  { internal: 'famas',         displayName: 'FAMAS',         category: 'rifles', subgroup: 'mid_tier_rifle', team: 'CT',   cs2Id: 10,  csItem: 404, image: '/weapons/weapon_famas.png' },
  { internal: 'galilar',       displayName: 'Galil AR',      category: 'rifles', subgroup: 'mid_tier_rifle', team: 'T',    cs2Id: 13,  csItem: 403, image: '/weapons/weapon_galilar.png' },
  { internal: 'sg556',         displayName: 'SG 553',        category: 'rifles', subgroup: 'mid_tier_rifle', team: 'T',    cs2Id: 39,  csItem: 405, image: '/weapons/weapon_sg556.png' },

  // Snipers (grouped under rifles category per spec §5.3)
  { internal: 'awp',           displayName: 'AWP',           category: 'rifles', subgroup: 'sniper',         team: 'both', cs2Id: 9,   csItem: 406, image: '/weapons/weapon_awp.png' },
  { internal: 'ssg08',         displayName: 'SSG 08',        category: 'rifles', subgroup: 'sniper',         team: 'both', cs2Id: 40,  csItem: 408, image: '/weapons/weapon_ssg08.png' },
  { internal: 'scar20',        displayName: 'SCAR-20',       category: 'rifles', subgroup: 'sniper',         team: 'CT',   cs2Id: 38,  csItem: 409, image: '/weapons/weapon_scar20.png' },
  { internal: 'g3sg1',         displayName: 'G3SG1',         category: 'rifles', subgroup: 'sniper',         team: 'T',    cs2Id: 11,  csItem: 410, image: '/weapons/weapon_g3sg1.png' },

  // SMGs
  { internal: 'mac10',         displayName: 'MAC-10',        category: 'smgs', subgroup: 'smg',              team: 'T',    cs2Id: 17,  csItem: 300, image: '/weapons/weapon_mac10.png' },
  { internal: 'mp9',           displayName: 'MP9',           category: 'smgs', subgroup: 'smg',              team: 'CT',   cs2Id: 34,  csItem: 301, image: '/weapons/weapon_mp9.png' },
  { internal: 'mp7',           displayName: 'MP7',           category: 'smgs', subgroup: 'smg',              team: 'both', cs2Id: 33,  csItem: 302, image: '/weapons/weapon_mp7.png' },
  { internal: 'mp5sd',         displayName: 'MP5-SD',        category: 'smgs', subgroup: 'smg',              team: 'both', cs2Id: 23,  csItem: 304, image: '/weapons/weapon_mp5sd.png' },
  { internal: 'ump45',         displayName: 'UMP-45',        category: 'smgs', subgroup: 'smg',              team: 'both', cs2Id: 24,  csItem: 306, image: '/weapons/weapon_ump45.png' },
  { internal: 'p90',           displayName: 'P90',           category: 'smgs', subgroup: 'smg',              team: 'both', cs2Id: 19,  csItem: 303, image: '/weapons/weapon_p90.png' },
  { internal: 'bizon',         displayName: 'PP-Bizon',      category: 'smgs', subgroup: 'smg',              team: 'both', cs2Id: 26,  csItem: 305, image: '/weapons/weapon_bizon.png' },

  // Pistols
  { internal: 'glock',         displayName: 'Glock-18',      category: 'pistols', subgroup: 'starting_pistol', team: 'T',    cs2Id: 4,   csItem: 201, image: '/weapons/weapon_glock.png' },
  { internal: 'usp_silencer',  displayName: 'USP-S',         category: 'pistols', subgroup: 'starting_pistol', team: 'CT',   cs2Id: 61,  csItem: 202, image: '/weapons/weapon_usp_silencer.png' },
  { internal: 'hkp2000',       displayName: 'P2000',         category: 'pistols', subgroup: 'starting_pistol', team: 'CT',   cs2Id: 32,  csItem: 203, image: '/weapons/weapon_hkp2000.png' },
  { internal: 'p250',          displayName: 'P250',          category: 'pistols', subgroup: 'other_pistol',    team: 'both', cs2Id: 36,  csItem: 206, image: '/weapons/weapon_p250.png' },
  { internal: 'fiveseven',     displayName: 'Five-SeveN',    category: 'pistols', subgroup: 'other_pistol',    team: 'CT',   cs2Id: 3,   csItem: 208, image: '/weapons/weapon_fiveseven.png' },
  { internal: 'cz75a',         displayName: 'CZ75-Auto',     category: 'pistols', subgroup: 'other_pistol',    team: 'both', cs2Id: 63,  csItem: 207, image: '/weapons/weapon_cz75a.png' },
  { internal: 'tec9',          displayName: 'Tec-9',         category: 'pistols', subgroup: 'other_pistol',    team: 'T',    cs2Id: 30,  csItem: 205, image: '/weapons/weapon_tec9.png' },
  { internal: 'elite',         displayName: 'Dual Berettas', category: 'pistols', subgroup: 'other_pistol',    team: 'both', cs2Id: 2,   csItem: 204, image: '/weapons/weapon_elite.png' },
  { internal: 'deagle',        displayName: 'Desert Eagle',  category: 'pistols', subgroup: 'other_pistol',    team: 'both', cs2Id: 1,   csItem: 200, image: '/weapons/weapon_deagle.png' },
  { internal: 'revolver',      displayName: 'R8 Revolver',   category: 'pistols', subgroup: 'other_pistol',    team: 'both', cs2Id: 64,  csItem: 209, image: '/weapons/weapon_revolver.png' },
  { internal: 'taser',         displayName: 'Zeus x27',      category: 'pistols', subgroup: 'other_pistol',    team: 'both', cs2Id: 31,  csItem: 2,   image: '/weapons/weapon_taser.png' },

  // Heavies (shotguns + LMGs)
  { internal: 'nova',          displayName: 'Nova',          category: 'heavies', subgroup: 'shotgun',         team: 'both', cs2Id: 35,  csItem: 308, image: '/weapons/weapon_nova.png' },
  { internal: 'xm1014',        displayName: 'XM1014',        category: 'heavies', subgroup: 'shotgun',         team: 'both', cs2Id: 25,  csItem: 307, image: '/weapons/weapon_xm1014.png' },
  { internal: 'sawedoff',      displayName: 'Sawed-Off',     category: 'heavies', subgroup: 'shotgun',         team: 'T',    cs2Id: 29,  csItem: 310, image: '/weapons/weapon_sawedoff.png' },
  { internal: 'mag7',          displayName: 'MAG-7',         category: 'heavies', subgroup: 'shotgun',         team: 'CT',   cs2Id: 27,  csItem: 309, image: '/weapons/weapon_mag7.png' },
  { internal: 'm249',          displayName: 'M249',          category: 'heavies', subgroup: 'mg',              team: 'both', cs2Id: 14,  csItem: 311, image: '/weapons/weapon_m249.png' },
  { internal: 'negev',         displayName: 'Negev',         category: 'heavies', subgroup: 'mg',              team: 'both', cs2Id: 28,  csItem: 312, image: '/weapons/weapon_negev.png' },
];

export const KNIVES = [
  { internal: 'knife_karambit',        displayName: 'Karambit',         defindex: 507 },
  { internal: 'knife_butterfly',       displayName: 'Butterfly Knife',  defindex: 515 },
  { internal: 'knife_m9_bayonet',      displayName: 'M9 Bayonet',       defindex: 508 },
  { internal: 'bayonet',               displayName: 'Bayonet',          defindex: 500 },
  { internal: 'knife_css',             displayName: 'Classic Knife',    defindex: 503 },
  { internal: 'knife_flip',            displayName: 'Flip Knife',       defindex: 505 },
  { internal: 'knife_gut',             displayName: 'Gut Knife',        defindex: 506 },
  { internal: 'knife_tactical',        displayName: 'Huntsman Knife',   defindex: 509 },
  { internal: 'knife_falchion',        displayName: 'Falchion Knife',   defindex: 512 },
  { internal: 'knife_survival_bowie',  displayName: 'Bowie Knife',      defindex: 514 },
  { internal: 'knife_push',            displayName: 'Shadow Daggers',   defindex: 516 },
  { internal: 'knife_cord',            displayName: 'Paracord Knife',   defindex: 517 },
  { internal: 'knife_canis',           displayName: 'Survival Knife',   defindex: 518 },
  { internal: 'knife_ursus',           displayName: 'Ursus Knife',      defindex: 519 },
  { internal: 'knife_gypsy_jackknife', displayName: 'Navaja Knife',     defindex: 520 },
  { internal: 'knife_outdoor',         displayName: 'Nomad Knife',      defindex: 521 },
  { internal: 'knife_stiletto',        displayName: 'Stiletto Knife',   defindex: 522 },
  { internal: 'knife_widowmaker',      displayName: 'Talon Knife',      defindex: 523 },
  { internal: 'knife_skeleton',        displayName: 'Skeleton Knife',   defindex: 525 },
  { internal: 'knife_kukri',           displayName: 'Kukri Knife',      defindex: 526 },
];

export const CATEGORIES = {
  rifles:    { id: 'rifles',    labelKey: 'category.rifles',    icon: 'Crosshair' },
  smgs:      { id: 'smgs',      labelKey: 'category.smgs',      icon: 'Zap' },
  pistols:   { id: 'pistols',   labelKey: 'category.pistols',   icon: 'Target' },
  heavies:   { id: 'heavies',   labelKey: 'category.heavies',   icon: 'Dumbbell' },
  equipment: { id: 'equipment', labelKey: 'category.equipment', icon: 'Backpack' },
};

// Subgroup metadata: display order, category parent, label key
export const SUBGROUPS = {
  starting_pistol: { id: 'starting_pistol', parent: 'pistols', order: 0, labelKey: 'subgroup.starting_pistol' },
  other_pistol:    { id: 'other_pistol',    parent: 'pistols', order: 1, labelKey: 'subgroup.other_pistol' },
  smg:             { id: 'smg',             parent: 'smgs',    order: 0, labelKey: 'subgroup.smg' },
  mid_tier_rifle:  { id: 'mid_tier_rifle',  parent: 'rifles',  order: 0, labelKey: 'subgroup.mid_tier_rifle' },
  rifle:           { id: 'rifle',           parent: 'rifles',  order: 1, labelKey: 'subgroup.rifle' },
  sniper:          { id: 'sniper',          parent: 'rifles',  order: 2, labelKey: 'subgroup.sniper' },
  shotgun:         { id: 'shotgun',         parent: 'heavies', order: 0, labelKey: 'subgroup.shotgun' },
  mg:              { id: 'mg',              parent: 'heavies', order: 1, labelKey: 'subgroup.mg' },
};

// Returns weapons for a given category, grouped and sorted by subgroup order.
// Output shape: [{ subgroupId, labelKey, weapons: [...] }, ...]
export function groupBySubgroup(weapons, categoryId) {
  const entries = Object.values(SUBGROUPS)
    .filter((sg) => sg.parent === categoryId)
    .sort((a, b) => a.order - b.order);
  return entries
    .map((sg) => ({
      subgroupId: sg.id,
      labelKey: sg.labelKey,
      weapons: weapons.filter((w) => w.category === categoryId && w.subgroup === sg.id),
    }))
    .filter((g) => g.weapons.length > 0);
}

// Equipment "virtual weapons" — knife/gloves/agent slots.
// Each side (CT/T) has its own slot. Stored as weapons with special handling.
// Unlike WEAPONS (which have canonical English names that don't translate),
// these slot labels ARE translated, so they reference i18n keys via displayNameKey.
export const EQUIPMENT_SLOTS = [
  { internal: 'knife_ct',  displayNameKey: 'equipment.knife_ct',  slotType: 'knife',  team: 'CT' },
  { internal: 'knife_t',   displayNameKey: 'equipment.knife_t',   slotType: 'knife',  team: 'T'  },
  { internal: 'ct_gloves', displayNameKey: 'equipment.gloves_ct', slotType: 'gloves', team: 'CT' },
  { internal: 'tt_gloves', displayNameKey: 'equipment.gloves_t',  slotType: 'gloves', team: 'T'  },
  { internal: 'ct_agent',  displayNameKey: 'equipment.agent_ct',  slotType: 'agent',  team: 'CT' },
  { internal: 'tt_agent',  displayNameKey: 'equipment.agent_t',   slotType: 'agent',  team: 'T'  },
];

export function getWeaponByInternal(internal) {
  return WEAPONS.find((w) => w.internal === internal) ?? null;
}

export function getWeaponsBySection(section) {
  // section: 'ct' | 't' | 'shared'
  if (section === 'ct') return WEAPONS.filter((w) => w.team === 'CT');
  if (section === 't') return WEAPONS.filter((w) => w.team === 'T');
  return WEAPONS.filter((w) => w.team === 'both');
}

export function groupByCategory(weapons) {
  const grouped = { rifles: [], smgs: [], pistols: [], heavies: [] };
  for (const w of weapons) {
    if (grouped[w.category]) grouped[w.category].push(w);
  }
  return grouped;
}

export function getWeaponByDefindex(defindex) {
  const n = Number(defindex);
  return WEAPONS.find((w) => w.cs2Id === n) ?? null;
}

export function getWeaponByCsItem(csItem) {
  const n = Number(csItem);
  return WEAPONS.find((w) => w.csItem === n) ?? null;
}

export function getKnifeByDefindex(defindex) {
  const n = Number(defindex);
  return KNIVES.find((k) => k.defindex === n) ?? null;
}
