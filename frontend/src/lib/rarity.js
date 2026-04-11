// Skin rarity color lookup.
// Loads frontend/public/data/skin_rarity.json (~40KB, 2072 entries keyed by
// "<defindex>:<paint>" -> hex color string). Preloaded on module import so
// components can synchronously resolve rarity colors during render once the
// fetch has completed.

let RARITY_CACHE = null;
let RARITY_PROMISE = null;

async function loadRarity() {
  if (RARITY_CACHE) return RARITY_CACHE;
  if (!RARITY_PROMISE) {
    RARITY_PROMISE = fetch('/data/skin_rarity.json')
      .then((res) => res.json())
      .then((data) => {
        RARITY_CACHE = data && typeof data === 'object' ? data : {};
        return RARITY_CACHE;
      })
      .catch(() => {
        RARITY_CACHE = {};
        return RARITY_CACHE;
      });
  }
  return RARITY_PROMISE;
}

loadRarity();

// Returns the hex color string for a (defindex, paint) pair, or null.
export function getRarityColor(defindex, paint) {
  if (!RARITY_CACHE) return null;
  if (!defindex || !paint || Number(paint) === 0) return null;
  return RARITY_CACHE[`${defindex}:${paint}`] ?? null;
}

export { loadRarity as ensureRarityCatalog };
