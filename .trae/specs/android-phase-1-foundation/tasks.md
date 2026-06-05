# Oasis.ISDB - Phase 1: Foundation - Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: Initialize React Native Project
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Initialize React Native 0.76+ project at `android/ISDBAPP` with package name `oasis.isdb`
  - Set up TypeScript strict mode
  - Configure basic project settings
  - Initialize gitignore for RN project
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-1.1: Project directory created at `android/ISDBAPP`
  - `programmatic` TR-1.2: `npx react-native init completes without errors
  - `programmatic` TR-1.3: `npm run android` builds and launches emulator successfully
  - `programmatic` TR-1.4: TypeScript strict mode enabled in tsconfig.json
- **Notes**: Use `npx @react-native-community/cli init ISDBAPP --package-name oasis.isdb

## [ ] Task 2: Integrate @isdb/shared Package
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**:
  - Link `@isdb/shared` as local package via file:../../shared
  - Configure tsconfig paths
  - Install required peer dependencies
  - Test type and utility imports
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic` TR-2.1: `import { Profile, createSupabaseClient } from '@isdb/shared' works
  - `programmatic` TR-2.2: TypeScript compilation succeeds with no errors
  - `programmatic` TR-2.3: cn utility function can be used without errors
  - `programmatic` TR-2.4: App still builds after integration
- **Notes**: May need to run `npm install ../../shared` from `android/ISDBAPP` directory

## [ ] Task 3: Configure Supabase Client & Storage
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**:
  - Install and configure Supabase dependencies
  - Set up secure token storage (Android Keystore via react-native-keychain
  - Create a reusable Supabase client service
  - Test basic Supabase operations (fetch tags)
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-3.1: Supabase client initialized with url/anon key from env variables
  - `programmatic` TR-3.2: Tags fetch succeeds and stored in state
  - `programmatic` TR-3.3: No sensitive tokens are stored encrypted
  - `programmatic` TR-3.4: Keystore integration works
- **Notes**: Use react-native-keychain, @react-native-async-storage/async-storage

## [ ] Task 4: Configure Deep Linking (isdbapp://)
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**:
  - Configure deep linking scheme in AndroidManifest.xml
  - Set up react-navigation linking config
  - Create callback screen
  - Test deep link handling
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `programmatic` TR-4.1: adb command opens app and navigates to callback
  - `programmatic` TR-4.2: Query params are accessible in screen
  - `programmatic` TR-4.3: App launches from background
- **Notes**: Verify with `adb shell am start -W -a android.intent.action.VIEW -d "isdbapp://auth/callback?code=test`

## [ ] Task 5: Implement Navigation System (Stack + Bottom Tabs)
- **Priority**: P0
- **Depends On**: [Task 1, Task 4]
- **Description**:
  - Set up @react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs
  - Create navigation structures outlined in architecture
  - Add placeholders for all screens
  - Configure linking config for deep links
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `programmatic` TR-5.1: App starts with landing screen
  - `programmatic` TR-5.2: Bottom tabs render correctly
  - `programmatic` TR-5.3: Tab navigation works between screens
  - `programmatic` TR-5.4: Safe area handled properly
- **Notes**: Use @react-native-community/bottom-tabs, react-native-screens

## [ ] Task 6: Implement Theme System (Dark/Light)
- **Priority**: P1
- **Depends On**: [Task 1]
- **Description**:
  - Mirror web's color scheme variables
  - Create theme context/state management
  - Add persistence for preference
  - Test all components in both modes
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `human-judgement` TR-6.1: Theme toggle without flicker
  - `human-judgement` TR-6.2: Colors consistent across components
  - `programmatic` TR-6.3: Preference persisted
  - `programmatic` TR-6.4: Dark is default on Android
- **Notes**: Use zustand or context for theme state

## [ ] Task 7: Create Base UI Components
- **Priority**: P0
- **Depends On**: [Task 1, Task 6]
- **Description**:
  - Implement Button, Input, Textarea, Select, Card, Avatar, TagSelector, etc.
  - Ensure proper accessibility
  - Test theming all components
- **Acceptance Criteria Addressed**: [AC-7]
- **Test Requirements**:
  - `human-judgement` TR-7.1: All components render in both modes
  - `human-judgement` TR-7.2: Touch targets minimum 48dp
  - `human-judgement` TR-7.3: Components have all required states
- **Notes**: Use react-native-gesture-handler, reanimated