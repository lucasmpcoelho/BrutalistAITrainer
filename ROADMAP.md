# IRON_AI — Product Roadmap

> **Last Updated:** 2025-11-30  
> **Current Phase:** Phase 1 — Mobile-First Foundation  
> **Status:** Onboarding redesign complete, continuing mobile-first work

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
- [x] Telemetry/biometrics panel (`client/src/components/dashboard/Telemetry.tsx`)
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

### Not Implemented
- [ ] PWA service worker for offline support (vite-plugin-pwa)
- [ ] Mobile-first UI for Dashboard, Active Session, Protocol Circuit
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
| P1-01 | [ ] | Remove `arMode` state and AR overlay from ActiveSession | `client/src/pages/ActiveSession.tsx` |
| P1-02 | [ ] | Remove Form Check button and Scan icon import | `client/src/pages/ActiveSession.tsx` |
| P1-03 | [ ] | Replace "Precision Form" feature with gamification feature | `client/src/components/Features.tsx` |

### 1.2 PWA Setup
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-04 | [x] | Create PWA manifest.json with app metadata | `client/public/manifest.json` |
| P1-05 | [x] | Add manifest link and iOS meta tags to index.html | `client/index.html` |
| P1-06 | [ ] | Install and configure vite-plugin-pwa | `package.json`, `vite.config.ts` |
| P1-07 | [ ] | Implement service worker for offline support | via vite-plugin-pwa |
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
| P1-18 | [ ] | Convert Telemetry sidebar to bottom sheet on mobile | `client/src/pages/Dashboard.tsx` |
| P1-19 | [ ] | Add floating action button for biometrics access | `client/src/pages/Dashboard.tsx` |
| P1-20 | [ ] | Optimize calendar strip for horizontal scroll/snap | `client/src/pages/Dashboard.tsx` |
| P1-21 | [ ] | Add bottom navigation bar | `client/src/pages/Dashboard.tsx` |
| P1-36 | [ ] | Add gamification header (streak display, XP/points) | `client/src/pages/Dashboard.tsx` |
| P1-37 | [ ] | Place primary "Start Workout" CTA in bottom thumb zone | `client/src/pages/Dashboard.tsx` |

### 1.6 Mobile-First UI — Protocol Circuit
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-22 | [ ] | Increase exercise card touch targets (56px+ height) | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-23 | [ ] | Make stats grid text larger (text-xl) | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-24 | [ ] | Fixed bottom CTA with safe area padding | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-38 | [ ] | Add visual progress indicator (X/Y exercises done) | `client/src/components/dashboard/ProtocolCircuit.tsx` |
| P1-39 | [ ] | Show workout metadata (muscle groups, estimated time) | `client/src/components/dashboard/ProtocolCircuit.tsx` |

### 1.7 Mobile-First UI — Active Session (Set Logging)
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-25 | [ ] | Add +/- quick adjust buttons for weight input (48px × 48px min) | `client/src/pages/ActiveSession.tsx` |
| P1-26 | [ ] | Add +/- quick adjust buttons for reps input (48px × 48px min) | `client/src/pages/ActiveSession.tsx` |
| P1-27 | [ ] | Set weight/reps input containers to 60px+ height | `client/src/pages/ActiveSession.tsx` |
| P1-28 | [ ] | Make LOG SET button full width, 56px+ height | `client/src/pages/ActiveSession.tsx` |
| P1-29 | [ ] | Add safe area padding to session screen | `client/src/pages/ActiveSession.tsx` |
| P1-30 | [ ] | Show previous set values as reference context | `client/src/pages/ActiveSession.tsx` |
| P1-31 | [ ] | Add haptic feedback on all button presses | `client/src/pages/ActiveSession.tsx` |
| P1-32 | [ ] | Minimal header with exercise name and back button only | `client/src/pages/ActiveSession.tsx` |

### 1.8 Mobile-First UI — Rest Timer
| ID | Status | Task | Files |
|----|--------|------|-------|
| P1-33 | [ ] | Giant timer display (80px+ font, monospace) | `client/src/pages/ActiveSession.tsx` |
| P1-34 | [ ] | Large +30s and SKIP buttons (80px min width) | `client/src/pages/ActiveSession.tsx` |
| P1-35 | [ ] | Preview next exercise during rest | `client/src/pages/ActiveSession.tsx` |

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

---

## Notes for AI Agents

When updating this roadmap:

1. **Mark task status** by changing `[ ]` to `[x]` (complete) or `[~]` (in progress)
2. **Update "Active Work"** section in Current State when starting tasks
3. **Append to Changelog** after completing work with date and task IDs
4. **Update "Last Updated"** timestamp in header
5. **Update "Current Phase"** when moving to next phase
6. **Move completed items** from "Not Implemented" to "Implemented" in Current State

### Status Legend
- `[ ]` — Not started
- `[~]` — In progress
- `[x]` — Complete

### Task ID Format
- `P1-XX` — Phase 1 tasks (P1-40+ for additional onboarding tasks)
- `P2-XX` — Phase 2 tasks
- `P2.5-XX` — Phase 2.5 tasks (AI Personal Trainer)
- `P3-XX` — Phase 3 tasks
- `P4-XX` — Phase 4 tasks
- `P5-XX` — Phase 5 tasks

