# Oasis.ISDB - Android Development Plan

## Project Overview

**Package Name:** `oasis.isdb`
**Project Name:** Oasis.ISDB
**Type:** React Native Android Application
**Core Functionality:** Mobile companion app for Insane Dream Builder platform, enabling creators to discover projects, manage profiles, and connect with collaborators on-the-go.

## Source Code Alignment

This app mirrors the functionality of the web application at `Insane-Dream-Builder`:
- **Web Repository:** `Insane-Dream-Builder`
- **Shared Package:** `@isdb/shared` (already created in `ISDB-APP/shared/`)
- **Backend:** Same Supabase instance (PostgreSQL + Auth + Storage + RLS)

---

## Feature Roadmap

### Phase 1: Foundation (Core Infrastructure) ✅ Spec Documented

**Status**: [Detailed Phase 1 Spec & Tasks](../../../.trae/specs/android-phase-1-foundation/)

| Feature | Priority | Description |
|---------|----------|-------------|
| **Project Setup** | P0 | Initialize React Native 0.76+ project with `oasis.isdb` package |
| **Shared Package Integration** | P0 | Integrate `@isdb/shared` for types, utils, constants |
| **Supabase Client** | P0 | Configure Supabase client with secure storage (Android Keystore) |
| **Deep Linking** | P0 | Configure `isdbapp://` scheme for OAuth callback |
| **Navigation Structure** | P0 | React Navigation with stack + bottom tabs |
| **Theme System** | P1 | Dark/Light mode support (mirroring web's `next-themes`) |
| **UI Components** | P0 | Reusable base components (Button, Input, Card, Avatar, etc.) |

### Phase 2: Authentication

| Feature | Priority | Description |
|---------|----------|-------------|
| **OAuth Login (GitHub)** | P0 | GitHub OAuth via Supabase |
| **OAuth Login (Discord)** | P0 | Discord OAuth via Supabase |
| **Email/Password Auth** | P1 | Email signup/login with password |
| **Auth Callback Handler** | P0 | Deep link handling for OAuth callbacks |
| **Session Management** | P0 | Secure token storage, auto-refresh |
| **Logout** | P0 | Clear session and redirect |

### Phase 3: Onboarding

| Feature | Priority | Description |
|---------|----------|-------------|
| **Onboarding Check** | P0 | Detect if profile is incomplete (no skills/interests/username) |
| **Profile Setup Form** | P0 | Username, display name, bio, skills, interests |
| **Tag Selector Component** | P0 | Searchable tag picker (mirrors web's TagSelector) |
| **Identity Ceremony** | P1 | Animated builder ID reveal (simplified animation for mobile) |

### Phase 4: Core Features - Discovery

| Feature | Priority | Description |
|---------|----------|-------------|
| **Home/Dashboard** | P0 | Welcome message, quick actions, builder ID display |
| **Swipe Interface** | P0 | Tinder-style card swipe (pass/save/match) |
| **Match Score Calculation** | P0 | Client-side skill/interest matching (70/30 weight) |
| **Projects Browse** | P0 | List view with filters (tags, status) |
| **Project Detail** | P0 | Full project info with owner, links, sponsorship |
| **Image Upload** | P1 | Cover image upload via Supabase Storage |

### Phase 5: Core Features - Management

| Feature | Priority | Description |
|---------|----------|-------------|
| **Create Project** | P0 | Multi-step form (Basic Info → Links → Cover & Publish) |
| **Edit Project** | P0 | Pre-filled form with delete option |
| **My Projects** | P0 | List of user's own projects |
| **Matches List** | P0 | Incoming/Outgoing tabs, accept/reject actions |
| **Profile View/Edit** | P0 | Full profile form with avatar, tags, social links |

### Phase 6: Social Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Gathering Dashboard** | P2 | Global stats, world map, activity feed |
| **World Map Visualization** | P2 | User distribution by country |
| **Activity Feed** | P2 | Recent joins, projects, matches |
| **Profile QR Code** | P2 | Share builder ID via QR code |

---

## Technical Architecture

### Package Structure (Target)

```
android/
└── ISDBAPP/
    ├── src/
    │   ├── app/                    # Navigation screens
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx           # Landing or Home
    │   │   ├── (auth)/
    │   │   │   ├── login.tsx
    │   │   │   └── callback.tsx
    │   │   ├── (main)/
    │   │   │   ├── _layout.tsx
    │   │   │   ├── home.tsx
    │   │   │   ├── swipe.tsx
    │   │   │   ├── projects/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── [id].tsx
    │   │   │   │   └── new.tsx
    │   │   │   ├── matches.tsx
    │   │   │   ├── profile.tsx
    │   │   │   ├── onboarding.tsx
    │   │   │   └── gathering.tsx
    │   │   └── (onboarding)/
    │   │       └── identity-ceremony.tsx
    │   ├── components/
    │   │   ├── ui/                # Base components (Button, Input, Card, etc.)
    │   │   ├── swipe/
    │   │   │   ├── swipe-card.tsx
    │   │   │   └── swipe-interface.tsx
    │   │   ├── projects/
    │   │   │   ├── project-card.tsx
    │   │   │   ├── project-form.tsx
    │   │   │   ├── project-filters.tsx
    │   │   │   └── project-list.tsx
    │   │   ├── profile/
    │   │   │   ├── profile-form.tsx
    │   │   │   └── tag-selector.tsx
    │   │   ├── matches/
    │   │   │   ├── match-card.tsx
    │   │   │   └── matches-list.tsx
    │   │   ├── gathering/
    │   │   │   ├── stats-card.tsx
    │   │   │   ├── world-map.tsx
    │   │   │   └── activity-feed.tsx
    │   │   ├── landing/
    │   │   │   └── landing-page.tsx
    │   │   └── layout/
    │   │       ├── header.tsx
    │   │       └── bottom-tabs.tsx
    │   ├── hooks/
    │   │   ├── use-auth.ts
    │   │   ├── use-profile.ts
    │   │   ├── use-projects.ts
    │   │   ├── use-swipes.ts
    │   │   └── use-matches.ts
    │   ├── services/
    │   │   ├── supabase.ts
    │   │   └── storage.ts
    │   ├── store/
    │   │   └── auth-store.ts      # Zustand or Context
    │   ├── types/
    │   │   └── index.ts           # Local type extensions
    │   ├── constants/
    │   │   └── theme.ts
    │   └── utils/
    │       └── helpers.ts
    └── android/                    # Native Android project
```

### Key Dependencies

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "react-native-screens": "^4.0.0",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-gesture-handler": "^2.20.0",
    "react-native-reanimated": "^3.16.0",
    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0"
  }
}
```

### Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack
│   ├── Login Screen
│   └── OAuth Callback Screen
├── Main Stack (Bottom Tabs)
│   ├── Home Tab
│   │   └── Home Screen
│   ├── Swipe Tab
│   │   └── Swipe Screen
│   ├── Projects Tab
│   │   ├── Projects List
│   │   ├── Project Detail
│   │   └── Create/Edit Project
│   ├── Matches Tab
│   │   └── Matches List
│   └── Profile Tab
│       └── Profile Screen
└── Modal Stack
    ├── Onboarding Screen
    ├── Identity Ceremony
    └── Gathering Dashboard
```

