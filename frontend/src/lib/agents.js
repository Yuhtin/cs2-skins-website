// Caches the agents catalog on first call. All non-default agents have entries
// like { team: 3, image: "https://raw.githubusercontent.com/.../agent-4619.png",
// model: "ctm_st6/ctm_st6_variantj", agent_name: "'Blueberries' Buckshot | NSWC SEAL" }.
// The backend returns the player's chosen agent as a model string; we look it up
// here to get the image URL + display name.

let CATALOG_CACHE = null;
let CATALOG_PROMISE = null;

async function loadCatalog() {
  if (CATALOG_CACHE) return CATALOG_CACHE;
  if (!CATALOG_PROMISE) {
    CATALOG_PROMISE = fetch('/data/agents_en.json')
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

// Kick off the preload on module import so the catalog is warm by the time
// any consumer asks for an agent.
loadCatalog();

// Returns { image, name } for a given model string, or null if not found.
export function getAgentByModel(model) {
  if (!CATALOG_CACHE || !model) return null;
  const entry = CATALOG_CACHE.find((a) => a.model === model);
  if (!entry) return null;
  return { image: entry.image, name: entry.agent_name };
}

// Returns the default agent image + name for a team ('CT' or 'T').
export function getDefaultAgent(team) {
  if (team === 'CT') return { image: '/agents/ct_sas.png', name: 'SAS' };
  return { image: '/agents/tt_phoenix.png', name: 'Phoenix' };
}

export { loadCatalog as ensureAgentCatalog };
