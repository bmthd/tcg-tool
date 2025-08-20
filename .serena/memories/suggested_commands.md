# Suggested Commands for TCG Tool Development

## Development Commands

### Starting Development Server
```bash
bun install          # Install dependencies
bun run dev          # Start development server on port 3000
# Alternative:
bun run start        # Same as dev command
```

### Building and Production
```bash
bun run build        # Build for production (runs vite build && tsc)
bun run serve        # Preview production build locally
```

### Testing
```bash
bun run test         # Run all tests with Vitest
```

### Code Quality
```bash
bun run format       # Format code with Biome
bun run lint         # Lint code with Biome
bun run check        # Run both format and lint checks
bun run typecheck    # Type check with TypeScript (no emit)
```

## System Commands (Linux)
```bash
ls                   # List files and directories
cd <directory>       # Change directory
grep <pattern>       # Search for patterns in files
find <path> -name    # Find files by name
git status           # Check git status
git diff             # Show changes
git add .            # Stage all changes
git commit -m        # Commit with message
```

## Package Management (Bun)
```bash
bun add <package>           # Add dependency
bun add -d <package>        # Add dev dependency
bun remove <package>        # Remove dependency
bun outdated               # Check for outdated packages
bun update                 # Update packages
```

## Recommended Workflow
1. `bun install` - Install dependencies
2. `bun run dev` - Start development
3. Make changes
4. `bun run check` - Check code quality
5. `bun run test` - Run tests
6. `bun run typecheck` - Verify types
7. `bun run build` - Build for production (optional)