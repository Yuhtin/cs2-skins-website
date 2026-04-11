// Shared skin catalog loader with module-level cache and preload-on-import.
// Both the loadout enrichment (useLoadout) and the SkinPicker consume this.

let CATALOG_CACHE = null;
let CATALOG_PROMISE = null;

async function loadCatalog() {
  if (CATALOG_CACHE) return CATALOG_CACHE;
  if (!CATALOG_PROMISE) {
    CATALOG_PROMISE = fetch('/data/skins_en.json')
      .then((res) => res.json())
      .then((data) => {
        CATALOG_CACHE = Array.isArray(data) ? data : [];
        return CATALOG_CACHE;
      })
      .catch(() => {
        CATALOG_CACHE = [];
        return CATALOG_CACHE;
      });
  }
  return CATALOG_PROMISE;
}

// Preload on module import so the catalog is warm for first-paint consumers.
loadCatalog();

// Returns the full skin entry for a given (weapon_defindex, paint_id) pair,
// or null if not found. paint is compared as string since the catalog stores
// it as string ("0", "707", "1207").
export function getSkinByDefindexAndPaint(defindex, paint) {
  if (!CATALOG_CACHE) return null;
  const d = Number(defindex);
  const p = String(paint ?? '');
  return CATALOG_CACHE.find((s) => s.weapon_defindex === d && String(s.paint) === p) ?? null;
}

// Returns all skins for a given weapon defindex. Used by SkinPicker.
export function getSkinsForWeapon(defindex) {
  if (!CATALOG_CACHE) return [];
  const d = Number(defindex);
  return CATALOG_CACHE.filter((s) => s.weapon_defindex === d);
}

export { loadCatalog as ensureSkinCatalog };
