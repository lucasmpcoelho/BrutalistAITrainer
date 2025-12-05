# IRON_AI — Product Roadmap

> **Last Updated:** 2025-12-05  
> **Current Phase:** Phase 2 — Backend & Persistence (Complete), Phase 2.9 — UX Bug Fixes (In Progress)  
> **Status:** Firebase Data Connect deployed to Cloud SQL. Workout generation working with persistent storage. Training plan management features added (reset plan, edit schedule). Schedule editor redesigned with dropdown UX. **Onboarding race condition FIXED** — completion screen now shows 3-second animated delay before navigation. Two UX bugs remaining (swap alternatives, exercise coverage).

---

## Vision

IRON_AI is an AI-powered fitness training platform with a brutalist design aesthetic. The app focuses on making users feel powerful by celebrating their progress through strong gamification mechanics.

### Core Principles
- **Mobile-first**: Designed for one-handed gym use on phones
- **Gamification over gimmicks**: No AR/computer vision — instead, streaks, achievements, PRs, and celebrations
- **Brutalist aesthetic**: Bold, high-contrast, terminal-inspired UI
- **AI personalization**: Workouts that adapt to user goals and performance
- **AI coaching**: OpenAI-powered personal trainer for guidance, motivation, and real-time advice

### Platform Strategy
- **Current**: Progressive Web App (PWA)
- **Future**: React Native for iOS and Android

---

## Current State

### Implemented
- [x] Landing page with brutalist design (`client/src/pages/Home.tsx`)
- [x] Hero section with video background (`client/src/components/Hero.tsx`)
- [x] Features section (`client/src/components/Features.tsx`)
- [x] Navigation bar with mobile menu (`client/src/components/Navbar.tsx`)
- [x] Terminal-style onboarding chat flow (`client/src/pages/Onboarding.tsx`)
- [x] Dashboard with workout protocol view (`client/src/pages/Dashboard.tsx`)
- [x] Protocol circuit component (`client/src/components/dashboard/ProtocolCircuit.tsx`)
- [x] Health/Telemetry biometrics panel (`client/src/pages/Health.tsx`)
- [x] Active workout session screen (`client/src/pages/ActiveSession.tsx`)
- [x] Set logging with weight/reps inputs
- [x] Rest timer between sets
- [x] Date navigation calendar strip
- [x] Basic responsive layout (desktop-first)
- [x] Express.js server scaffolding (`server/`)
- [x] Drizzle ORM setup with user schema (`shared/schema.ts`)
- [x] UI component library (Radix + shadcn)
- [x] PWA manifest and iOS meta tags (`client/public/manifest.json`, `client/index.html`)
- [x] Install prompt UI component (`client/src/components/InstallPrompt.tsx`)
- [x] Safe area CSS utilities (`client/src/index.css`)
- [x] Touch manipulation utilities (`client/src/index.css`)
- [x] Haptics hook (`client/src/hooks/use-haptics.ts`)
- [x] Bottom navigation component (`client/src/components/BottomNav.tsx`)
- [x] **Mobile-first onboarding redesign** — 7-step flow with fixed bottom input, typing indicator, progress bar, and completion celebration
- [x] **3-tab navigation structure** — TODAY, COACH, HEALTH with settings gear in header
- [x] **Dashboard (TODAY tab) redesign** — Week preview strip, collapsible overview, mobile-first layout
- [x] **Coach page (COACH tab)** — AI hub with proactive insights, quick actions, and chat interface
- [x] **Health page (HEALTH tab)** — Biometrics dashboard with HRV, sleep, recovery score (mock data)
- [x] Shared AppHeader component with streak display and settings gear
- [x] **Dashboard exercise actions** — SWAP, SKIP, NOTES buttons on exercise cards
- [x] Exercise database with form cues, alternatives, and muscle groups
- [x] Notes bottom sheet with key cues and common mistakes
- [x] Skip confirmation with "Swap instead?" option
- [x] Swap bottom sheet with 3 deterministic alternatives

- [x] **Firebase Authentication** — Google Sign-In + email/password with Firebase Auth
- [x] **Firestore user profiles** — User data stored in Firestore `users` collection with preferences
- [x] **Auth flow gating** — Landing → Auth → Onboarding → Dashboard (skips onboarding if completed)
- [x] **Account menu** — Profile picture/gear icon with user info and logout button

- [x] **Workout generation service** — Rule-based workout generator (`server/services/workout-generator.ts`) with equipment-aware exercise selection
- [x] **Generate API endpoint** — `POST /api/workouts/generate` reads Firestore profile, generates workouts
- [x] **Day selection in onboarding** — Users select which days to train (Mon-Sun checkboxes after frequency)
- [x] **Firebase token auth on all routes** — Workout, session, and user routes use `verifyFirebaseToken` middleware
- [x] **Dashboard real data hooks** — `useTodayWorkout()`, `useWorkouts()` replace mock data
- [x] **ActiveSession real data** — Uses `useWorkout(id)`, `useStartSession()`, `useLogSet()`, `useCompleteSession()`
- [x] **Schedule editor component** — `client/src/components/ScheduleEditor.tsx` for post-generation day adjustment

- [x] **Firebase Data Connect** — Cloud SQL PostgreSQL backend with GraphQL schema and type-safe SDK
- [x] **Persistent workout storage** — Workouts now persist across server restarts and sessions
- [x] **Reset Training Plan** — Users can delete all workouts and re-onboard from AppHeader menu
- [x] **Edit Schedule** — Schedule editor accessible from AppHeader menu for day adjustments
- [x] **SwapExercise fix** — Route ordering bug fixed, alternatives now load correctly

### Known Issues
1. ~~**Workout loading race condition**~~ — **FIXED**: Added 3-second animated completion screen that auto-starts workout generation and only navigates after both API completion AND minimum delay. Deferred `refetchProfile()` to button click to prevent premature route redirect.
2. **Swap exercise not loading alternatives** — SwapExerciseSheet opens but alternatives don't appear. The refactor to pass `exerciseId` and fetch internally may have issues with the API endpoint or data flow.
3. **Exercise bank gaps for equipment-less users** — When users select "no equipment" during onboarding, the workout generator may not find suitable exercises, resulting in empty workout days. Need to audit exercise database coverage for bodyweight exercises.

