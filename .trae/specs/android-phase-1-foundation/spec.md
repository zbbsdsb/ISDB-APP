# Oasis.ISDB - Phase 1: Foundation - Product Requirement Document (PRD)

## Overview
- **Summary**: Initialize the Oasis.ISDB React Native Android project and establish the core infrastructure, including project setup, navigation, theme system, base UI components, and integration with the shared code and Supabase backend.
- **Purpose**: Provides the foundational structure for all future development phases, ensuring all platforms share the same types, utilities, and backend connectivity.
- **Target Users**: Android developers working on Oasis.ISDB, end-users (initially just testing shell app).

## Goals
- Initialize a React Native 0.76+ project with package name `oasis.isdb`
- Integrate `@isdb/shared` package for cross-platform type and utility sharing
- Set up Supabase client with secure token storage
- Configure deep linking scheme `isdbapp://`
- Implement navigation structure (stack + bottom tabs)
- Add dark/light theme system
- Create a complete set of reusable base UI components

## Non-Goals (Out of Scope)
- Implementing any authentication flows (Phase 2)
- Implementing swipe or project features (Phase 3-5)
- Publishing to Google Play Store
- iOS app development (future phase)
- Implementing Gathering Dashboard (Phase 6)

## Background & Context
- Existing web application at `Insane-Dream-Builder` built on Next.js + Supabase
- Shared package `@isdb/shared` already contains all types, utilities, constants
- This is Phase 1 of 6 in the Android development roadmap
- The package name is fixed to `oasis.isdb` as requested by the user

## Functional Requirements
- **FR-1**: Project initialization with correct package name
- **FR-2**: Integration with `@isdb/shared` npm package
- **FR-3**: Supabase client configuration with secure storage
- **FR-4**: Deep linking setup with `isdbapp://` scheme
- **FR-5**: Navigation stack with bottom tabs
- **FR-6**: Dark/light theme system
- **FR-7**: Base UI component library

## Non-Functional Requirements
- **NFR-1**: Project must build successfully for debug and release variants
- **NFR-2**: Theme switching must work without screen flicker
- **NFR-3**: Navigation transitions must be smooth (<300ms)
- **NFR-4**: All UI components must be accessible (minimum 48dp touch targets)
- **NFR-5**: Supabase client must follow best practices for token persistence
- **NFR-6**: Codebase must use consistent style guide (TypeScript, ESLint)

## Constraints
- **Technical**: Must use React Native 0.76+, Expo not allowed (native Android project), TypeScript strict mode enabled
- **Business**: Must use the existing Supabase backend from Insane-Dream-Builder
- **Dependencies**: `@isdb/shared` must be buildable before Android app development begins

## Assumptions
- User has Android Studio installed and configured
- User has Node.js 20+ and npm 9+ installed
- Supabase credentials are available (to be configured via environment variables)
- `@isdb/shared` package is published or available locally via file reference

## Acceptance Criteria

### AC-1: Project Initialization
- **Given**: A clean development environment
- **When**: The project is initialized
- **Then**: A valid React Native project exists with package name `oasis.isdb`, TypeScript enabled, and all necessary native dependencies installed
- **Verification**: `programmatic`
- **Notes**: Verify with `cd android/ISDBAPP && npm install && npm run android`

### AC-2: Shared Package Integration
- **Given**: Initialized project
- **When**: Shared package is added as dependency
- **Then**: TypeScript type definitions are available, utilities can be imported and used without errors, and build completes successfully
- **Verification**: `programmatic`
- **Notes**: Verify by importing `Profile` type and `createSupabaseClient` from `@isdb/shared`

### AC-3: Supabase Client & Storage
- **Given**: Project with shared package
- **When**: Supabase client is configured
- **Then**: Client can connect to Supabase, tokens are stored securely (Android Keystore), and basic operations (e.g., fetching tags) work
- **Verification**: `programmatic`
- **Notes**: Test with simple `select` from `tags` table

### AC-4: Deep Linking
- **Given**: Running app
- **When**: A deep link `isdbapp://auth/callback?code=test` is received
- **Then**: App opens and routes to callback screen
- **Verification**: `programmatic`
- **Notes**: Test using `adb shell am start -W -a android.intent.action.VIEW -d "isdbapp://auth/callback?code=test"`

### AC-5: Navigation System
- **Given**: Initialized project
- **When**: App starts
- **Then**: Navigation renders landing screen, bottom tabs are available, and navigation between tabs works
- **Verification**: `programmatic`
- **Notes**: Verify all navigation routes render without errors

### AC-6: Theme System
- **Given**: Running app
- **When**: User toggles dark/light theme
- **Then**: App theme changes, colors update consistently, and preferences persist across restarts
- **Verification**: `human-judgment`
- **Notes**: Check all UI elements update correctly in both modes

### AC-7: UI Component Library
- **Given**: Initialized project
- **When**: Using base components
- **Then**: Components render correctly in both themes, have proper states (disabled, active), and are responsive
- **Verification**: `human-judgment`
- **Notes**: Check Button, Input, Card, Avatar, Text components

## Open Questions
- [ ] What exact Supabase URL/anon key to use? (User will provide)
- [ ] How to handle local development of `@isdb/shared`? (npm link or file:)
