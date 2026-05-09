# AGENTS.md - Nex Codebase Guide

This document provides guidance for AI agents working in this codebase.

## Project Overview

Nex is a Pokémon PWA built with SvelteKit 2, Svelte 5 (runes), TypeScript, and Tailwind CSS 4.

## Tech Stack

- **Framework**: SvelteKit 2.50+ with Svelte 5 runes
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x with `tailwind-variants`
- **UI Components**: shadcn-svelte (Bits UI based)
- **State Management**: TanStack Query + Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Form Handling**: TanStack Svelte Form
- **Validation**: Valibot
- **Package Manager**: pnpm

## Build/Lint/Test Commands

```bash
# Development
pnpm dev                    # Start dev server on port 3000

# Build
pnpm build                  # Build for production
pnpm preview                # Preview production build

# Type checking
pnpm check                  # Run svelte-check
pnpm check:watch            # Run svelte-check in watch mode

# Formatting & Linting
pnpm format                 # Format all files with Prettier
pnpm lint                   # Run oxlint + eslint
pnpm lint:fix               # Auto-fix eslint issues

# Testing - Unit (Vitest)
pnpm test:unit                          # Run all unit tests
pnpm test:unit src/index.test.ts        # Run a single test file
pnpm test:unit -t "test name"           # Run tests matching pattern
pnpm test:unit --watch                  # Watch mode

# Testing - E2E (Playwright)
pnpm test:integration                   # Run all e2e tests
pnpm exec playwright test tests/test.ts # Run specific e2e test file
pnpm exec playwright test --ui          # Run with UI mode

# Run all tests
pnpm test
```

## Project Structure

```
src/
├── app.css                 # Global styles (Tailwind + CSS vars)
├── app.d.ts                # App type declarations
├── app.html                # HTML template
├── lib/
│   ├── api/                # PokeAPI client + Valibot schemas
│   ├── components/         # Svelte components
│   │   └── ui/             # shadcn-svelte UI components
│   ├── config/             # App configuration
│   ├── constants.ts        # Static constants
│   ├── icons/              # SVG type icons
│   ├── queries/            # TanStack Query hooks
│   ├── stores/             # Svelte 5 rune-based stores
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
└── routes/                 # SvelteKit file-based routing
tests/                      # Playwright e2e tests
```

## Code Style Guidelines

### Formatting (Prettier)

- Use tabs for indentation
- Single quotes for strings
- No trailing commas
- Print width: 100 characters
- Svelte files: options-scripts-markup-styles order

### Import Order

```typescript
// 1. External packages
import { createQuery } from '@tanstack/svelte-query';
import * as v from 'valibot';

// 2. SvelteKit/app imports
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

// 3. Internal lib imports ($lib alias)
import { PokeAPI } from '$lib/api';
import { cn } from '$lib/utils';
import { Button } from '$lib/components/ui/button';

// 4. Relative imports
import type { PageData } from './$types';
```

### Svelte 5 Runes

Always use Svelte 5 runes syntax, not legacy reactive statements:

```svelte
<script lang="ts">
	// Props
	let { data }: { data: PageData } = $props();

	// Reactive state
	let count = $state(0);

	// Derived values
	let doubled = $derived(count * 2);

	// Complex derived
	let description = $derived.by(() => {
		// complex logic
		return result;
	});

	// Side effects
	$effect(() => {
		console.log('count changed:', count);
	});
</script>
```

### State Management Pattern

Use class-based stores with private `$state` fields:

```typescript
import { getContext, setContext } from 'svelte';

const KEY = Symbol('STATE_KEY');

export class MyState {
	#value = $state<Type>(initialValue);

	get value() {
		return this.#value;
	}
	set value(v: Type) {
		this.#value = v;
	}

	constructor() {
		setContext(KEY, this);
	}

	static get() {
		return getContext<MyState>(KEY);
	}
}
```

### API Data Validation (Valibot)

```typescript
import * as v from 'valibot';

export const MySchema = v.object({
	id: v.number(),
	name: v.string()
});

export type MyType = v.InferOutput<typeof MySchema>;

// Validate at runtime
const data = v.parse(MySchema, json);
```

### TanStack Query Pattern

```typescript
const query = createQuery(() => ({
	queryKey: ['key', id],
	queryFn: () => api.getData(id),
	staleTime: 1000 * 60 * 5,
	enabled: !!id
}));

let data = $derived(query.data);
let isLoading = $derived(query.isLoading);
```

### Component Styling (tailwind-variants)

```typescript
import { tv } from 'tailwind-variants';

export const myVariants = tv({
	base: 'inline-flex items-center',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground',
			outline: 'border-input border'
		},
		size: {
			default: 'h-10 px-4',
			sm: 'h-9 px-3'
		}
	},
	defaultVariants: { variant: 'default', size: 'default' }
});
```

### Naming Conventions

- **Files**: kebab-case (`app-state.svelte.ts`, `get-type-color.ts`)
- **Components**: PascalCase (`Header.svelte`, `MobileNav.svelte`)
- **Functions**: camelCase (`formatPokemonName`, `getTypeColor`)
- **Constants**: SCREAMING_SNAKE_CASE (`POKEMON_COLOURS`)
- **Types/Interfaces**: PascalCase (`PokemonType`, `Settings`)
- **Svelte rune stores**: `.svelte.ts` extension

### Unused Variables

Prefix unused variables with underscore `_` to avoid lint errors:

```typescript
const [_unused, used] = someArray;
```

### Error Handling

```typescript
// API errors - throw explicitly
if (!res.ok) throw new Error(`Not found: ${id}`);

// localStorage - wrap in try-catch
try {
	const parsed = JSON.parse(settings);
} catch (e) {
	console.error('Failed to parse settings', e);
}
```

### shadcn-svelte Components

UI components are in `$lib/components/ui/`. Each component folder has:

- `component-name.svelte` - The component
- `index.ts` - Exports with variants

Import pattern:

```typescript
import { Button } from '$lib/components/ui/button';
import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
```

## TypeScript Guidelines

- Strict mode is enabled
- Avoid `any` - use proper types or `unknown`
- Use `type` imports when importing only types
- Infer types from Valibot schemas when possible

## Testing Guidelines

- Unit test files: `src/**/*.{test,spec}.{js,ts}`
- E2E test files: `tests/**/*.ts`
- Use Vitest for unit tests
- Use Playwright for integration/e2e tests

## Important Notes

- This is a **static site** (prerendered with `adapter-static`)
- PWA-enabled with service worker caching
- All API responses are validated with Valibot schemas
- Use `$lib/` alias for imports from `src/lib/`