### Not Implemented
- [ ] PWA service worker for offline support (vite-plugin-pwa)
- [ ] Gamification system (achievements, streaks, PRs)
- [ ] Progress tracking and charts
- [ ] Health app integrations
- [ ] AI Personal Trainer (chat interface, proactive coaching, workout generation)

### Active Work
- ✅ **Phase 2 Complete** — Firebase Data Connect deployed, workout generation working, training plan management features added.
- 🔧 **Phase 2.9 In Progress** — ~~Race condition~~ FIXED! Remaining: swap exercise alternatives, exercise coverage for equipment-less users.
- 🔜 **Next: Phase 3 (Gamification)** — Achievement system, PRs, streaks, progress visualization.

---

## Phase 1: Mobile-First Foundation

*Goal: Transform the prototype into a production-ready mobile PWA*

### 1.1 Remove AR/Computer Vision
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-01 | [x] | Remove `arMode` state and AR overlay from ActiveSession | `client/src/pages/ActiveSession.tsx` |
| P1-02 | [x] | Remove Form Check button and Scan icon import | `client/src/pages/ActiveSession.tsx` |
| P1-03 | [x] | Replace "Precision Form" feature with gamification feature | `client/src/components/Features.tsx` |

### 1.2 PWA Setup
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-04 | [x] | Create PWA manifest.json with app metadata | `client/public/manifest.json` |
| P1-05 | [x] | Add manifest link and iOS meta tags to index.html | `client/index.html` |
| P1-06 | [x] | Install and configure vite-plugin-pwa | `package.json`, `vite.config.ts` |
| P1-07 | [x] | Implement service worker for offline support | via vite-plugin-pwa |
| P1-08 | [x] | Add install prompt UI component | `client/src/components/InstallPrompt.tsx` |

### 1.3 Mobile-First UI — Global
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-09 | [x] | Add safe area CSS utilities (notch/home indicator) | `client/src/index.css` |
| P1-10 | [x] | Add touch-manipulation utility classes | `client/src/index.css` |
| P1-11 | [x] | Create useHaptics hook for tactile feedback | `client/src/hooks/use-haptics.ts` |
| P1-12 | [x] | Create bottom navigation component | `client/src/components/BottomNav.tsx` |

### 1.4 Mobile-First UI — Onboarding
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-13 | [x] | Increase option button sizes to 56px min height | `client/src/pages/Onboarding.tsx` |
| P1-14 | [x] | Fix bottom input keyboard overlap with safe area | `client/src/pages/Onboarding.tsx` |
| P1-15 | [x] | Add typing indicator animation | `client/src/pages/Onboarding.tsx` |
| P1-16 | [x] | Add progress indicator (step X of Y) | `client/src/pages/Onboarding.tsx` |
| P1-17 | [x] | Use inputMode="numeric" for number inputs | `client/src/pages/Onboarding.tsx` — *N/A: Redesigned to use option buttons for all inputs* |
| P1-40 | [x] | Expand to 7-step onboarding flow | `client/src/pages/Onboarding.tsx` |
| P1-41 | [x] | Fixed bottom input area (chat-like UX) | `client/src/pages/Onboarding.tsx` |
| P1-42 | [x] | Completion celebration screen | `client/src/pages/Onboarding.tsx` |

### 1.5 Mobile-First UI — Dashboard
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-18 | [x] | Consolidate naming: ensure dashboard references the Telemetry/HealthPreviewCard component consistently | `client/src/components/dashboard/Telemetry.tsx` (aliased as HealthPreviewCard) |
| P1-20 | [x] | Optimize calendar strip for horizontal scroll/snap | `client/src/pages/Dashboard.tsx` |
| P1-21 | [x] | Add bottom navigation bar | `client/src/pages/Dashboard.tsx` |
| P1-36 | [x] | Add gamification header (streak display, XP/points) | `client/src/pages/Dashboard.tsx` |
| P1-37 | [x] | Place primary "Start Workout" CTA in bottom thumb zone | `client/src/pages/Dashboard.tsx` |

*Note: Former task P1-19 (Health FAB) is intentionally removed because the Health tab is accessible through the persistent BottomNav (`client/src/components/BottomNav.tsx`).*
### 1.6 Mobile-First UI — Protocol Circuit
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-22 | [x] | Increase exercise card touch targets (56px+ height) | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-23 | [x] | Make stats grid text larger (text-xl) | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-24 | [x] | Fixed bottom CTA with safe area padding | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-38 | [x] | Add visual progress indicator (X/Y exercises done) | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-39 | [x] | Show workout metadata (muscle groups, estimated time) | `client/src/components/dashboard/ProtocolCircuit.tsx` |

### 1.7 Mobile-First UI — Active Session (Set Logging)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-25 | [x] | Add +/- quick adjust buttons for weight input (48px × 48px min) | `client/src/pages/ActiveSession.tsx` |
| P1-26 | [x] | Add +/- quick adjust buttons for reps input (48px × 48px min) | `client/src/pages/ActiveSession.tsx` |
| P1-27 | [x] | Set weight/reps input containers to 60px+ height | `client/src/pages/ActiveSession.tsx` |
| P1-28 | [x] | Make LOG SET button full width, 56px+ height | `client/src/pages/ActiveSession.tsx` |
| P1-29 | [x] | Add safe area padding to session screen | `client/src/pages/ActiveSession.tsx` |
| P1-30 | [x] | Show previous set values as reference context | `client/src/pages/ActiveSession.tsx` |
| P1-31 | [x] | Add haptic feedback on all button presses | `client/src/pages/ActiveSession.tsx` |
| P1-32 | [x] | Minimal header with exercise name and back button only | `client/src/pages/ActiveSession.tsx` |
| P1-70 | [x] | Integrate exercise notes sheet in active session for form cues access during workout | `client/src/pages/ActiveSession.tsx` |

