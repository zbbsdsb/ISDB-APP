# ISDB-APP Code Standards

> **Status:** Active  
> **Owner:** Engineering Team  
> **Last Updated:** 2026-06-07

---

## 1. Naming Conventions

### 1.1 Files & Directories

| Type | Convention | Examples |
|------|------------|---------|
| React Screen (page) | `lowercase.tsx` | `login.tsx`, `swipe.tsx`, `project-detail.tsx` |
| React Component (reusable) | `PascalCase.tsx` | `Button.tsx`, `Card.tsx`, `TagSelector.tsx` |
| Hook | `camelCase.ts` / `camelCase.tsx` | `use-auth.ts`, `use-theme.tsx` |
| Store | `camelCase.ts` | `auth-store.ts`, `theme-store.ts` |
| Service / Utility | `camelCase.ts` | `supabase.ts`, `api.ts`, `helpers.ts` |
| Type definition | `camelCase.ts` | `types.ts`, `profile-types.ts` |
| Config / Constants | `camelCase.ts` | `supabase.ts` (config), `theme-colors.ts` |
| Directory (feature) | `lowercase` | `components/`, `hooks/`, `screens/`, `services/` |
| Directory (grouping) | `lowercase` | `components/ui/`, `components/onboarding/` |

**Rules:**
- No spaces, no underscores, no special characters in file/directory names.
- Use hyphen (`-`) only for screen files to improve readability (e.g., `project-detail.tsx`).
- Component files use PascalCase without hyphens.

---

### 1.2 Variables & Functions

| Type | Convention | Examples |
|------|------------|---------|
| Variable (const/let) | `camelCase` | `userName`, `isLoading`, `authStore` |
| Function (named) | `camelCase` | `handleSubmit`, `fetchProfile`, `signInWithGitHub` |
| React Component | `PascalCase` | `LoginScreen`, `Button`, `TagSelector` |
| Type / Interface | `PascalCase` | `User`, `AuthState`, `SupabaseConfig` |
| Enum | `PascalCase` (members: `PascalCase` or `UPPER_SNAKE`) | `Role { Admin, Member }` |
| Constant (module-level) | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT` |
| Boolean variable | `is` / `has` / `should` prefix | `isLoading`, `hasError`, `shouldRedirect` |
| Event handler | `handle` prefix or `on` prefix | `handleSubmit`, `onPress`, `onChangeText` |

**Rules:**
- No abbreviations unless universally understood (`err`, `ctx`, `props` are OK; `usr`, `prof`, `nav` are NOT).
- Hook names must start with `use` prefix: `useAuth`, `useProfile`, `useTheme`.

---

### 1.3 CSS / StyleSheet

| Type | Convention | Examples |
|------|------------|---------|
| StyleSheet key | `camelCase` | `container`, `headerTitle`, `submitButton` |
| Style variable | `camelCaseStyles` or `styles` | `styles`, `loginStyles`, `cardStyles` |

---

## 2. Directory Structure

```
android/ISDBAPP/
├── src/
│   ├── app/                    # Screens (one file per screen)
│   │   ├── index.ts             # Barrel exports
│   │   ├── login.tsx           # Login screen
│   │   ├── home.tsx            # Home dashboard
│   │   ├── swipe.tsx           # Swipe interface
│   │   ├── projects.tsx        # Projects list
│   │   ├── matches.tsx         # Matches list
│   │   ├── profile.tsx         # User profile
│   │   ├── onboarding.tsx      # Onboarding flow
│   │   └── auth-callback.tsx  # OAuth callback handler
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # Base primitives (Button, Input, Card, Avatar)
│   │   │   ├── index.ts        # Barrel export
│   │   │   ├── button.tsx
│   │   │   ├── text-input.tsx
│   │   │   └── card.tsx
│   │   ├── onboarding/         # Onboarding-specific components
│   │   └── ...               # Feature-specific component directories
│   ├── hooks/                 # Custom React hooks
│   │   ├── index.ts            # Barrel exports
│   │   ├── use-auth.ts        # Authentication hook
│   │   ├── use-profile.ts     # Profile data hook
│   │   ├── use-tags.ts        # Tags data hook
│   │   └── use-theme.tsx     # Theme context hook
│   ├── store/                 # Zustand stores
│   │   ├── auth-store.ts      # Auth state
│   │   └── theme-store.ts    # Theme preference state
│   ├── services/              # API / external service clients
│   │   └── supabase.ts       # Supabase client + secure storage
│   ├── types/                 # Local type extensions
│   │   └── index.ts          # App-specific types
│   ├── constants/             # App-wide constants
│   │   ├── index.ts
│   │   ├── app.ts             # App name, version
│   │   └── theme-colors.ts   # Color palette (dark/light)
│   ├── navigation/             # React Navigation config
│   │   └── index.tsx         # Root navigator, deep link config
│   ├── utils/                 # Pure utility functions
│   ├── App.tsx                # App root component
│   └── index.js               # RN entry point (AppRegistry)
├── android/                  # Native Android project
├── ios/                      # Native iOS project
├── __tests__/                # Jest test files
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

