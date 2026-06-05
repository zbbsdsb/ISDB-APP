# Shared Code Guide

This document describes how to use and extend the shared package.

## Package Structure

```
shared/
├── src/
│   ├── index.ts           # Public exports
│   ├── types/             # TypeScript interfaces
│   │   ├── profile.ts
│   │   ├── project.ts
│   │   ├── swipe.ts
│   │   ├── match.ts
│   │   └── tag.ts
│   ├── lib/               # Core libraries
│   │   ├── supabase.ts    # Supabase client factory
│   │   └── utils.ts       # Utility functions
│   └── constants/         # Constants
│       └── routes.ts      # API paths, routes
└── dist/                  # Built output
```

## Using Shared Types

```typescript
import type { Profile, Project, SwipeAction } from '@isdb/shared';

// Use interfaces directly
const project: Project = {
  id: '123',
  owner_id: '456',
  title: 'My Project',
  // ... full type safety
};
```

## Using Supabase Client

```typescript
import { createSupabaseClient, APP_SCHEME, PROTECTED_ROUTES } from '@isdb/shared';

const supabase = createSupabaseClient({
  url: 'https://xxx.supabase.co',
  anonKey: 'your-anon-key',
});

// Auth callback URL for OAuth
const callbackUrl = `${APP_SCHEME}://your-domain/auth/callback`;
```

## Using Utilities

```typescript
import { cn, formatDate, formatRelativeTime, truncate } from '@isdb/shared';

// Merge Tailwind classes
const classes = cn('px-4', isActive && 'bg-primary');

// Format dates
formatDate('2024-01-15T00:00:00Z'); // "Jan 15, 2024"
formatRelativeTime('2024-01-15T00:00:00Z'); // "2d ago"

// Truncate text
truncate('Long text here...', 20); // "Long text here..."
```

## Adding New Types

When adding types from the web codebase:

1. Copy the type file to `shared/src/types/`
2. Export it from `shared/src/index.ts`
3. Rebuild: `cd shared && npm run build`

## API Constants

```typescript
import { API_PATHS } from '@isdb/shared';

const url = `${supabaseUrl}${API_PATHS.PROJECTS}`;
// Results in: "/rest/v1/projects"
```
