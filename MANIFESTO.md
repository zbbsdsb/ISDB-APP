# ISDB-APP Manifesto

## Purpose

ISDB-APP exists to extend the Insane Dream Builder platform across every device and context where creators work. We ensure feature parity, performance optimization, and native experiences for each platform—meeting users wherever they are.

## Mission

Deliver the full power of ISDB to every platform, with the same vision and quality that defines the web experience.

## Core Principles

### 1. Platform Parity
All platforms carry the complete ISDB feature set. A user switching from web to mobile encounters the same capabilities, not a diminished version.

### 2. Native Performance
Each adaptation leverages platform-specific optimizations. React Native for mobile feels native. Electron for desktop feels native. No compromises in responsiveness or fluidity.

### 3. Unified Design Language
Across all platforms, users experience consistent visual identity, interaction patterns, and terminology. Differences exist only where platform conventions require.

### 4. Shared Data Layer
All platforms connect to the same Supabase backend. User identity, projects, matches, and history synchronize seamlessly across devices in real-time.

### 5. Offline-First Thinking
Where platform capabilities allow, local data persistence ensures core features remain accessible without connectivity. Sync resolves conflicts transparently when reconnected.

### 6. Development Velocity
Shared abstractions, well-defined interfaces, and consistent tooling enable parallel development across platforms without duplicating logic.

## Platform Scope

| Platform | Priority | Status |
|----------|----------|--------|
| Web (Next.js) | Primary | Active |
| iOS | High | Planned |
| Android | High | Planned |
| Desktop (Electron) | Medium | Planned |

## Non-Goals

- Platform-specific features that break consistency
- Reimplementing business logic already established in web
- Sacrificing user experience for development speed

## Success Criteria

1. Users cannot distinguish feature gaps between web and native apps
2. A user's session state persists perfectly across platform switches
3. Each platform achieves performance benchmarks comparable to native-first apps

---

*This document serves as the authoritative reference for all ISDB-APP development decisions. When trade-offs arise, these principles guide resolution.*