### 1.8 Mobile-First UI — Rest Timer
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-33 | [x] | Giant timer display (80px+ font, monospace) | `client/src/pages/ActiveSession.tsx` |
| P1-34 | [x] | Large +30s and SKIP buttons (80px min width) | `client/src/pages/ActiveSession.tsx` |
| P1-35 | [x] | Preview next exercise during rest | `client/src/pages/ActiveSession.tsx` |

### 1.9 App Navigation Structure
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-43 | [x] | Update BottomNav to 3-tab structure (TODAY, COACH, HEALTH) | `client/src/components/BottomNav.tsx` |
| P1-44 | [x] | Add settings gear icon to header (replaces profile tab) | `client/src/components/AppHeader.tsx` |
| P1-45 | [x] | Update App.tsx with /coach and /health routes | `client/src/App.tsx` |
| P1-46 | [x] | Integrate BottomNav into main app screens | Various |

### 1.10 TODAY Tab (Dashboard Redesign)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-47 | [x] | Add integrated week preview strip with workout types | `client/src/pages/Dashboard.tsx` |
| P1-48 | [x] | Mobile-first layout with safe areas and bottom nav padding | `client/src/pages/Dashboard.tsx` |
| P1-49 | [x] | Collapsible week overview section | `client/src/pages/Dashboard.tsx` |
| P1-50 | [x] | Move "Start Workout" CTA to fixed bottom thumb zone | `client/src/pages/Dashboard.tsx` |
| P1-51 | [x] | Add streak/gamification display to header | `client/src/pages/Dashboard.tsx` |

### 1.11 COACH Tab (AI Personal Trainer)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-52 | [x] | Create Coach page with hub layout | `client/src/pages/Coach.tsx` |
| P1-53 | [x] | Add proactive AI insight card at top | `client/src/pages/Coach.tsx` |
| P1-54 | [x] | Add quick action chips grid (6 actions) | `client/src/pages/Coach.tsx` |
| P1-55 | [x] | Add persistent chat input at bottom | `client/src/pages/Coach.tsx` |
| P1-56 | [x] | Create expandable full chat view | `client/src/pages/Coach.tsx` |

### 1.12 HEALTH Tab (Biometrics Dashboard)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-57 | [x] | Create Health page with mock data | `client/src/pages/Health.tsx` |
| P1-58 | [x] | Add HRV display with trend visualization | `client/src/pages/Health.tsx` |
| P1-59 | [x] | Add sleep metrics section | `client/src/pages/Health.tsx` |
| P1-60 | [x] | Add recovery score with AI recommendation | `client/src/pages/Health.tsx` |
| P1-61 | [x] | Add resting heart rate trend | `client/src/pages/Health.tsx` |
| P1-62 | [x] | Add "Connect HealthKit" placeholder for future integration | `client/src/pages/Health.tsx` |

### 1.13 Dashboard Exercise Actions
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-63 | [x] | Create exercise data with cues, alternatives, and muscle groups | `client/src/data/exercises.ts` |
| P1-64 | [x] | Add 3 action buttons to exercise cards (SWAP, SKIP, NOTES) | `client/src/pages/Dashboard.tsx` |
| P1-65 | [x] | Create Notes bottom sheet with form cues and tips | `client/src/components/ExerciseNotesSheet.tsx` |
| P1-66 | [x] | Create Skip confirmation with "Swap instead?" prompt | `client/src/components/SkipConfirmSheet.tsx` |
| P1-67 | [x] | Create Swap bottom sheet with 3 deterministic alternatives | `client/src/components/SwapExerciseSheet.tsx` |
| P1-68 | [x] | Implement exercise removal from workout state | `client/src/pages/Dashboard.tsx` |
| P1-69 | [x] | Implement exercise swap in workout state | `client/src/pages/Dashboard.tsx` |

---

## Phase 1.5: Exercise Data Foundation

*Goal: Sync exercise data from ExerciseDB into Firebase (Firestore for metadata, Storage for GIFs) to create an owned, reliable exercise database*

