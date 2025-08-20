# TCG Tool - Project Overview

## Purpose
This is a Trading Card Game (TCG) draw probability calculator application. The main feature is a "ドロー確率計算機" (draw probability calculator) that helps players calculate the probability of drawing specific cards from their deck in trading card games.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6 with Bun as package manager
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Store and TanStack React Form
- **Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS 4 with custom dark theme (slate colors)
- **Testing**: Vitest with React Testing Library and jsdom
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Icons**: Lucide React
- **Validation**: Valibot and Zod
- **Utilities**: clsx, tailwind-merge, remeda

## Key Features
- Draw probability calculator for TCG
- Japanese interface (ドロー確率計算機)
- Dark theme UI with slate color scheme
- Responsive design
- Mathematical probability calculations using BigInt for precision

## Architecture
- File-based routing with TanStack Router
- Component-based architecture with separation of concerns
- Utility-first CSS with Tailwind
- Strong TypeScript typing throughout
- Modern React patterns with hooks and context