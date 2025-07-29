# Atlasguessr

Atlasguessr is an educational guessing game where players try to identify Turkish university programs based on a set of clues. The game is designed to be played offline and provides a fun, interactive way to learn about universities and their programs in Turkey.

## Features
- Guess both the university and the program name using provided hints
- Hints include city, university type, scholarship status, last 4 years' rankings, and program type
- Playable offline thanks to Service Worker caching
- Share your results with friends
- Modern, responsive UI with dark mode support

## Technologies Used
- [Next.js (App Router)](https://nextjs.org/docs/app) for server-side rendering and routing
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [React](https://react.dev/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) for offline support
- [Radix UI](https://www.radix-ui.com/) and custom UI components
- [Google Analytics](https://analytics.google.com/) & [Tag Manager](https://tagmanager.google.com/) integration
- [PWA (Progressive Web App)](https://web.dev/progressive-web-apps/) features (manifest, offline, installable)

## Getting Started

### Prerequisites
- [Bun](https://bun.com/) (v1.0 or higher recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/atlasguessr.git
   cd atlasguessr
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

### Running the Development Server
```bash
bun run dev
```
Visit [http://localhost:3000](http://localhost:3000) to play the game locally.

### Building for Production
```bash
bun run build
bun run start
```

### Offline Support
Atlasguessr is a PWA and works offline after the first load. Data files and static assets are cached using a custom Service Worker.

## Data
All university and program data is stored in JSON files under `/public/data/`. The game loads and caches these files for offline play.

## Vibe Coding & AI Collaboration
This project was built as a **vibe coding** experiment without writing almost a single line of code, leveraging the power of modern AI tools:
- **GPT-4.1** by **OpenAI**
- **Claude 4 Sonnet** by **Anthropic**
- **v0** by **Vercel**

AI was used for brainstorming, code generation, and UI prototyping, making the development process fast and fun.
