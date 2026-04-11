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
async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(options.headers || {}),
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (data.error) throw new Error(data.error);
  return data;
}

export function getUserProfile() {
  return request('/getUserProfile.php');
}

export function getSkins(team) {
  return request(`/skins.php?team=${encodeURIComponent(team)}&type=skins`);
}

export function getKnife(team) {
  return request(`/skins.php?team=${encodeURIComponent(team)}&type=knife`);
}

export function getGloves(team) {
  return request(`/skins.php?team=${encodeURIComponent(team)}&type=gloves`);
}

export function getAgent(team) {
  return request(`/skins.php?team=${encodeURIComponent(team)}&type=agent`);
}

export function saveSkin(params) {
  return request('/skins.php', { method: 'POST', body: toForm(params) });
}

export function saveKnife(params) {
  return request('/knife.php', { method: 'POST', body: toForm(params) });
}

export function logout() {
  window.location.href = `${API}/steamauth/logout.php`;
}

export function loginWithSteam() {
  window.location.href = `${API}/login-steam.php`;
}
