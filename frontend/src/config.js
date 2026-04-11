// Build-time config pulled from env vars.
// Defaults are generic so forks work out of the box.
// Maintainer's deploy sets these in .env.production.local (gitignored).

export const CONFIG = {
  serverName: import.meta.env.VITE_SERVER_NAME || 'CS2 Weapon Paints',
  serverUrl: import.meta.env.VITE_SERVER_URL || null,
  discordUrl: import.meta.env.VITE_DISCORD_URL || null,
  apiUrl: import.meta.env.VITE_API_URL || '/api',
};
