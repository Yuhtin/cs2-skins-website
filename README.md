# cs2-skins-website

Open-source web panel for the [cs2-WeaponPaints](https://github.com/Nereziel/cs2-WeaponPaints) CounterStrikeSharp plugin. Customize your CS2 loadout (skins, wear, stickers, keychains, knives, gloves, agents) from a browser, with preferences saved per Steam account and applied server-side by the WeaponPaints plugin.

**Live demo:** [skins.daviduarte.com.br](https://skins.daviduarte.com.br)

## Screenshots

_Screenshots will be added in the next release pass._

## Features

- Single-screen loadout editor with CT / T / Shared / Equipment sections all visible at once
- Inline weapon editing in a sticky sidebar (no modal popups blocking the arsenal)
- Correct CS2 in-game weapon names (M4A4, M4A1-S, Five-SeveN, USP-S, Zeus x27, etc — no more raw internal codes)
- Customized-state indicators on weapon cards
- Skin picker with search and live preview
- Wear slider with Factory New → Battle-Scarred tier coloring
- Pattern seed input with randomize
- Nametag and StatTrak support
- 4 sticker slots per weapon
- Keychain slot with offset X/Y
- Internationalization: English, Portuguese (BR), Polish — more welcome via PRs
- Mobile responsive with bottom-sheet editor
- CS2-inspired dark theme (no Valve assets reproduced)
- Steam OpenID authentication

## Requirements

- **Server:** PHP 8.2+ with PDO MySQL extension, any modern web server (Apache/Nginx)
- **Database:** MySQL 8 — the same one used by the [cs2-WeaponPaints plugin](https://github.com/Nereziel/cs2-WeaponPaints). No schema changes required.
- **Build:** Node 20+ (only for building the frontend; not needed at runtime)
- **Steam Web API Key:** [register one](https://steamcommunity.com/dev/apikey) for Steam OpenID login

## Quick start

```bash
git clone https://github.com/Yuhtin/cs2-skins-website.git
cd cs2-skins-website

# Build the frontend (one-time, produces dist/)
npm ci
cd frontend && npm ci && npm run build

# Create backend config
cp backend/config.sample.php backend/config.php
# Edit backend/config.php with your Steam API key and MySQL credentials

# Point your web server's document root at ./dist
```

## Configuration

### Backend (`backend/config.php`)

```php
define('STEAM_API_KEY', 'YOUR_STEAM_WEB_API_KEY');
define('DOMAIN_NAME', 'https://your.domain.com');
define('DB_HOST', 'your-mysql-host');
define('DB_PORT', '3306');
define('DB_NAME', 'weaponpaints');
define('DB_USER', 'weaponpaints_user');
define('DB_PASS', 'your-db-password');
```

### Frontend branding (build-time env vars)

Create `frontend/.env.production.local`:

```
VITE_SERVER_NAME="Your Server Name"
VITE_SERVER_URL="steam://connect/YOUR.IP.HERE:27015"   # optional
VITE_DISCORD_URL="https://discord.gg/your-invite"       # optional
```

These render on the login page header and optional badge links. All three are optional — defaults ship with generic strings.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for local dev setup and contribution guidelines.

## License

MIT — see [LICENSE](LICENSE).

## Credits

- [skullboypl/cs2-weapon-paint-website](https://github.com/skullboypl/cs2-weapon-paint-website) — upstream fork that this project started from
- [Nereziel/cs2-WeaponPaints](https://github.com/Nereziel/cs2-WeaponPaints) — the CS2 server-side plugin this panel controls, and the canonical skin/sticker/keychain catalog
- [Lucide](https://lucide.dev), [Radix UI](https://radix-ui.com), [Tailwind CSS](https://tailwindcss.com), [Vite](https://vitejs.dev), [React](https://react.dev)
