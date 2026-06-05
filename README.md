# ISDB-APP

Multi-platform adaptation layer for the Insane Dream Builder platform.

## Overview

ISDB-APP extends the ISDB web experience (built with Next.js + Supabase) to native mobile and desktop platforms.

## Architecture

```
ISDB-APP/
├── shared/          # Cross-platform shared code (types, lib, constants)
├── ios/             # React Native iOS application
├── android/         # React Native Android application
├── desktop/         # Electron desktop application
└── docs/            # Platform-specific documentation
```

## Technology Stack

| Platform | Technology | Status |
|----------|------------|--------|
| Web | Next.js 15.5.2 | Primary (see Insane-Dream-Builder) |
| iOS | React Native | Planned |
| Android | React Native | Planned |
| Desktop | Electron | Planned |

## Shared Code

The `shared/` package contains types, utilities, and configurations shared across all platforms:

- **Types**: Profile, Project, Swipe, Match, Tag interfaces
- **Lib**: Supabase client factory, utility functions (cn, formatDate, etc.)
- **Constants**: API paths, protected routes, app scheme

## Development

### Prerequisites

- Node.js 20+
- npm 9+
- iOS: Xcode 15+, CocoaPods
- Android: Android Studio, JDK 17+
- Desktop: Node.js 20+

### Building Shared Package

```bash
cd shared
npm install
npm run build
```

### Platform Status

- [ ] iOS - Not initialized
- [ ] Android - Not initialized
- [ ] Desktop - Not initialized

## Backend

All platforms share the same Supabase backend:

- **Database**: PostgreSQL with RLS policies
- **Auth**: GitHub, Discord OAuth + Email
- **Tables**: profiles, projects, swipes, matches, tags, user_identities

See [Insane-Dream-Builder](https://github.com/your-org/Insane-Dream-Builder) for database migrations.

## Documentation

- [Platform Setup Guide](docs/PLATFORM_SETUP.md)
- [Shared Code Guide](docs/SHARED_CODE_GUIDE.md)
