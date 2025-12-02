# IRON_AI — Product Roadmap

> **Last Updated:** 2025-11-30  
> **Current Phase:** Phase 1 — Mobile-First Foundation  
> **Status:** Onboarding redesign complete, Dashboard/Session UI polished, continuing mobile-first work

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

### Not Implemented
- [ ] PWA service worker for offline support (vite-plugin-pwa)
- [ ] Mobile-first UI for Active Session
- [ ] Backend API endpoints
- [ ] Database persistence (currently mock data)
- [ ] User authentication
- [ ] Gamification system (achievements, streaks, PRs)
- [ ] Progress tracking and charts
- [ ] Health app integrations
- [ ] AI Personal Trainer (chat interface, proactive coaching, workout generation)

### Active Work
- None currently in progress

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
| P1-18 | [ ] | Consolidate naming: ensure dashboard references the Telemetry/HealthPreviewCard component consistently | `client/src/components/dashboard/Telemetry.tsx` (to be aliased as HealthPreviewCard) |
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
| P1-25 | [ ] | Add +/- quick adjust buttons for weight input (48px × 48px min) | `client/src/pages/ActiveSession.tsx` |
| P1-26 | [ ] | Add +/- quick adjust buttons for reps input (48px × 48px min) | `client/src/pages/ActiveSession.tsx` |
| P1-27 | [ ] | Set weight/reps input containers to 60px+ height | `client/src/pages/ActiveSession.tsx` |
| P1-28 | [x] | Make LOG SET button full width, 56px+ height | `client/src/pages/ActiveSession.tsx` |
| P1-29 | [x] | Add safe area padding to session screen | `client/src/pages/ActiveSession.tsx` |
| P1-30 | [x] | Show previous set values as reference context | `client/src/pages/ActiveSession.tsx` |
| P1-31 | [ ] | Add haptic feedback on all button presses | `client/src/pages/ActiveSession.tsx` |
| P1-32 | [x] | Minimal header with exercise name and back button only | `client/src/pages/ActiveSession.tsx` |
| P1-70 | [ ] | Integrate exercise notes sheet in active session for form cues access during workout | `client/src/pages/ActiveSession.tsx` |

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

## Phase 2: Backend & Persistence

*Goal: Real data storage and user accounts*

### 2.1 Database Schema
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-01 | [ ] | Add workouts table schema | `shared/schema.ts` |
| P2-02 | [ ] | Add exercises table schema | `shared/schema.ts` |
| P2-03 | [ ] | Add sessions table schema | `shared/schema.ts` |
| P2-04 | [ ] | Add sets table schema | `shared/schema.ts` |
| P2-05 | [ ] | Add personal_records table schema | `shared/schema.ts` |
| P2-06 | [ ] | Add achievements table schema | `shared/schema.ts` |
| P2-07 | [ ] | Add user_achievements table schema | `shared/schema.ts` |
| P2-08 | [ ] | Add streaks table schema | `shared/schema.ts` |
| P2-09 | [ ] | Run database migrations | `npm run db:push` |

### 2.2 Authentication
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-10 | [ ] | Implement user registration endpoint | `server/routes.ts` |
| P2-11 | [ ] | Implement user login endpoint | `server/routes.ts` |
| P2-12 | [ ] | Implement user logout endpoint | `server/routes.ts` |
| P2-13 | [ ] | Add session middleware | `server/app.ts` |
| P2-14 | [ ] | Create auth context on frontend | `client/src/contexts/AuthContext.tsx` (new) |
| P2-15 | [ ] | Add login/register screens | `client/src/pages/Auth.tsx` (new) |

### 2.3 API Endpoints
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-16 | [ ] | GET /api/user/profile | `server/routes.ts` |
| P2-17 | [ ] | PUT /api/user/profile | `server/routes.ts` |
| P2-18 | [ ] | GET /api/workouts | `server/routes.ts` |
| P2-19 | [ ] | POST /api/workouts | `server/routes.ts` |
| P2-20 | [ ] | GET /api/workouts/:id | `server/routes.ts` |
| P2-21 | [ ] | POST /api/sessions | `server/routes.ts` |
| P2-22 | [ ] | GET /api/sessions | `server/routes.ts` |
| P2-23 | [ ] | POST /api/sessions/:id/sets | `server/routes.ts` |
| P2-24 | [ ] | GET /api/personal-records | `server/routes.ts` |
| P2-25 | [ ] | GET /api/achievements | `server/routes.ts` |
| P2-26 | [ ] | GET /api/streaks | `server/routes.ts` |

