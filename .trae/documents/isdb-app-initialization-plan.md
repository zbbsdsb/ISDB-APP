# ISDB-APP Initialization Plan

## Summary

Initialize ISDB-APP as the multi-platform adaptation layer for the Insane Dream Builder platform. This plan establishes the foundation for iOS, Android, and Desktop apps that share the existing Supabase backend while delivering native experiences per platform.

## Current State Analysis

### Existing ISDB Web Architecture (Insane-Dream-Builder)

| Layer | Technology | Version/Details |
|-------|------------|-----------------|
| Framework | Next.js | 15.5.2 (Pages Router) |
| UI | React | 18.2.0 |
| Styling | Tailwind CSS | 3.4.14 + shadcn/ui pattern |
| Backend | Supabase | PostgreSQL + Auth + RLS |
| Auth | Supabase Auth | GitHub, Discord OAuth + Email |
| Deployment | Cloudflare Pages | via @cloudflare/next-on-pages |

### Database Schema (Supabase - 16 migrations)

**Core Tables:**
- `profiles` - User profiles (extends auth.users)
- `projects` - Project listings with sponsorship, card customization
- `swipes` - Swipe records (pass/save/match)
- `matches` - Match relationships between users and projects
- `tags` - Categorized tags for projects
- `social_connections` - OAuth provider linkages
- `user_identities` - Sequential identity numbers (100001+)

**Key Features:**
- Swipe card customization (card_color, hook_text, featured_tags, custom_badge)
- Project sponsorship system
- Match score calculation via `calculate_match_score()` function
- Auto-assigned identity numbers on profile creation

### Auth Flow

1. OAuth (GitHub/Discord) → `/auth/callback?code=xxx` → Profile auto-created via DB trigger → Onboarding check → Redirect
2. Onboarding required if: no skills, no interests, or username starts with "user_"
3. Protected routes: `/profile`, `/projects/new`, `/swipe`, `/matches`, `/onboarding`

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Proposed Changes

### Phase 1: Repository Foundation

**1.1 Initialize React Native Project (iOS First)**
- Command: `npx @react-native-community/cli init ISDBAPP --skip-install`
- Location: `D:\github projects\ISDB-APP\ios`
- React Native version: 0.76.x (New Architecture enabled by default)

**1.2 Initialize Desktop Project (Electron)**
- Command: `npx create-electron-app@latest isdb-desktop --template=vite-typescript`
- Location: `D:\github projects\ISDB-APP\desktop`
- Electron version: 33.x with Vite bundler

**1.3 Create Shared Architecture Layer**
```
ISDB-APP/
├── shared/                    # Shared code across all platforms
│   ├── src/
│   │   ├── types/            # TypeScript interfaces (copied from web)
│   │   │   ├── profile.ts
│   │   │   ├── project.ts
│   │   │   ├── swipe.ts
│   │   │   └── match.ts
│   │   ├── lib/
│   │   │   ├── supabase.ts  # Supabase client factory
│   │   │   └── utils.ts     # Shared utilities (cn, format date, etc.)
│   │   └── constants/
│   │       └── routes.ts    # API endpoints, protected routes
│   └── package.json
```

### Phase 2: Shared Types Migration

**2.1 Migrate Type Definitions**
- Copy from `Insane-Dream-Builder/src/types/` to `ISDB-APP/shared/src/types/`
- Files: `profile.ts`, `project.ts`, `swipe.ts`, `match.ts`, `tag.ts`

**2.2 Create Supabase Client Factory**
```typescript
// shared/src/lib/supabase.ts
export function createSupabaseClient(url: string, anonKey: string) {
  // Platform-specific implementation
}
```

### Phase 3: Platform-Specific Setup

**3.1 iOS (React Native)**
- Install: `@supabase/supabase-js`, `react-native-axios` (or fetch)
- Add iOS native modules for: secure storage (Keychain)
- Configure: app icons, splash screen, bundle identifier

**3.2 Desktop (Electron)**
- Install: `@supabase/supabase-js`, `electron-store`
- Configure: window management, native menus, auto-updater
- Add: desktop-specific IPC handlers

### Phase 4: Authentication Integration

**4.1 Auth Flow Adaptation**
- Mobile: Use Supabase Auth with deep links (`isdbapp://auth/callback`)
- Desktop: Use Supabase Auth with custom URI scheme (`isdbapp://`)

**4.2 Secure Storage**
- Mobile: Keychain (iOS) / Keystore (Android)
- Desktop: electron-store with encryption

### Phase 5: Documentation

**5.1 Create Platform-Specific README sections**
- iOS setup instructions
- Android setup instructions
- Desktop development guide
- Shared code contribution guidelines

## File Structure (Target)

```
ISDB-APP/
├── MANIFESTO.md
├── README.md
├── shared/                    # Cross-platform shared code
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/
│       ├── lib/
│       └── constants/
├── ios/                       # React Native iOS app
│   ├── ISDBAPP/
│   ├── src/
│   └── package.json
├── android/                   # React Native Android app
│   ├── app/
│   └── package.json
├── desktop/                   # Electron desktop app
│   ├── src/
│   └── package.json
└── docs/
    ├── PLATFORM_SETUP.md
    └── SHARED_CODE_GUIDE.md
```

## Assumptions & Decisions

| Decision | Rationale |
|----------|-----------|
| React Native over Flutter | Shared JS/TS ecosystem with web codebase, easier Supabase integration |
| Electron over Tauri | Mature ecosystem, easier cross-platform, Supabase JS SDK works natively |
| Shared folder pattern | Single source of truth for types/constants, reduces duplication |
| iOS first | Most complex platform constraints, Android can follow |
| Vite-based Electron | Modern, fast builds, TypeScript-first |

## Verification Steps

1. **Shared types compile**: `cd shared && npx tsc --noEmit`
2. **iOS builds**: `cd ios && xcodebuild -scheme ISDBAPP -configuration Debug -destination "platform=iOS Simulator,name=iPhone 16" build`
3. **Desktop builds**: `cd desktop && npm run make`
4. **Auth flow works**: OAuth login → callback → profile creation on all platforms

## Next Actions

1. Create `shared/` directory structure and migrate types
2. Initialize React Native project for iOS
3. Initialize Electron project for Desktop
4. Implement platform-specific Supabase clients
5. Write platform setup documentation
