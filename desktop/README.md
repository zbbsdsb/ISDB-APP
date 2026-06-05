# Desktop (Electron)

This directory will contain the Electron desktop application.

## Status

Not yet initialized. Run the following to initialize:

```bash
cd desktop
npx create-electron-app@latest isdb-desktop --template=vite-typescript
cd isdb-desktop
npm install @isdb/shared
```

## Configuration Required

1. Configure window management settings
2. Set up auto-updater
3. Configure Supabase environment variables

See [docs/PLATFORM_SETUP.md](../docs/PLATFORM_SETUP.md) for detailed instructions.
