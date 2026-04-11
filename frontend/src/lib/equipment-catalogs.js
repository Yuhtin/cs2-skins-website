// Shared catalog loaders for gloves and knife skin catalogs.
// Agents catalog lives in lib/agents.js (already exists from X2.4).
// Knives are in the main skins catalog (lib/skins.js) filtered by defindex.

let GLOVES_CACHE = null;
let GLOVES_PROMISE = null;

async function loadGlovesCatalog() {
  if (GLOVES_CACHE) return GLOVES_CACHE;
  if (!GLOVES_PROMISE) {
    GLOVES_PROMISE = fetch('/data/gloves_en.json')
      .then((res) => res.json())
      .then((data) => {
        GLOVES_CACHE = Array.isArray(data) ? data : [];
        return GLOVES_CACHE;
      })
      .catch(() => {
        GLOVES_CACHE = [];
        return GLOVES_CACHE;
      });
  }
  return GLOVES_PROMISE;
}

loadGlovesCatalog();

export function getGlovesCatalog() {
  return GLOVES_CACHE || [];
}

export { loadGlovesCatalog as ensureGlovesCatalog };