### Structure Rules

1. **One screen per file** — `app/login.tsx` contains only `LoginScreen`.
2. **Barrel exports** — every directory with multiple exports must have an `index.ts` that re-exports.
3. **No business logic in components** — components render UI only; data logic goes in hooks.
4. **No API calls in stores** — stores hold state; API calls go in services/hooks.
5. **`types/` only for app-specific types** — shared/types come from `@isdb/shared`.

---

## 3. Git Commit Conventions

We follow **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.).

### Format

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

### Types

| Type | When to use |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `style:` | Formatting, missing semicolons, etc. (no code change) |
| `docs:` | Documentation only changes |
| `test:` | Adding or updating tests |
| `chore:` | Build process, tooling, dependency updates |
| `perf:` | Performance improvement |
| `ci:` | CI configuration changes |

### Scopes

Use the module/directory name as scope when relevant:

- `feat(auth):` — authentication feature
- `fix(navigation):` — navigation bug
- `refactor(hooks):` — hook refactoring
- `chore(deps):` — dependency update

### Subject Rules

- **Imperative mood**: "add" not "added" or "adds"
- **Lowercase** first letter
- **No period** at the end
- **Max 72 characters**

### Examples

```bash
feat(auth): add GitHub OAuth login flow

Implement signInWithGitHub using Supabase Auth + deep link callback.
Includes AuthCallbackScreen and session persistence via Zustand.

fix(navigation): resolve deep link not opening from cold start

The deep link handler was not registered before NavigationContainer mounted.
Moved linking config to be available at app init time.

chore(deps): downgrade react-native from 0.85 to 0.76.9

RN 0.85 + React 19 caused peer dependency conflicts with
@react-navigation and react-native-reanimated. Downgrading to
RN 0.76.9 (stable, New Architecture) resolves all conflicts.

refactor(hooks): extract signInWithProvider from signInWithGitHub/Discord

Reduces code duplication by accepting provider as parameter.
```

---

## 4. Code Quality Rules

### 4.1 TypeScript

- **No `any`** unless explicitly justified with a `// TODO: typing` comment.
- **Prefer interfaces over types** for object shapes (except when `Union` or `Pick/Omit` is needed).
- **All components must be typed** — `React.FC` or explicit return type.
- **No type assertions (`as`)** unless you can prove the type — prefer type guards.

### 4.2 Error Handling

- **Never silently swallow errors** — `catch { }` is forbidden. Always log or re-throw.
- **User-facing errors** must be displayed via alert/toast, not just `console.error`.
- **Async functions** must have try/catch or return a `Result<T, E>` type.

### 4.3 React / React Native

- **No anonymous arrow functions in JSX** — extract to named variables or separate components.
- **`useMemo` / `useCallback`** when passing functions to memoized children.
- **Avoid `useEffect` for data fetching** — prefer custom hooks with explicit trigger functions.
- **StyleSheet.create** must be used — no inline style objects (except dynamic values via `useMemo`).

### 4.4 Testing

- **Every hook must have a test** in `__tests__/hooks/`.
- **Every screen must have a smoke test** in `__tests__/screens/`.
- **No `any` in test files** — use proper type for `mock()` calls.
- **Snapshot tests are forbidden** — they create false confidence.

---

## 5. Pull Request Checklist

Before marking a PR as "Ready for Review":

- [ ] All TypeScript errors resolved (`npx tsc --noEmit` passes)
- [ ] All tests pass (`npm test`)
- [ ] No `console.log` statements left in production code
- [ ] No `any` type without `// TODO:` justification
- [ ] Commit messages follow Conventional Commits
- [ ] PR title follows `type(scope): subject` format
- [ ] Screenshots/GIFs attached for UI changes
- [ ] Breaking changes called out in PR description

---

*This document is the single source of truth for code standards in ISDB-APP. When in doubt, ask in the PR review.*
