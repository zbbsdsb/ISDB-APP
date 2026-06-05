# Android (React Native)

This directory will contain the React Native Android application.

## Status

Not yet initialized. Run the following to initialize:

```bash
cd android
npx @react-native-community/cli init ISDBAPP --skip-install
cd ISDBAPP
npm install
```

## Configuration Required

1. Add deep linking scheme `isdbapp` to AndroidManifest.xml
2. Configure Supabase environment variables

See [docs/PLATFORM_SETUP.md](../docs/PLATFORM_SETUP.md) for detailed instructions.
