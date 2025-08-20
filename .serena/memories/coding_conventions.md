# Coding Conventions and Style Guide

## TypeScript Configuration
- Target: ES2022
- Strict mode enabled
- No unused locals or parameters allowed
- Module resolution: bundler
- Base URL: "." with path alias `@/*` -> `./src/*`

## Code Style (Biome Configuration)
- **Indentation**: Tabs (not spaces)
- **Quote Style**: Double quotes for JavaScript/TypeScript
- **Import Organization**: Automatically organized
- **Recommended Rules**: Biome recommended linting rules enabled

## File and Directory Structure
```
src/
├── components/     # Reusable UI components
├── views/         # Page-level components with business logic
├── ui/            # Low-level UI components (layout, typography, etc.)
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── data/          # Static data and mock data
├── routes/        # TanStack Router route definitions
├── integrations/  # Third-party integrations
└── test/          # Test setup and utilities
```

## Naming Conventions
- **Files**: kebab-case (e.g., `draw-calc.tsx`, `form-hook.tsx`)
- **Components**: PascalCase (e.g., `DrawCalcPage`, `AppHeader`)
- **Functions**: camelCase (e.g., `useViewport`, `switchViewport`)
- **Constants**: camelCase or UPPER_CASE for true constants
- **Types**: PascalCase (e.g., `Output`, `MyRouterContext`)

## Component Conventions
- Use functional components with hooks
- Export components as named exports
- Use TypeScript interfaces for props
- Prefer composition over inheritance
- Use `React.FC` type annotation for functional components

## Import Organization
- External libraries first
- Internal imports grouped by type (@/ alias)
- Relative imports last
- Biome automatically organizes imports

## Styling
- Use Tailwind CSS classes
- Utilize the `cx` utility function for conditional classes
- Dark theme by default (slate color scheme)
- Responsive design with mobile-first approach

## Documentation
- JSDoc comments for utility functions (see `cx.ts` example)
- Type annotations for complex types
- Japanese comments for business logic where appropriate