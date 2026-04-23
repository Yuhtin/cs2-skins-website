import { CONFIG } from '../config';

const API = CONFIG.apiUrl;

// Stringify params for form-encoded POST bodies.
// Filters out null/undefined so the PHP backend doesn't receive the literal
// strings "null"/"undefined" for unset fields.
function toForm(params) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined) body.append(k, String(v));
  }
  return body.toString();
}

// Shared fetch wrapper: JSON response, credentials included, error normalization.
async function post(path, params) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: toForm(params),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (data && typeof data === 'object' && data.error) throw new Error(data.error);
  return data;
}

async function get(path) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (data && typeof data === 'object' && data.error) throw new Error(data.error);
  return data;
}

export function getUserProfile() {
  return get('/getUserProfile.php');
}

// Returns an array of skin rows for the given team.
export function getSkins(team) {
  return post('/skins.php', { action: 'getall', team });
}

// Returns { knife: 'weapon_xxx' }
export function getKnife(team) {
  return post('/knife.php', { action: 'get', team });
}

// Returns current gloves data (shape depends on backend)
export function getGloves(team) {
  return post('/skins.php', { action: 'gloves_addon_data', team });
}

// Returns current agent data
export function getAgent(team) {
  return post('/skins.php', { action: 'agent_get', team });
}

// Save a single skin. Caller provides action-compatible params.
export function saveSkin(params) {
  return post('/skins.php', { action: 'save', ...params });
}

// Save knife. team required; knife is weapon name string.
export function saveKnife(params) {
  return post('/knife.php', { action: 'set', ...params });
}

// Save agent
export function saveAgent(params) {
  return post('/skins.php', { action: 'agent_save', ...params });
}

// Save gloves
export function saveGloves(params) {
  return post('/skins.php', { action: 'gloves_save', ...params });
}

// --- RetakesAllocator weapon preferences ---
// See backend/loadout-prefs.php for the JSON shape.

export function getLoadoutPrefs() {
  return post('/loadout-prefs.php', { action: 'get' });
}

// team: 'CT' | 'T'   slot: 'PistolRound' | 'HalfBuyPrimary' | 'FullBuyPrimary' | 'Secondary' | 'Preferred'
// csItem: integer (CSSharp CsItem enum) or null to clear
export function setLoadoutPref({ team, slot, csItem }) {
  return post('/loadout-prefs.php', {
    action: 'set',
    team,
    slot,
    csItem: csItem ?? '',
  });
}

export function logout() {
  window.location.href = `${API}/steamauth/logout.php`;
}

export function loginWithSteam() {
  window.location.href = `${API}/login-steam.php`;
}

// Log in with a 6-character code obtained from the CS2 server chat (`!skins` command).
// Success sets the PHP session cookie; caller should reload the page to pick up the new user.
export function loginWithCode(code) {
  return post('/login-code.php', { code });
}
