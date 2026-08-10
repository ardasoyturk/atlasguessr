

# Atlasguessr

Atlasguessr is an educational guessing game where players identify Turkish university programs from clues. The game is offline-first and works as an installable PWA.

## Features
- Guess both university and program names from hints
- Hints include city, university type, scholarship, 4-year ranking history, and ranking category
- Offline support with Service Worker caching
- Share your results
- Responsive UI with dark mode support

## Tech Stack
- [Astro](https://astro.build/) + [Preact](https://preactjs.com/) islands
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) via Astro Cloudflare adapter
- [Radix UI](https://www.radix-ui.com/) and custom UI components
- PWA support (manifest + service worker)

## Getting Started

### Prerequisites
- [Bun](https://bun.com/) (v1.0+)

### Installation
```bash
bun install
```

### Run Development Server
```bash
bun run dev
```
Visit [http://localhost:4321](http://localhost:4321).

### Type Check
```bash
bun run typecheck
```

### Build and Preview
```bash
bun run build
bun run preview
```

### Deploy to Cloudflare Workers
```bash
bun run deploy
```

## Project Data
University/program data lives in `/public/data/*.json` and is loaded on the client for gameplay and offline caching.
