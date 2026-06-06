# Oasis.ISDB - Phase 3: Onboarding - Task Breakdown

## Status: In Progress

## Task List

### Phase 3.1: Create Specification Document
- [ ] Create spec.md with detailed requirements
- [ ] Create tasks.md with implementation tasks
- [ ] Create checklist.md for verification

**Estimated Time:** 15 minutes

### Phase 3.2: Implement Hooks
- [ ] Create `use-profile.ts` hook
  - [ ] `createProfile()` function
  - [ ] `updateProfile()` function
  - [ ] `getProfile()` function
  - [ ] `checkProfileComplete()` function

- [ ] Create `use-tags.ts` hook
  - [ ] Fetch all tags from database
  - [ ] Search/filter tags by name
  - [ ] Group tags by category
  - [ ] Loading and error states

**Estimated Time:** 45 minutes

### Phase 3.3: Implement Onboarding Components
- [ ] Create `basic-info-form.tsx`
  - [ ] Username input with validation
  - [ ] Display name input
  - [ ] Bio textarea
  - [ ] Country dropdown
  - [ ] Next button

- [ ] Create `skills-form.tsx`
  - [ ] Tag selector component
  - [ ] Minimum 1 selection required
  - [ ] Search functionality
  - [ ] Selected tags display
  - [ ] Back/Next buttons

- [ ] Create `interests-form.tsx`
  - [ ] Same structure as skills-form
  - [ ] Minimum 1 selection required
  - [ ] Search functionality
  - [ ] Back/Complete buttons

- [ ] Create `identity-ceremony.tsx`
  - [ ] Builder ID display
  - [ ] Fade-in animation
  - [ ] Continue button

- [ ] Create `step-indicator.tsx`
  - [ ] Progress dots (3 steps)
  - [ ] Active/inactive states

**Estimated Time:** 2 hours

### Phase 3.4: Implement Onboarding Screen
- [ ] Create `onboarding.tsx` main screen
  - [ ] Step-based navigation
  - [ ] Form state management
  - [ ] Progress tracking
  - [ ] Submit on final step

**Estimated Time:** 1 hour

### Phase 3.5: Update Navigation
- [ ] Add onboarding route to navigation
  - [ ] Stack navigator for onboarding flow
  - [ ] Auth guard integration
  - [ ] Redirect logic

**Estimated Time:** 30 minutes

### Phase 3.6: TypeScript Verification
- [ ] Run `npx tsc --noEmit`
- [ ] Fix any type errors
- [ ] Ensure all types align with shared package

**Estimated Time:** 30 minutes

### Phase 3.7: Testing
- [ ] Test onboarding flow manually
- [ ] Verify profile creation
- [ ] Test username uniqueness
- [ ] Verify tag selection works

**Estimated Time:** 1 hour

### Phase 3.8: Commit Changes
- [ ] Stage all new files
- [ ] Write commit message
- [ ] Push to remote

**Estimated Time:** 5 minutes

---

## Total Estimated Time: ~7 hours

## Dependencies
- Phase 1 (Foundation) must be complete
- Phase 2 (Authentication) must be complete
- Shared package types must be available
- Supabase connection must be configured

## Risks
1. **Username uniqueness check** - Need to query database before submit
2. **Tag loading performance** - Large tag list may be slow
3. **Animation performance** - Simple animations preferred for mobile

## Mitigation
1. Debounce username check, show loading state
2. Implement virtualized list for tags if needed
3. Use basic RN Animated API, avoid heavy libraries
