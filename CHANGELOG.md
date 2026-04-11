# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [SemVer](https://semver.org).

## [1.0.0] - <release date> — Complete rewrite

### Added
- Single-screen loadout editor with CT / T / Shared / Equipment sections visible at once
- Sticky right-sidebar editor (desktop) / bottom-sheet (mobile)
- Customized-state badge on weapon cards
- CT/T team highlight quick-switch in header
- Global search across all weapons
- Keyboard shortcuts: `/` focus search, `Ctrl+S` save, `Ctrl+Z` revert
- Three languages shipped: English, Portuguese (BR), Polish
- Proper CS2 in-game weapon display names (M4A4, M4A1-S, Five-SeveN, USP-S, Zeus x27, etc)
- Build-time branding config via `VITE_SERVER_NAME`, `VITE_SERVER_URL`, `VITE_DISCORD_URL`
- CS2-inspired dark theme with design tokens
- Skin picker with search, hover preview, and 4-column grid
- Wear slider with Factory New → Battle-Scarred tier coloring
- Radix-based accessible slider, switch, dialog, tooltip primitives
- GitHub Actions build check on every PR and release workflow on tag push

### Fixed
- Weapon cards showed raw CS2 internal codes (`m4a1`, `fiveseven`, `hkp2000`) instead of in-game names — fixed via explicit display name mapping
- Historical confusion where `weapon_m4a1` is actually the M4A4 (not the M4A1-S) is now correctly reflected in the UI
- Polish string "Wybierz skin" leaked into the knife customiser UI — removed
- Category "PM" (Polish: Pistolet Maszynowy) renamed to "SMGs"
- Wear input silently broke when users typed comma decimal — backend now accepts both
- PHP 8.2 deprecation in `steamauth/openid.php` broke Steam OpenID login flow — fixed
- `copy-backend.js` was unconditionally deleting `config.php` on every build — fixed
- Backend `index.php` returned Polish "API działa poprawnie" — now returns plain `{status: "ok"}`

### Changed
- Complete React frontend rewrite into `frontend/src/{lib,hooks,pages,components/{layout,arsenal,editor,popups,ui},locales}` structure
- All components below ~170 lines
- Tailwind v4 replaces ad-hoc CSS files
- Self-hosted fonts via `@fontsource` (no Google Fonts runtime call)
- PHP backend untouched except for 3 narrow fixes

[1.0.0]: https://github.com/Yuhtin/cs2-skins-website/releases/tag/v1.0.0
