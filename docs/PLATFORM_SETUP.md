# Platform Setup Guide

This document covers the setup process for each platform.

## iOS (React Native)

### Prerequisites

- macOS 13+
- Xcode 15+
- Node.js 20+
- CocoaPods

### Setup Steps

1. **Initialize the project** (when ready)

```bash
cd ios
npx @react-native-community/cli init ISDBAPP --skip-install
cd ISDBAPP
npm install
npx pod-install
```

2. **Configure deep linking**

Add to `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>isdbapp</string>
    </array>
  </dict>
</array>
```

3. **Configure Supabase**

Create `src/config/supabase.ts`:

```typescript
import { createSupabaseClient } from '@isdb/shared';

export const supabase = createSupabaseClient({
  url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
});
```

4. **Build**

```bash
xcodebuild -workspace ios/ISDBAPP.xcworkspace \
  -scheme ISDBAPP \
  -configuration Debug \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  build
```

---

## Android (React Native)

### Prerequisites

- macOS, Linux, or Windows
- Node.js 20+
- Android Studio (with JDK 17)
- Android SDK

### Setup Steps

1. **Initialize the project** (when ready)

```bash
cd android
npx @react-native-community/cli init ISDBAPP --skip-install
cd ISDBAPP
npm install
```

2. **Configure deep linking**

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="isdbapp" />
</intent-filter>
```

3. **Build**

```bash
cd android
./gradlew assembleDebug
```

---

## Desktop (Electron)

### Prerequisites

- Node.js 20+
- npm 9+

### Setup Steps

1. **Initialize the project** (when ready)

```bash
cd desktop
npx create-electron-app@latest isdb-desktop --template=vite-typescript
cd isdb-desktop
npm install @isdb/shared
```

2. **Configure app scheme**

The desktop app uses `isdbapp://` as its custom URL scheme for OAuth callbacks.

3. **Build**

```bash
npm run make
```

---

## Environment Variables

Each platform requires these Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For mobile, use `EXPO_PUBLIC_` prefix instead of `NEXT_PUBLIC_`.
