# Arete — Fitness Tracking App

A modern fitness tracking web application built with React, featuring workout logging, progress statistics, AI-powered coaching (Gemini API), and nutritional guidance.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Styling | **Tailwind CSS v3** (with PostCSS & Autoprefixer) |
| Icons | Lucide React |
| Charts | Recharts |
| Build Tool | Create React App |
| Deployment | Vercel |

## Styling Architecture

The project uses **Tailwind CSS** as its primary styling solution.

### Key files

| File | Purpose |
|---|---|
| `tailwind.config.js` | Tailwind configuration: custom colors, animations, and keyframes |
| `postcss.config.js` | PostCSS pipeline (tailwindcss + autoprefixer) |
| `src/index.css` | Global design tokens (CSS variables), Tailwind `@layer` component & utility overrides, keyframe definitions, and light-mode overrides |

### Design tokens

Custom design tokens are defined as CSS variables in `src/index.css` and registered in the Tailwind theme inside `tailwind.config.js`:

```
--accent / #f59e0b       →  text-accent, bg-accent, border-accent
--accent-dark / #92400e  →  text-accent-dark, bg-accent-dark
```

### Custom component classes (`@layer components`)

Reusable Tailwind component classes defined in `src/index.css`:

- `.glass` — glass-morphism card (slate backdrop blur)
- `.glass-amber` — amber-tinted glass card
- `.gradient-text` — amber gradient text
- `.glow-border` / `.glow-border-blue` — glowing box-shadow borders
- `.card-hover` — lift-on-hover card effect
- `.shimmer` — skeleton loading shimmer
- `.pulse-ring` — pulsing ring indicator
- `.float` — floating / levitating animation
- `.progress-bar` — animated fill progress bar
- `.animated-gradient` — shifting background gradient
- `.text-shadow-sm` / `.text-shadow-lg` / `.text-glow` — text shadow utilities

### Custom animations

All animations are registered in `tailwind.config.js` so they are available as `animate-*` utilities:

| Class | Effect |
|---|---|
| `animate-slide-up` | Slide in from below |
| `animate-fade-in-scale` | Fade in while scaling up |
| `animate-alarm-flash` | Pulsing glow flash |
| `animate-shimmer` | Loading shimmer sweep |
| `animate-pulse-ring` | Expanding ring pulse |
| `animate-float` | Gentle floating bob |
| `animate-gradient-shift` | Shifting gradient background |

### Theming

The application supports **dark mode** (default) and **light mode**, toggled by setting `data-theme="light"` on the `<html>` element. Light-mode color overrides are defined via `[data-theme="light"]` selectors in `src/index.css`.

## Available Scripts

```bash
npm start      # Start development server at http://localhost:3000
npm run build  # Create an optimized production build
npm test       # Run tests in interactive watch mode
```
