# Contributing to cs2-skins-website

Thank you for considering a contribution. This guide covers local development, code style, and how to propose changes.

## Local development

### Prerequisites

- Node 20+ (nvm recommended)
- Git
- Access to a running [cs2-WeaponPaints](https://github.com/Nereziel/cs2-WeaponPaints) MySQL instance and PHP backend

### Setup

```bash
git clone https://github.com/Yuhtin/cs2-skins-website.git
cd cs2-skins-website
npm install
cd frontend && npm install
```

### Run the dev server

```bash
cd frontend
npm run dev
```

The Vite dev server runs at `http://localhost:5173` with hot reload. The `/api` path proxies to whatever `VITE_DEV_PROXY_TARGET` points at (default: `http://localhost:8080`). Override by setting it in `frontend/.env.local`:

```
VITE_DEV_PROXY_TARGET="https://your-dev-backend.example.com"
```

### Build for production

```bash
cd frontend
npm run build
```

Output goes to `dist/` at the repo root.

## Code style

- **Formatting:** Prettier (config in `.prettierrc`)
- **Linting:** ESLint (config in `eslint.config.js`)
- **File size:** keep files under 150 lines where possible. If one grows larger, split by responsibility.
- **Naming:** React components in PascalCase (`WeaponCard.jsx`), hooks in camelCase with `use` prefix (`useLoadout.js`).

## Commit convention

Conventional commits. Prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `i18n:`, `style:`, `ci:`, `test:`.

Example:

```
feat(editor): add sticker slot preview

Wear slots show the current sticker image when applied, fall back to
a Plus placeholder otherwise. Click opens the picker popup.
```

## Adding a new language

1. Copy `frontend/src/locales/en.json` to `frontend/src/locales/<locale-code>.json`
2. Translate every value (keys stay in English)
3. Add an entry to the `LOCALES` map in `frontend/src/lib/i18n.js`
4. Add the language to the dropdown in `frontend/src/components/layout/LanguageSwitch.jsx`

## Pull requests

- Fork and branch from `master`
- Branch naming: `feat/your-feature`, `fix/your-bug`
- Run the linter and build before pushing
- Include screenshots or GIFs for UI changes
- CI will validate the build on every PR

## Questions?

Open an issue with the `question` label.
