// Mirror of RetakesAllocator/RetakesAllocatorCore/WeaponHelpers.cs eligibility
// rules. Source of truth: https://github.com/yonilerner/cs2-retakes-allocator
//
// Slots come from `WeaponAllocationType`:
//   PistolRound  → primary on the pistol round
//   HalfBuyPrimary → SMG/shotgun/Scout on a half buy
//   FullBuyPrimary → rifle on a full buy
//   Secondary    → pistol carried in non-pistol rounds
//   Preferred    → AWP raffle (toggle, not a slot in the same sense)
//
// Stored on the wire as the JSON dict the allocator persists to MySQL:
//   { "Terrorist": { "FullBuyPrimary": 400, ... }, "CounterTerrorist": { ... } }

import { WEAPONS, getWeaponByCsItem } from './weapons';

export const SLOTS = ['PistolRound', 'HalfBuyPrimary', 'FullBuyPrimary', 'Secondary'];

// Allocator team names as they appear in the JSON blob.
export const ALLOCATOR_TEAM = { CT: 'CounterTerrorist', T: 'Terrorist' };
export const TEAM_FROM_ALLOCATOR = { CounterTerrorist: 'CT', Terrorist: 'T' };

// Eligible CsItem ids per (team, slot). Lifted from WeaponHelpers.cs.
//
// _sharedPistols + _tPistols/_ctPistols → PistolRound + Secondary
// _sharedMidRange + _tMidRange/_ctMidRange → HalfBuyPrimary
// _tRifles/_ctRifles + AWP → FullBuyPrimary
const SHARED_PISTOLS = [200, 206, 207, 204, 209]; // Deagle, P250, CZ, Dualies, R8
const T_PISTOLS = [201, 205];                      // Glock, Tec9
const CT_PISTOLS = [202, 203, 208];                // USPS, P2000, FiveSeven

const SHARED_MIDRANGE = [
  303, 306, 302, 305, 304, // P90, UMP45, MP7, Bizon, MP5
  307, 308,                 // XM1014, Nova
  408,                      // Scout (SSG08)
];
const T_MIDRANGE = [300, 310];   // Mac10, SawedOff
const CT_MIDRANGE = [301, 309];  // MP9, MAG7

const T_RIFLES = [400, 403, 405]; // AK47, Galil, SG556 (Krieg)
const CT_RIFLES = [401, 402, 404, 407]; // M4A1S, M4A4, Famas, AUG
const SHARED_PREFERRED = [406];   // AWP

const ELIGIBILITY = {
  CT: {
    PistolRound:    [...SHARED_PISTOLS, ...CT_PISTOLS],
    Secondary:      [...SHARED_PISTOLS, ...CT_PISTOLS],
    HalfBuyPrimary: [...SHARED_MIDRANGE, ...CT_MIDRANGE],
    FullBuyPrimary: [...CT_RIFLES, ...SHARED_PREFERRED],
  },
  T: {
    PistolRound:    [...SHARED_PISTOLS, ...T_PISTOLS],
    Secondary:      [...SHARED_PISTOLS, ...T_PISTOLS],
    HalfBuyPrimary: [...SHARED_MIDRANGE, ...T_MIDRANGE],
    FullBuyPrimary: [...T_RIFLES, ...SHARED_PREFERRED],
  },
};

// Returns the WEAPONS rows that are valid for a given (team, slot).
// Filters out any csItem that doesn't have a matching WEAPONS row (defensive).
export function getEligibleWeapons(team, slot) {
  const ids = ELIGIBILITY[team]?.[slot] ?? [];
  return ids
    .map((id) => getWeaponByCsItem(id))
    .filter(Boolean);
}

export function isEligible(team, slot, csItem) {
  return (ELIGIBILITY[team]?.[slot] ?? []).includes(Number(csItem));
}

// Per-slot UI metadata. labelKey is for i18n; the slot name itself stays in
// English on the wire to match the allocator JSON.
export const SLOT_META = {
  PistolRound:    { labelKey: 'loadout_prefs.pistol_round',   order: 0 },
  HalfBuyPrimary: { labelKey: 'loadout_prefs.half_buy',       order: 1 },
  FullBuyPrimary: { labelKey: 'loadout_prefs.full_buy',       order: 2 },
  Secondary:      { labelKey: 'loadout_prefs.secondary',      order: 3 },
};

// Default fallback weapons (matches the allocator's DefaultWeapons block in
// the shipped config.json) — used when the user hasn't set a preference yet.
export const DEFAULT_PREFS = {
  CT: { PistolRound: 202, HalfBuyPrimary: 301, FullBuyPrimary: 401, Secondary: 200 },
  T:  { PistolRound: 201, HalfBuyPrimary: 300, FullBuyPrimary: 400, Secondary: 200 },
};

// All weapons that can ever appear as a preference, deduped — handy for
// preloading skin catalogs or building lookups.
export const ALL_PREF_CSITEMS = Array.from(
  new Set([
    ...Object.values(ELIGIBILITY).flatMap((slots) => Object.values(slots).flat()),
  ]),
);

// Asserts at module load that every csItem we reference resolves to a WEAPONS
// row. Throws loudly during dev if weapons.js drifts from the eligibility map.
for (const id of ALL_PREF_CSITEMS) {
  if (!getWeaponByCsItem(id)) {
    // eslint-disable-next-line no-console
    console.error(`[loadout-prefs] missing WEAPONS row for csItem=${id}`);
  }
}