### Architecture Decisions
- **Authentication**: Firebase Auth with Google Sign-In + email/password
- **User Data**: Firestore `users` collection (preferences, onboarding status)
- **Exercise Metadata**: Firestore `exercises` collection (868 exercises)
- **Relational Data (Workouts/Sessions)**: Firebase Data Connect with Cloud SQL PostgreSQL
- **Image Storage**: Firebase Storage URLs (static images from GitHub, not animated GIFs)
- **Data Source**: free-exercise-db ([yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)) — 800+ exercises with images, open source (Unlicense)
- **Sync Strategy**: One-time import script for free-exercise-db JSON + image files
- **Reference**: [Introducing Firebase Data Connect](https://firebase.blog/posts/2024/05/introducing-firebase-data-connect/)

> **Note**: Firebase Data Connect provides a managed Cloud SQL PostgreSQL database with GraphQL schema, auto-generated type-safe SDKs, and built-in vector search for AI features. This keeps all infrastructure within the Google/Firebase ecosystem and replaces the previous Drizzle/in-memory storage approach.

### 1.5.1 Firebase Setup
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-01 | [x] | Create Firebase project and enable Firestore + Storage | Firebase Console |
| P1.5-02 | [x] | Install Firebase Admin SDK for server-side operations | `package.json` |
| P1.5-03 | [x] | Create Firebase config and initialize Admin SDK | `server/config/firebase.ts` |
| P1.5-04 | [x] | Set up environment variables for Firebase credentials | `.env` |
| P1.5-05 | [x] | Configure Firebase Storage bucket and Firestore security rules | Firebase Console |

### 1.5.2 ExerciseDB API Integration
*Note: RapidAPI free tier only returns 10 exercises; paid tier prohibits data storage. Using free-exercise-db instead.*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-06 | [-] | Set up ExerciseDB API credentials (RapidAPI) | *Superseded by Gumroad dataset* |
| P1.5-07 | [x] | Create ExerciseDB service with fetch methods | `server/services/exercisedb.ts` |
| P1.5-08 | [x] | Add rate limiting, retry logic, and batch support | `server/services/exercisedb.ts` |

### 1.5.3 Firestore Schema Design
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-09 | [x] | Design exercises collection schema | `shared/types/exercise.ts` |

**Firestore Schema:**
```
exercises/{exerciseId}
  - name: string
  - equipment: string
  - bodyPart: string
  - target: string (primary muscle)
  - secondaryMuscles: string[]
  - instructions: string[]
  - gifUrl: string (Firebase Storage URL — currently static images, not GIFs)
  - gifPath: string (Storage path for reference)
  - source: "free-exercise-db" | "exercisedb"
  - syncedAt: timestamp
```
*Note: Field names `gifUrl`/`gifPath` retained for future GIF upgrade compatibility.*

### 1.5.4 Sync Script (One-Time)
*Note: Script infrastructure complete. Only 10 test exercises synced (RapidAPI limit). Full sync requires free-exercise-db import.*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-10 | [x] | Create sync script entry point | `server/scripts/sync-exercises.ts` |
| P1.5-11 | [x] | Implement batch fetching (500 exercises per batch) | `server/scripts/sync-exercises.ts` |
| P1.5-13 | [x] | Transform ExerciseDB data to our schema | `server/services/exercise-transformer.ts` |
| P1.5-14 | [x] | Write exercise documents to Firestore | `server/scripts/sync-exercises.ts` |
| P1.5-15 | [x] | Add progress logging, error handling, and resume capability | `server/scripts/sync-exercises.ts` |

### 1.5.5 API Endpoints
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-16 | [x] | GET /api/exercises — list/search exercises from Firestore | `server/routes/exercises.ts` |
| P1.5-17 | [x] | GET /api/exercises/:id — get single exercise | `server/routes/exercises.ts` |
| P1.5-18 | [x] | GET /api/exercises/by-body-part/:part — filter by body part | `server/routes/exercises.ts` |

### 1.5.6 Frontend Integration
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-19 | [-] | Install Firebase client SDK | *Not needed — using API routes* |
| P1.5-20 | [-] | Create Firebase client config | *Not needed — using API routes* |
| P1.5-21 | [x] | Create useExercise hook (fetch from API) | `client/src/hooks/use-exercise.ts` |
| P1.5-22 | [x] | Create useExercises hook (list/search) | `client/src/hooks/use-exercises.ts` |
| P1.5-23 | [x] | Update ExerciseNotesSheet to use new hook + display GIF | `client/src/components/ExerciseNotesSheet.tsx` |
| P1.5-24 | [x] | Update SwapExerciseSheet to fetch alternatives from API | `client/src/components/SwapExerciseSheet.tsx` |
| P1.5-25 | [x] | Add Hero GIF section with loading/error states | `client/src/components/ExerciseNotesSheet.tsx` |

### 1.5.7 Cleanup
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-26 | [x] | Remove hardcoded EXERCISES constant (deprecated) | `client/src/data/exercises.ts` |
| P1.5-27 | [x] | Update Dashboard to use API for workout exercises | `client/src/pages/Dashboard.tsx` |

### 1.5.8 Free Exercise DB Import
*Using open source dataset instead of ExerciseDB Gumroad ($300 was too expensive).*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P1.5-28 | [x] | Download free-exercise-db repository | [GitHub](https://github.com/yuhonas/free-exercise-db) |
| P1.5-29 | [x] | Analyze JSON schema and document field mappings | — |
| P1.5-30 | [x] | Create import script for free-exercise-db format | `server/scripts/import-free-exercise-db.ts` |
| P1.5-31 | [x] | Upload images to Firebase Storage (using GitHub URLs) | `server/scripts/import-free-exercise-db.ts` |
| P1.5-32 | [x] | Verify 868 exercises imported with image URLs | Firebase Console |
| P1.5-33 | [x] | Delete 10 test exercises from RapidAPI sync | `server/scripts/cleanup-old-exercises.ts` |

**Dataset Info:**
- Source: [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)
- 800+ exercises with static images (not animated GIFs)
- JSON format with exercise metadata
- Unlicense (public domain) — free for commercial use
- Future: Can upgrade to GIF source if budget allows

---

## Phase 2: Backend & Persistence

*Goal: Real data storage and user accounts*

### 2.1 Database Schema
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-01 | [x] | Add workouts table schema | `shared/schema.ts` |
| P2-02 | [x] | Add workout_exercises table schema | `shared/schema.ts` |
| P2-03 | [x] | Add sessions table schema | `shared/schema.ts` |
| P2-04 | [x] | Add sets table schema | `shared/schema.ts` |
| P2-05 | [x] | Add personal_records table schema | `shared/schema.ts` |
| P2-06 | [x] | Add achievements table schema | `shared/schema.ts` |
| P2-07 | [x] | Add user_achievements table schema | `shared/schema.ts` |
| P2-08 | [x] | Add streaks table schema | `shared/schema.ts` |
| P2-09 | [~] | Run database migrations | `npm run db:push` — requires DATABASE_URL |

### 2.2 Authentication
*Note: Migrated from session-based auth to Firebase Auth for better scalability and Google Sign-In support.*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-10 | [x] | ~~Implement user registration endpoint~~ → Firebase Auth | `client/src/lib/firebase.ts` |
| P2-11 | [x] | ~~Implement user login endpoint~~ → Firebase Auth | `client/src/lib/firebase.ts` |
| P2-12 | [x] | ~~Implement user logout endpoint~~ → Firebase Auth | `client/src/lib/firebase.ts` |
| P2-13 | [x] | ~~Add session middleware~~ → Firebase token verification | `server/middleware/firebase-auth.ts` |
| P2-14 | [x] | Create auth context on frontend (Firebase-based) | `client/src/contexts/AuthContext.tsx` |
| P2-15 | [x] | Add login/register screens with Google Sign-In | `client/src/pages/Auth.tsx` |
| P2-15b | [x] | Add account menu with logout to AppHeader | `client/src/components/AppHeader.tsx` |
| P2-15c | [x] | Implement auth flow gating (onboarding required for new users) | `client/src/App.tsx` |

### 2.3 API Endpoints
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-16 | [x] | GET /api/user/profile | `server/routes/user.ts` |
| P2-17 | [x] | PUT /api/user/profile | `server/routes/user.ts` |
| P2-18 | [x] | GET /api/workouts | `server/routes/workouts.ts` |
| P2-19 | [x] | POST /api/workouts | `server/routes/workouts.ts` |
| P2-20 | [x] | GET /api/workouts/:id | `server/routes/workouts.ts` |
| P2-21 | [x] | POST /api/sessions | `server/routes/sessions.ts` |
| P2-22 | [x] | GET /api/sessions | `server/routes/sessions.ts` |
| P2-23 | [x] | POST /api/sessions/:id/sets | `server/routes/sessions.ts` |
| P2-24 | [x] | GET /api/user/personal-records | `server/routes/user.ts` |
| P2-25 | [x] | GET /api/user/achievements | `server/routes/user.ts` |
| P2-26 | [x] | GET /api/user/streak | `server/routes/user.ts` |

### 2.4 Frontend Data Integration
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-27 | [x] | Add hooks for workouts and sessions | `client/src/hooks/use-workouts.ts`, `client/src/hooks/use-sessions.ts` |
| P2-28 | [x] | Connect session logging to API | `client/src/pages/ActiveSession.tsx` — uses `useStartSession()`, `useLogSet()`, `useCompleteSession()` |
| P2-29 | [x] | Save onboarding preferences to user profile | `client/src/pages/Onboarding.tsx` |
| P2-30 | [x] | Update hooks to include Firebase ID token in Authorization header | `client/src/hooks/use-workouts.ts`, `client/src/hooks/use-sessions.ts` |
| P2-31 | [x] | Connect Dashboard to real workout data | `client/src/pages/Dashboard.tsx` — uses `useTodayWorkout()`, `useWorkouts()` |
| P2-32 | [x] | Pass workout ID to ActiveSession via URL param | `client/src/pages/Dashboard.tsx`, `client/src/App.tsx` |

### 2.4a Firebase Data Connect Setup
*Prerequisite for persistent workout/session storage. Reference: [Firebase Data Connect Blog](https://firebase.blog/posts/2024/05/introducing-firebase-data-connect/)*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-4a-01 | [x] | Enable Firebase Data Connect in Firebase Console | Firebase Console |
| P2-4a-02 | [x] | Create GraphQL schema for workouts, sessions, sets, achievements, streaks | `dataconnect/schema/schema.gql` |
| P2-4a-03 | [x] | Define queries and mutations for workout CRUD operations | `dataconnect/connector/queries.gql` |
| P2-4a-04 | [x] | Define queries and mutations for session logging | `dataconnect/connector/mutations.gql` |
| P2-4a-05 | [x] | Generate and integrate type-safe client SDK | `server/storage-dataconnect.ts` |
| P2-4a-06 | [x] | Migrate storage layer from Drizzle to Data Connect SDK | `server/storage.ts` |
| P2-4a-07 | [x] | Test workout generation with persistent storage | — |
| P2-4a-08 | [-] | Migrate exercise data from Firestore to Data Connect (optional) | *Keeping exercises in Firestore for now* |

### 2.5 Workout Generation (Rule-Based)
*Complete. Workout generation now uses Firebase Data Connect for persistent storage.*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-33 | [x] | Create workout generator service with equipment-aware selection | `server/services/workout-generator.ts` |
| P2-34 | [x] | Add POST /api/workouts/generate endpoint | `server/routes/workouts.ts` |
| P2-35 | [x] | Add day selection step to onboarding (after frequency) | `client/src/pages/Onboarding.tsx` |
| P2-36 | [x] | Add `workoutDays?: number[]` to UserProfile.preferences type | `client/src/lib/firebase.ts` |
| P2-37 | [x] | Call generate API after onboarding completion | `client/src/pages/Onboarding.tsx` |
| P2-38 | [x] | Update workout routes to use Firebase token auth | `server/routes/workouts.ts` — `verifyFirebaseToken` middleware |
| P2-39 | [x] | Update session routes to use Firebase token auth | `server/routes/sessions.ts` — `verifyFirebaseToken` middleware |
| P2-40 | [x] | Update user routes to use Firebase token auth | `server/routes/user.ts` — `verifyFirebaseToken` middleware |
| P2-41 | [x] | Create ScheduleEditor component for day adjustment | `client/src/components/ScheduleEditor.tsx` |
| P2-42 | [x] | Test workout generation with persistent storage | *Working with Firebase Data Connect* |

---

## Phase 2.6: AI Personal Trainer

*Goal: Intelligent coaching powered by OpenAI GPT-5.1*

### 2.6.1 Core Infrastructure
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-01 | [ ] | Set up Gemini API integration with provider abstraction layer | `server/services/ai-provider.ts` (new) |
| P2.6-02 | [ ] | Create AI tool definitions (workout generation, plan adjustment, progress analysis) | `server/services/ai-tools.ts` (new) |
| P2.6-03 | [ ] | Implement conversation history storage schema | `shared/schema.ts` |
| P2.6-04 | [ ] | Build AI context builder (aggregates user data for prompts) | `server/services/ai-context.ts` (new) |

### 2.6.2 Chat Interface
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-05 | [ ] | Design chat UI component (brutalist terminal aesthetic) | `client/src/components/ai/AIChat.tsx` (new) |
| P2.6-06 | [ ] | Implement streaming responses with typing indicator | `client/src/components/ai/AIChat.tsx` |
| P2.6-07 | [ ] | Add chat history view with session grouping | `client/src/components/ai/ChatHistory.tsx` (new) |
| P2.6-08 | [ ] | Create quick-action suggestion chips | `client/src/components/ai/QuickActions.tsx` (new) |

### 2.6.3 Proactive Coaching
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-09 | [ ] | Post-workout summary with AI insights | `client/src/components/ai/WorkoutSummary.tsx` (new) |
| P2.6-10 | [ ] | Rest timer motivational tips | `client/src/pages/ActiveSession.tsx` |
| P2.6-11 | [ ] | Weekly progress analysis notifications | `server/services/ai-notifications.ts` (new) |
| P2.6-12 | [ ] | Workout plan adjustment suggestions | `client/src/components/ai/PlanSuggestion.tsx` (new) |

### 2.6.4 AI Capabilities (Tool Calling)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-13 | [ ] | Generate personalized workout plans based on goals/history | `server/services/ai-tools.ts` |
| P2.6-14 | [ ] | Analyze progress and suggest deload/progression | `server/services/ai-tools.ts` |
| P2.6-15 | [ ] | Provide nutrition guidance (protein, meal timing) | `server/services/ai-tools.ts` |
| P2.6-16 | [ ] | Answer fitness questions with user context | `server/services/ai-tools.ts` |
| P2.6-17 | [ ] | Motivational coaching with brutalist personality | `server/services/ai-prompts.ts` (new) |

---

## Phase 2.7: AI Nutrition & Food Logging

*Goal: AI-driven food logging and nutrition analysis for calorie/protein insights*

### 2.7.1 Food Logging Infrastructure
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.7-01 | [ ] | Create food logging UI component | `client/src/components/nutrition/FoodLogger.tsx` (new) |
| P2.7-02 | [ ] | Add food entries table schema | `shared/schema.ts` |
| P2.7-03 | [ ] | Implement food logging API endpoints | `server/routes.ts` |

### 2.7.2 AI-Powered Meal Analysis
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.7-04 | [ ] | Implement AI meal analysis (calorie/protein detection from text/photos) | `server/services/ai-nutrition.ts` (new) |
| P2.7-05 | [ ] | Add meal photo upload and processing | `client/src/components/nutrition/MealCapture.tsx` (new) |
| P2.7-06 | [ ] | Create nutrition summary dashboard | `client/src/components/nutrition/NutritionSummary.tsx` (new) |

### 2.7.3 Coach Integration
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.7-07 | [ ] | Add nutrition insights to Coach page | `client/src/pages/Coach.tsx` |
| P2.7-08 | [ ] | Integrate calorie/protein tracking with workout data | `server/services/ai-context.ts` |
| P2.7-09 | [ ] | Add proactive nutrition recommendations based on training load | `server/services/ai-notifications.ts` |

---

## Phase 2.8: Training Plan Management

*Goal: Allow users to manage, reset, and customize their training plans*

### 2.8.1 Reset Training Plan
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.8-01 | [x] | Add DELETE /api/workouts/all endpoint | `server/routes/workouts.ts` |
| P2.8-02 | [x] | Add useDeleteAllWorkouts hook | `client/src/hooks/use-workouts.ts` |
| P2.8-03 | [x] | Add Reset Training Plan to AppHeader menu | `client/src/components/AppHeader.tsx` |
| P2.8-04 | [x] | Add confirmation dialog for reset | `client/src/components/AppHeader.tsx` |
| P2.8-05 | [x] | Reset onboardingCompleted in Firestore on reset | `server/routes/workouts.ts` |

### 2.8.2 Schedule Editor Integration
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.8-06 | [x] | Wire up Schedule Editor to AppHeader menu | `client/src/components/AppHeader.tsx` |
| P2.8-07 | [x] | Schedule Editor saves day changes to Data Connect | `client/src/components/ScheduleEditor.tsx` |

### 2.8.3 Bug Fixes
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.8-08 | [x] | Fix SwapExercise route ordering (alternatives before :id) | `server/routes/exercises.ts` |
| P2.8-09 | [x] | Fix race condition on dashboard load after onboarding | `client/src/pages/Onboarding.tsx` |

---

## Phase 2.9: UX Bug Fixes

*Goal: Fix critical UX bugs blocking smooth user experience*

### 2.9.1 Workout Loading Race Condition — ✅ FIXED
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.9-01 | [x] | Debug why refetchQueries doesn't prevent empty dashboard — Root cause: `refetchProfile()` triggered route redirect | `client/src/pages/Onboarding.tsx` |
| P2.9-02 | [x] | Add 3-second animated completion screen with status messages | `client/src/pages/Onboarding.tsx` |
| P2.9-03 | [x] | Defer `refetchProfile()` to button click to prevent premature navigation | `client/src/pages/Onboarding.tsx` |

### 2.9.2 Swap Exercise Alternatives Not Loading
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.9-04 | [ ] | Debug useExercise hook data flow in SwapExerciseSheet | `client/src/components/SwapExerciseSheet.tsx` |
| P2.9-05 | [ ] | Verify GET /api/exercises/:id/alternatives returns data | `server/routes/exercises.ts` |
| P2.9-06 | [ ] | Add console logging to trace exerciseId through component lifecycle | `client/src/components/SwapExerciseSheet.tsx` |

### 2.9.3 Exercise Database Coverage
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.9-07 | [ ] | Audit exercise database for bodyweight-only exercises | Firestore `exercises` collection |
| P2.9-08 | [ ] | Update workout generator to handle cases with no matching exercises | `server/services/workout-generator.ts` |
| P2.9-09 | [ ] | Add fallback exercises for each body part when equipment filter returns empty | `server/services/workout-generator.ts` |
| P2.9-10 | [ ] | Consider expanding equipment options in onboarding (e.g., "minimal" includes bands/mat) | `client/src/pages/Onboarding.tsx` |

---

## Phase 3: Gamification System

*Goal: Make progress feel rewarding*

### 3.1 Achievement System
| ID | Status | Task | Files |
|----|--------|------|-------|
| P3-01 | [ ] | Design achievement categories and criteria | — |
| P3-02 | [ ] | Create AchievementBadge component | `client/src/components/gamification/AchievementBadge.tsx` (new) |
| P3-03 | [ ] | Create AchievementsList component | `client/src/components/gamification/AchievementsList.tsx` (new) |
| P3-04 | [ ] | Create AchievementUnlockModal component | `client/src/components/gamification/AchievementUnlockModal.tsx` (new) |
| P3-05 | [ ] | Implement achievement unlock detection logic | `server/routes.ts` |
| P3-06 | [ ] | Add achievements page/section to app | `client/src/pages/Achievements.tsx` (new) |

### 3.2 Personal Records (PRs)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P3-07 | [ ] | Implement PR detection on set logging | `server/routes.ts` |
| P3-08 | [ ] | Create PRCelebration animation component | `client/src/components/gamification/PRCelebration.tsx` (new) |
| P3-09 | [ ] | Show PR indicator during set entry | `client/src/pages/ActiveSession.tsx` |
| P3-10 | [ ] | Create PRHistory component | `client/src/components/gamification/PRHistory.tsx` (new) |

### 3.3 Streak System
| ID | Status | Task | Files |
|----|--------|------|-------|
| P3-11 | [ ] | Implement streak tracking logic on backend | `server/routes.ts` |
| P3-12 | [ ] | Create StreakDisplay component | `client/src/components/gamification/StreakDisplay.tsx` (new) |
| P3-13 | [ ] | Add streak to dashboard header | `client/src/pages/Dashboard.tsx` |
| P3-14 | [ ] | Create streak milestone celebration | `client/src/components/gamification/StreakMilestone.tsx` (new) |

### 3.4 Progress Visualization
| ID | Status | Task | Files |
|----|--------|------|-------|
| P3-15 | [ ] | Create StrengthChart component (per exercise) | `client/src/components/stats/StrengthChart.tsx` (new) |
| P3-16 | [ ] | Create VolumeChart component (weekly/monthly) | `client/src/components/stats/VolumeChart.tsx` (new) |
| P3-17 | [ ] | Create ActivityHeatmap component | `client/src/components/stats/ActivityHeatmap.tsx` (new) |
| P3-18 | [ ] | Create Stats page | `client/src/pages/Stats.tsx` (new) |

---

## Phase 4: Polish & Delight

*Goal: Make the app feel magical*

### 4.1 Micro-interactions
| ID | Status | Task | Files |
|----|--------|------|-------|
| P4-01 | [ ] | Add button press scale animations | Global CSS/components |
| P4-02 | [ ] | Add page transition animations | `client/src/App.tsx` |
| P4-03 | [ ] | Implement pull-to-refresh on dashboard | `client/src/pages/Dashboard.tsx` |
| P4-04 | [ ] | Add loading skeletons | Various components |

### 4.2 Celebrations
| ID | Status | Task | Files |
|----|--------|------|-------|
| P4-05 | [ ] | Create confetti particle system | `client/src/components/effects/Confetti.tsx` (new) |
| P4-06 | [ ] | Workout completion celebration screen | `client/src/pages/ActiveSession.tsx` |
| P4-07 | [ ] | Weekly summary celebration | — |

### 4.3 Session Experience
| ID | Status | Task | Files |
|----|--------|------|-------|
| P4-08 | [ ] | Add exercise transition animations | `client/src/pages/ActiveSession.tsx` |
| P4-09 | [ ] | Set completion micro-celebration | `client/src/pages/ActiveSession.tsx` |
| P4-10 | [ ] | Quick weight/reps presets based on history | `client/src/pages/ActiveSession.tsx` |

---

## Phase 5: Future — React Native

*Goal: Native mobile experience*

| ID | Status | Task | Files |
|----|--------|------|-------|
| P5-01 | [ ] | Audit PWA feature usage for RN equivalents | — |
| P5-02 | [ ] | Plan shared code architecture | — |
| P5-03 | [ ] | Set up React Native project (Expo) | New repository |
| P5-04 | [ ] | Migrate component library | — |
| P5-05 | [ ] | Implement native navigation | — |
| P5-06 | [ ] | Add native haptics & animations | — |
| P5-07 | [ ] | Implement push notifications | — |
| P5-08 | [ ] | App Store submission | — |
| P5-09 | [ ] | Play Store submission | — |

---

## Changelog

*AI agents: Append completed work here after each session*

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| 2025-11-30 | Initial roadmap created | Prototype analysis complete |
| 2025-11-30 | Added Phase 2.5: AI Personal Trainer | OpenAI GPT-5.1 integration planned |
| 2025-11-30 | P1-04, P1-05, P1-08, P1-09, P1-10, P1-11, P1-12 | Marked pre-existing implementations as complete |
| 2025-11-30 | P1-13 to P1-17, P1-40 to P1-42 | **Onboarding redesign**: 7-step flow, fixed bottom input, typing indicator, progress bar, completion celebration |
| 2025-11-30 | P1-43 to P1-62 | **3-tab navigation**: BottomNav (TODAY/COACH/HEALTH), AppHeader with settings gear, Dashboard redesign with week strip, Coach page with AI hub + chat, Health page with biometrics |
| 2025-11-30 | P1-63 to P1-69 | **Dashboard exercise actions**: SWAP, SKIP, NOTES buttons, exercise database with form cues, Notes sheet, Skip confirmation with swap option, Swap sheet with 3 alternatives |
| 2025-11-30 | P1-20, P1-21, P1-36, P1-37, P1-22 to P1-24, P1-38, P1-39, P1-28, P1-29, P1-30, P1-32 to P1-35 | **Dashboard & Session UI Audit**: Verified items implemented in code (calendar strip, bottom nav padding, gamification header, card touch targets, progress indicators, large timer, etc.) |
| 2025-11-30 | P1-18 | **Terminology Unification**: Renamed "Telemetry" tasks to "Health" to align with 3-tab structure and prevent duplicate build efforts |
| 2025-12-02 | P1-18 wording refresh, P1-19 removed | Clarified Telemetry/HealthPreviewCard consolidation and documented BottomNav as the Health entry point |
| 2025-12-02 | Onboarding: Back button, Height/Weight steps | **Onboarding enhancements**: Added Back button control, new Height and Weight hybrid input steps with quick options + custom numeric entry, 9-step flow |
| 2025-12-02 | P1-70, Phase 2.6 added | **Roadmap updates**: Added P1-70 for exercise notes in Active Session, added Phase 2.6 for AI Nutrition & Food Logging |
| 2025-12-02 | Phase 1.5 added | **Exercise Data Foundation**: New phase to sync ExerciseDB into Firebase (Firestore + Storage for GIFs), one-time batch script, API endpoints, frontend hooks |
| 2025-12-02 | P1.5-02 to P1.5-18, P1.5-21 to P1.5-23, P1.5-25 | **Phase 1.5 Implementation**: Firebase config, ExerciseDB service with batch fetch, sync script, exercise transformer, API endpoints (list/get/filter), useExercise/useExercises hooks, ExerciseNotesSheet Hero GIF section |
| 2025-12-02 | P1.5-01, P1.5-05 completed; P1.5-28 to P1.5-32 added | **Firebase Setup Complete**: User created Firebase project, configured security rules, synced 10 test exercises. Discovered RapidAPI limits (10 exercises, no storage allowed). Pivoted to Gumroad dataset approach. Added section 1.5.8 for dataset import. |
| 2025-12-02 | Section 1.5.8 updated, Architecture Decisions revised | **Data Source Pivot**: ExerciseDB Gumroad dataset costs $300 (not $49). Pivoted to free-exercise-db (yuhonas/free-exercise-db) — 800+ exercises with static images, open source (Unlicense). Updated roadmap to reflect new import tasks and schema notes. |
| 2025-12-03 | P1.5-28 to P1.5-33 completed | **Full Exercise Import**: Imported 868 exercises from free-exercise-db with GitHub image URLs. Deleted 10 old RapidAPI test exercises. Created cleanup script. |
| 2025-12-03 | P1.5-24 to P1.5-27 completed | **Frontend Cleanup**: Updated SwapExerciseSheet to use API alternatives. Deprecated EXERCISES constant. Dashboard now uses API-backed exercise data. |
| 2025-12-03 | P1-18, P1-25 to P1-27, P1-31, P1-70 completed | **Active Session Polish**: Added +/- quick adjust buttons (48px), 60px+ input containers, haptic feedback on all buttons, integrated ExerciseNotesSheet for form cues. Renamed Telemetry to HealthPreviewCard. |
| 2025-12-03 | P2-01 to P2-09 completed | **Database Schema**: Extended shared/schema.ts with users, workouts, workout_exercises, sessions, sets, personal_records, achievements, user_achievements, and streaks tables. |
| 2025-12-03 | P2-10 to P2-15 completed | **Authentication**: Added session middleware, auth endpoints (register/login/logout/me), AuthContext, and Auth page with brutalist login/register UI. |
| 2025-12-03 | P2-16 to P2-26 completed | **API Endpoints**: User profile endpoints, workout CRUD, session logging, set logging with PR detection and streak tracking. |
| 2025-12-03 | P2-27 to P2-29 completed | **Frontend Integration**: Dashboard shows auth status with login prompt, onboarding saves preferences to API, created useWorkouts and useSessions hooks. |
| 2025-12-04 | P2-10 to P2-15 migrated, P2-15b/c added | **Firebase Auth Migration**: Replaced session-based auth with Firebase Auth + Google Sign-In. User profiles now stored in Firestore `users` collection. Added proper auth flow gating (Landing → Auth → Onboarding → Dashboard). Added account menu with logout to AppHeader. |
| 2025-12-04 | P2-28 to P2-41 implemented | **Workout Generation System**: Created workout-generator.ts service with equipment-aware exercise selection, added POST /api/workouts/generate endpoint, added day selection to onboarding, updated all API routes to use Firebase token auth (`verifyFirebaseToken`), connected Dashboard and ActiveSession to real data hooks, created ScheduleEditor component. **⚠️ NOT WORKING**: Workouts not being created after onboarding — shows "7 rest days". Auth fixed (session→Firebase token), but issue persists. P2-42 debugging in progress. |
| 2025-12-04 | Phase 2.4a added | **Firebase Data Connect Planning**: Identified root cause of workout generation failure (in-memory storage). Added Phase 2.4a for Firebase Data Connect setup with Cloud SQL PostgreSQL. Updated Architecture Decisions to plan for Data Connect instead of external Neon/Postgres. All infrastructure will stay within Google/Firebase ecosystem. Reference: [Firebase Data Connect Blog](https://firebase.blog/posts/2024/05/introducing-firebase-data-connect/) |
| 2025-12-04 | P2-4a-01 to P2-4a-07 completed | **Firebase Data Connect Complete**: Created GraphQL schema (`dataconnect/schema/schema.gql`), queries (`dataconnect/connector/queries.gql`), mutations (`dataconnect/connector/mutations.gql`). Deployed to Cloud SQL. Created `server/storage-dataconnect.ts` implementation. Workouts now persist correctly. |
| 2025-12-04 | Phase 2.8 added, P2.8-01 to P2.8-09 completed | **Training Plan Management**: Added DELETE /api/workouts/all endpoint for reset. Added Reset Training Plan and Edit Schedule to AppHeader menu with confirmation dialog. Fixed SwapExercise route ordering bug (alternatives route now before :id). Fixed race condition on dashboard load after onboarding. Phase 2 complete! |
| 2025-12-04 | Schedule Editor redesigned, Phase 2.9 added | **UX Improvements**: Redesigned ScheduleEditor with intuitive day-based dropdown selection (single-tap to change any day's workout, smart swap when selecting workout already on another day). Refactored SwapExerciseSheet to accept exerciseId and fetch data internally. Added refetchQueries to Onboarding after workout generation. **Issues identified**: Race condition still occurs, swap alternatives still not loading, exercise database may lack coverage for equipment-less users. Added Phase 2.9 for debugging these issues. |
| 2025-12-05 | P2.9-01 to P2.9-03 completed | **Onboarding Race Condition FIXED**: Root cause was `refetchProfile()` updating auth context, triggering `OnboardingRoute` to redirect before 3-second delay. Fix: (1) Auto-start save/generate on completion screen mount, (2) Add 3-second minimum delay with animated terminal-style status messages, (3) Defer `refetchProfile()` to button click. Users now see celebratory completion screen with progress messages before dashboard. |
| 2025-12-05 | UI Refinement | **Visual Polish**: Refined Dashboard, Coach, and Health screens (plus AppHeader dialogs, ScheduleEditor, and Sheets) to use soft gray borders (`border-gray-200`) and rounded corners (`rounded-xl`) instead of hard black outlines. Reduced shadow intensity to `shadow-sm` to reduce visual clutter and improve content readability. |
