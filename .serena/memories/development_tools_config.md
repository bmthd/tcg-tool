# Development Tools Configuration

## Vite Configuration
- **Port**: 3000 (development server)
- **Plugins**: TanStack Router, React, Tailwind CSS
- **Path Alias**: `@` -> `./src`
- **Test Environment**: jsdom with global test utilities
- **Auto Code Splitting**: Enabled for TanStack Router

## Biome Configuration
- **Schema Version**: 1.9.4
- **Formatter**: Enabled with tab indentation
- **Linter**: Enabled with recommended rules
- **Import Organization**: Automatic
- **Ignored Files**: `src/routeTree.gen.ts` (auto-generated)
- **Quote Style**: Double quotes for JavaScript

## TypeScript Configuration
- **Target**: ES2022
- **JSX**: react-jsx (React 17+ transform)
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **Additional Checks**: 
  - noUnusedLocals
  - noUnusedParameters
  - noFallthroughCasesInSwitch
  - noUncheckedSideEffectImports

## Testing Setup
- **Framework**: Vitest with React Testing Library
- **Environment**: jsdom
- **Setup File**: `./src/test/setup.ts`
- **Global**: Test utilities available globally

## Environment Configuration
- **T3 Env**: Type-safe environment variables in `src/env.ts`
- **Validation**: Runtime environment validation
- **Usage**: Import from `@/env` for type safety

## Build Tools
- **Package Manager**: Bun (lockfile: bun.lock)
- **Build**: Vite build + TypeScript compilation
- **Preview**: Vite preview for production builds

## Development Workflow
1. Install: `bun install`
2. Develop: `bun run dev` (localhost:3000)
3. Quality: `bun run check` (format + lint)
4. Test: `bun run test`
5. Build: `bun run build`