# Design System

Visual language and component guidelines for cs2-skins-website.

## Philosophy

This panel reads as a natural extension of the CS2 in-game UI — dark blue-black base with orange accents, condensed display type, and subtle motion. **No Valve assets are reproduced.** All icons, logos, and team emblems are original abstract shapes.

## Color tokens

All tokens live in `frontend/src/index.css` as Tailwind v4 `@theme` variables.

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0B0F17` | Main background |
| `--color-surface` | `#141A26` | Card backgrounds |
| `--color-elevated` | `#1C2436` | Editor panel, hover state |
| `--color-subtle` | `#2A3349` | Low-contrast borders |
| `--color-border` | `#3B4A6B` | Focus/selection borders |
| `--color-fg` | `#EEF2FA` | Primary text |
| `--color-muted` | `#8A97B0` | Secondary text, labels |
| `--color-faint` | `#5A6885` | Metadata, hints |
| `--color-accent` | `#F29E38` | Primary (orange) |
| `--color-accent2` | `#5BA3FF` | Secondary (cyan) |
| `--color-success` | `#4ADE80` | Save success |
| `--color-danger` | `#F75E5E` | Destructive |

## Typography

- **Interface:** Inter variable, via `@fontsource-variable/inter`
- **Display:** Barlow Condensed, 400/600/700 weights
- **Mono:** JetBrains Mono

## Spacing

4px base unit. Use Tailwind spacing classes: `gap-1` (4px), `gap-2` (8px), etc.

## Motion

- Transitions: 120–180ms, `ease-out`
- Hover on cards: `translateY(-2px)` + border tint
- Selection: `shadow-glow` (ring + radial glow in accent)
- Editor cross-fade on weapon switch: 160ms
- No animation over 250ms

## Iconography

- **Library:** `lucide-react` for generic icons
- **Custom SVGs:** `IconCtShield`, `IconTShield` in `frontend/src/components/ui/` — abstract geometric shapes. Always drawn fresh; never copy Valve assets.

## Component state contract

Every interactive component should have these states visually differentiated:

1. **Default** — calm, low-contrast
2. **Hover** — slight elevation or border tint
3. **Focus-visible** — `ring-2 ring-accent2/50`
4. **Selected / active** — border accent + glow
5. **Disabled** — `opacity-50 cursor-not-allowed`

## Do / don't

**Do:**
- Use design tokens via Tailwind utility classes
- Keep file sizes under 150 lines
- Match existing spacing/radius/motion patterns

**Don't:**
- Hardcode hex colors
- Copy Valve assets (logos, fonts, icons)
- Use emoji for icons — use Lucide SVGs instead
