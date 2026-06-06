# Oasis.ISDB - Phase 3: Onboarding - Specification

## Status: In Progress

## Overview

Phase 3 implements the user onboarding flow for the Oasis.ISDB Android app. New users who complete OAuth authentication must set up their profile before accessing the main app features.

## Source Code Reference

This phase mirrors the web application onboarding at `Insane-Dream-Builder`:
- **Web Repository:** `Insane-Dream-Builder`
- **Backend:** Same Supabase instance (PostgreSQL + Auth + Storage + RLS)

## Functional Requirements

### FR-1: Onboarding Detection

**Description:** Detect if a logged-in user needs to complete their profile setup.

**Logic:**
1. After successful OAuth login, check if user has a profile in the `profiles` table
2. A profile is considered incomplete if any of these fields are missing:
   - `username` (required, unique)
   - `skills` (required, at least 1 item)
   - `interests` (required, at least 1 item)
3. If profile is incomplete or doesn't exist, redirect to `/onboarding`
4. If profile is complete, redirect to `/home`

**API Query:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('username, skills, interests')
  .eq('id', userId)
  .single();
```

### FR-2: Profile Setup Form

**Description:** Multi-step form for users to complete their profile.

**Fields:**
1. **Basic Info (Step 1)**
   - `username` (required, unique, 3-20 chars, alphanumeric + underscore)
   - `display_name` (optional, max 50 chars)
   - `bio` (optional, max 280 chars)
   - `country` (optional, dropdown selector)

2. **Skills (Step 2)**
   - `skills` (required, minimum 1, maximum 10)
   - Tag selector with search functionality
   - Pre-populated from `tags` table

3. **Interests (Step 3)**
   - `interests` (required, minimum 1, maximum 10)
   - Tag selector with search functionality
   - Same tag pool as skills

### FR-3: Tag Selector Component

**Description:** Searchable, selectable chip component for choosing tags.

**Features:**
- Search input with real-time filtering
- Display tags grouped by category
- Selected tags shown as removable chips
- Minimum/maximum selection constraints
- Loading state while fetching tags

**Data Source:** `tags` table in Supabase

### FR-4: Identity Ceremony (Simplified)

**Description:** Celebration screen after profile setup is complete.

**Features:**
- Animated reveal of "Builder ID"
- Sequential builder ID assigned via database trigger
- Simple fade-in animation (mobile-optimized)
- Continue button to navigate to home

## User Flows

### Happy Path Flow
```
OAuth Login → Auth Callback → Profile Check
    ↓
Profile Exists & Complete? → Yes → Home Screen
    ↓ No
Onboarding (Step 1: Basic Info) → Next
    ↓
Onboarding (Step 2: Skills) → Next
    ↓
Onboarding (Step 3: Interests) → Complete
    ↓
Identity Ceremony → Home Screen
```

## Technical Implementation

### Navigation
- Add `onboarding.tsx` screen to navigation
- Auth guard redirects to onboarding if profile incomplete
- No bottom tabs shown during onboarding

### State Management
- `useProfile` hook for profile CRUD operations
- `useTags` hook for fetching available tags
- Local form state with React Hook Form or Zustand

### Database Operations
```typescript
// Create profile
const { error } = await supabase.from('profiles').insert({
  id: userId,
  username,
  display_name,
  bio,
  country,
  skills: selectedSkills,
  interests: selectedInterests,
});
```

## Acceptance Criteria

### AC-1: Onboarding Detection
- [ ] Unauthenticated users are redirected to login
- [ ] Users without profiles are redirected to onboarding
- [ ] Users with incomplete profiles are redirected to onboarding
- [ ] Users with complete profiles go directly to home

### AC-2: Profile Form
- [ ] Username validation works (unique check, format)
- [ ] Display name is optional
- [ ] Bio has character limit (280)
- [ ] Country selector shows available countries

### AC-3: Tag Selection
- [ ] Tags load from database
- [ ] Search filters tags in real-time
- [ ] Minimum 1 skill required
- [ ] Minimum 1 interest required
- [ ] Selected tags are removable

### AC-4: Profile Submission
- [ ] Profile is created in database
- [ ] User is redirected to home on success
- [ ] Error messages display on failure

### AC-5: Identity Ceremony
- [ ] Builder ID is assigned automatically
- [ ] Animation plays smoothly on mobile
- [ ] Continue button navigates to home

## Component Structure

```
src/
├── app/
│   └── onboarding.tsx          # Main onboarding screen
├── components/
│   └── onboarding/
│       ├── basic-info-form.tsx   # Step 1: username, display_name, bio
│       ├── skills-form.tsx       # Step 2: skills tag selector
│       ├── interests-form.tsx    # Step 3: interests tag selector
│       ├── identity-ceremony.tsx # Success celebration
│       └── step-indicator.tsx   # Progress dots
├── hooks/
│   ├── use-profile.ts          # Profile CRUD operations
│   └── use-tags.ts              # Fetch available tags
└── navigation/
    └── index.tsx                # Add onboarding route
```

## Dependencies

All dependencies already installed in Phase 1:
- `@react-navigation/native` - Navigation
- `@supabase/supabase-js` - Database operations
- `react-native-gesture-handler` - Gesture support
- `@react-native-async-storage/async-storage` - Local storage
