# Task Completion Checklist

When completing any coding task in this project, ensure you follow this checklist:

## Before Implementing
- [ ] Understand the existing code structure and conventions
- [ ] Check existing components and patterns to follow
- [ ] Ensure TypeScript types are properly defined
- [ ] Verify the path alias (@/) is used correctly

## During Implementation
- [ ] Follow the established file naming conventions (kebab-case)
- [ ] Use tabs for indentation (not spaces)
- [ ] Use double quotes for strings
- [ ] Implement proper TypeScript typing
- [ ] Use the `cx` utility for conditional CSS classes
- [ ] Follow the component structure patterns
- [ ] Add JSDoc comments for utility functions

## After Implementation
- [ ] Run `bun run check` to ensure code quality (format + lint)
- [ ] Run `bun run typecheck` to verify TypeScript compliance
- [ ] Run `bun run test` to ensure tests pass
- [ ] Test the functionality manually with `bun run dev`
- [ ] Ensure no console errors or warnings

## Final Verification
- [ ] Code follows Biome formatting rules
- [ ] No linting errors
- [ ] TypeScript compilation succeeds
- [ ] All tests pass
- [ ] Feature works as expected in browser

## Commands to Run Before Completion
```bash
bun run check      # Format and lint
bun run typecheck  # Type checking
bun run test       # Run tests
```

If any of these commands fail, address the issues before considering the task complete.