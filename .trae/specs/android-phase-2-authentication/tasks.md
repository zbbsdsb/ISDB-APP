# Oasis.ISDB - Phase 2: Authentication - Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: Update Auth Store
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Update auth-store.ts with full session management
  - Add login/logout actions
  - Add session check on app launch
- **Acceptance Criteria Addressed**: [AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-1.1: Auth store initializes correctly
  - `programmatic` TR-1.2: Login action updates state
  - `programmatic` TR-1.3: Logout action clears state

## [ ] Task 2: Create use-auth Hook
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**:
  - Create `use-auth.ts` hook that wraps Supabase auth
  - Expose signInWithOAuth, signOut, session, user
  - Handle session persistence
- **Acceptance Criteria Addressed**: [AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-2.1: Hook exports expected methods
  - `programmatic` TR-2.2: Session state updates reactively

## [ ] Task 3: Implement GitHub OAuth
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**:
  - Add GitHub OAuth method to supabase.ts
  - Link to login screen button
  - Implement browser opening
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `human-judgment` TR-3.1: Browser opens correctly
  - `programmatic` TR-3.2: OAuth URL has correct redirect URI

## [ ] Task 4: Implement Discord OAuth
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**:
  - Add Discord OAuth method to supabase.ts
  - Link to login screen button
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `human-judgment` TR-4.1: Browser opens correctly
  - `programmatic` TR-4.2: OAuth URL has correct redirect URI

## [ ] Task 5: Create Callback Screen
- **Priority**: P0
- **Depends On**: [Task 3, Task 4]
- **Description**:
  - Create callback screen at `auth/callback`
  - Handle deep link parameters
  - Exchange code for session
  - Redirect to appropriate route
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-5.1: Deep link params parsed correctly
  - `programmatic` TR-5.2: Session established on callback
  - `programmatic` TR-5.3: Redirect works after success

## [ ] Task 6: Add Logout to Profile Screen
- **Priority**: P0
- **Depends On**: [Task 1, Task 2]
- **Description**:
  - Add "Sign Out" button to profile screen
  - Confirmation before clearing session
  - Redirect to landing screen on success
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `programmatic` TR-6.1: Session cleared on logout
  - `human-judgment` TR-6.2: Redirect works correctly

## [ ] Task 7: Update Navigation with Auth Guard
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**:
  - Update navigation stack to check auth state
  - Redirect to login if no session
  - Redirect to main if logged in and tries to access landing/login
- **Acceptance Criteria Addressed**: [AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-7.1: No session → redirect to landing
  - `programmatic` TR-7.2: Has session → redirect to main