### Database Schema (Reference from Web)

**Tables:**
- `profiles` - User profiles (id, username, display_name, avatar_url, bio, skills[], interests[], country, goal)
- `projects` - Projects (id, owner_id, title, description, tags[], required_skills[], status, social links, sponsorship, card customization)
- `swipes` - Swipe records (user_id, project_id, action, super_swipe)
- `matches` - Match relationships (user_id, project_id, status, message, super_match)
- `tags` - Available tags (name, category, icon, description)
- `user_identities` - Sequential builder IDs (user_id, identity_number)
- `social_connections` - OAuth provider links

### Auth Flow

1. User taps "Sign In with GitHub/Discord"
2. App opens OAuth URL with redirect to `isdbapp://auth/callback?code=xxx
3. App captures code, exchanges for session
4. Profile checked: if incomplete → redirect to Onboarding
5. If complete → redirect to Home

### API Integration

All data accessed via Supabase client (no custom API routes in mobile):
- REST API via `supabase.from('table').select/insert/update/delete()`
- Real-time subscriptions for matches (`supabase.channel()`)
- File uploads via `supabase.storage.from('images').upload()`

---

## UI/UX Guidelines

### Design System Alignment

- **Colors:** Match web app CSS variables (hsl-based)
- **Typography:** Inter font family (or system sans-serif fallback)
- **Spacing:** 4px base unit, consistent with Tailwind scale
- **Border Radius:** lg=0.5rem, md=0.375rem, sm=0.25rem
- **Dark Mode:** Full dark theme support (default on Android)

### Component Mapping (Web → Mobile)

| Web Component | Mobile Equivalent |
|--------------|-------------------|
| `Button` | Custom button with variants |
| `Input` / `Textarea` | Custom text inputs |
| `Select` | Custom dropdown/picker |
| `TagSelector` | Searchable chip selector |
| `Avatar` | react-native-avataaar or custom |
| `Card` | View with shadow/border |
| `Modal` | Bottom sheet or full modal |
| `SwipeCard` | react-native-gesture-handler swipeable |
| `Header` | Custom header with back button |
| `Bottom Tabs` | @react-navigation bottom tabs |

### Mobile-Specific Considerations

- Safe area handling (notches, gesture areas)
- Keyboard avoidance for forms
- Pull-to-refresh on lists
- Haptic feedback on swipe actions
- Optimistic UI updates
- Offline state indicators

---

## Non-Functional Requirements

### Performance
- Cold start < 2 seconds
- Screen transitions < 300ms
- Swipe animations at 60fps
- Lazy loading for images and lists

### Security
- OAuth tokens stored in Android Keystore
- No sensitive data in AsyncStorage
- Certificate pinning for Supabase requests
- Biometric auth option for app unlock (future)

### Accessibility
- Minimum touch target 48dp
- Screen reader support
- Sufficient color contrast
- Scalable text support

---

## Milestones

### M1: Shell Project (Week 1)
- Project initialized
- Navigation working
- Theme system in place
- Base UI components built

### M2: Authentication (Week 2)
- OAuth login functional
- Session management
- Auth guard on protected routes

### M3: Core Loop (Week 3-4)
- Swipe interface complete
- Projects browse/create/edit
- Matches list

### M4: Profile & Onboarding (Week 5)
- Profile view/edit
- Onboarding flow
- Tag selector

### M5: Polish & Social (Week 6)
- Gathering dashboard
- Activity feed
- Theme improvements
- Performance optimization

---

## Verification Checklist

- [ ] APK builds successfully
- [ ] OAuth flow completes on Android
- [ ] Swipe gestures work smoothly
- [ ] Projects CRUD operations functional
- [ ] Matches accept/reject works
- [ ] Dark mode renders correctly
- [ ] Deep links handled properly
- [ ] No crashes on edge cases
