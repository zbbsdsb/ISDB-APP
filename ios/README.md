# iOS (React Native)

This directory will contain the React Native iOS application.

## Status

Not yet initialized. Run the following to initialize:

```bash
cd ios
npx @react-native-community/cli init ISDBAPP --skip-install
cd ISDBAPP
npm install
npx pod-install
```

## Configuration Required

1. Add deep linking scheme `isdbapp` to Info.plist
2. Configure Supabase environment variables
3. Run `pod install` to install native dependencies

See [docs/PLATFORM_SETUP.md](../docs/PLATFORM_SETUP.md) for detailed instructions.
