# Oasis.ISDB - Phase 2: Authentication - Product Requirements Document

## Overview
- **Summary**: Implement secure authentication for Oasis.ISDB Android app with OAuth providers (GitHub, Discord) and session management
- **Purpose**: Enable users to sign in and access protected features with secure token storage
- **Target Users**: All end users of the mobile application

## Goals
- Implement OAuth 2.0 login with GitHub
- Implement OAuth 2.0 login with Discord
- Securely store session tokens using Android Keystore
- Handle deep link OAuth callbacks
- Implement logout functionality
- Add auth guard for protected routes

## Non-Goals (Out of Scope)
- Email/password authentication (P1, future)
- Biometric authentication (future)
- Password reset flow

## Background & Context
The app uses Supabase as the authentication backend, with the same implementation as the web app. The OAuth flow uses `isdbapp://` deep linking for redirects.

## Functional Requirements
- **FR-1**: GitHub OAuth login
- **FR-2**: Discord OAuth login
- **FR-3**: Deep link callback handling
- **FR-4**: Token storage and retrieval
- **FR-5**: Session persistence
- **FR-6**: Logout functionality
- **FR-7**: Auth guard for protected routes

## Non-Functional Requirements
- **NFR-1**: No sensitive data exposed in logs
- **NFR-2**: Login flow completes in under 3 seconds
- **NFR-3**: Session auto-refreshes when needed

## Constraints
- **Technical**: React Native with Supabase
- **Business**: Must use the same Supabase instance as web app
- **Dependencies**: react-native-keychain, @supabase/supabase-js

## Assumptions
- Supabase OAuth providers are configured in the dashboard
- AndroidManifest.xml has the deep link scheme configured
- Users can install Chrome Custom Tabs or similar browser

## Acceptance Criteria

### AC-1: GitHub Login
- **Given**: User is on the login screen
- **When**: User taps "Sign In with GitHub"
- **Then**: Browser opens to GitHub auth, callback to app, user is logged in
- **Verification**: human-judgment + programmatic

### AC-2: Discord Login
- **Given**: User is on the login screen
- **When**: User taps "Sign In with Discord"
- **Then**: Browser opens to Discord auth, callback to app, user is logged in
- **Verification**: human-judgment + programmatic

### AC-3: Deep Link Callback
- **Given**: App receives a deep link at `isdbapp://auth/callback`
- **When**: Callback has valid code
- **Then**: Session is established and user is redirected
- **Verification**: programmatic

### AC-4: Logout
- **Given**: User is logged in
- **When**: User taps "Sign Out"
- **Then**: Session is cleared, local storage wiped, user redirected to login
- **Verification**: programmatic

### AC-5: Session Persistence
- **Given**: User closes app after logging in
- **When**: User reopens app
- **Then**: Session is restored if still valid
- **Verification**: programmatic

## Open Questions
- [ ] Should we support email/password auth as well? (P1)
- [ ] Do we need biometric unlock option? (future)