### 2.4 Frontend Data Integration
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2-27 | [ ] | Replace mock workout data with API calls | `client/src/pages/Dashboard.tsx` |
| P2-28 | [ ] | Connect session logging to API | `client/src/pages/ActiveSession.tsx` |
| P2-29 | [ ] | Save onboarding preferences to user profile | `client/src/pages/Onboarding.tsx` |

---

## Phase 2.5: AI Personal Trainer

*Goal: Intelligent coaching powered by OpenAI GPT-5.1*

### 2.5.1 Core Infrastructure
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.5-01 | [ ] | Set up OpenAI API integration with provider abstraction layer | `server/services/ai-provider.ts` (new) |
| P2.5-02 | [ ] | Create AI tool definitions (workout generation, plan adjustment, progress analysis) | `server/services/ai-tools.ts` (new) |
| P2.5-03 | [ ] | Implement conversation history storage schema | `shared/schema.ts` |
| P2.5-04 | [ ] | Build AI context builder (aggregates user data for prompts) | `server/services/ai-context.ts` (new) |

### 2.5.2 Chat Interface
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.5-05 | [ ] | Design chat UI component (brutalist terminal aesthetic) | `client/src/components/ai/AIChat.tsx` (new) |
| P2.5-06 | [ ] | Implement streaming responses with typing indicator | `client/src/components/ai/AIChat.tsx` |
| P2.5-07 | [ ] | Add chat history view with session grouping | `client/src/components/ai/ChatHistory.tsx` (new) |
| P2.5-08 | [ ] | Create quick-action suggestion chips | `client/src/components/ai/QuickActions.tsx` (new) |

### 2.5.3 Proactive Coaching
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.5-09 | [ ] | Post-workout summary with AI insights | `client/src/components/ai/WorkoutSummary.tsx` (new) |
| P2.5-10 | [ ] | Rest timer motivational tips | `client/src/pages/ActiveSession.tsx` |
| P2.5-11 | [ ] | Weekly progress analysis notifications | `server/services/ai-notifications.ts` (new) |
| P2.5-12 | [ ] | Workout plan adjustment suggestions | `client/src/components/ai/PlanSuggestion.tsx` (new) |

### 2.5.4 AI Capabilities (Tool Calling)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.5-13 | [ ] | Generate personalized workout plans based on goals/history | `server/services/ai-tools.ts` |
| P2.5-14 | [ ] | Analyze progress and suggest deload/progression | `server/services/ai-tools.ts` |
| P2.5-15 | [ ] | Provide nutrition guidance (protein, meal timing) | `server/services/ai-tools.ts` |
| P2.5-16 | [ ] | Answer fitness questions with user context | `server/services/ai-tools.ts` |
| P2.5-17 | [ ] | Motivational coaching with brutalist personality | `server/services/ai-prompts.ts` (new) |

---

## Phase 2.6: AI Nutrition & Food Logging

*Goal: AI-driven food logging and nutrition analysis for calorie/protein insights*

### 2.6.1 Food Logging Infrastructure
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-01 | [ ] | Create food logging UI component | `client/src/components/nutrition/FoodLogger.tsx` (new) |
| P2.6-02 | [ ] | Add food entries table schema | `shared/schema.ts` |
| P2.6-03 | [ ] | Implement food logging API endpoints | `server/routes.ts` |

### 2.6.2 AI-Powered Meal Analysis
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-04 | [ ] | Implement AI meal analysis (calorie/protein detection from text/photos) | `server/services/ai-nutrition.ts` (new) |
| P2.6-05 | [ ] | Add meal photo upload and processing | `client/src/components/nutrition/MealCapture.tsx` (new) |
| P2.6-06 | [ ] | Create nutrition summary dashboard | `client/src/components/nutrition/NutritionSummary.tsx` (new) |

### 2.6.3 Coach Integration
| ID | Status | Task | Files |
|----|--------|------|-------|
| P2.6-07 | [ ] | Add nutrition insights to Coach page | `client/src/pages/Coach.tsx` |
| P2.6-08 | [ ] | Integrate calorie/protein tracking with workout data | `server/services/ai-context.ts` |
| P2.6-09 | [ ] | Add proactive nutrition recommendations based on training load | `server/services/ai-notifications.ts` |

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
