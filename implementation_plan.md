# AI Coach Mascot Upgrade Plan

## Goal
Replace the static "little green robot" (currently a simple `Bot` icon) with a dynamic, engaging, and animated "Mascot" that reacts to the AI's state (Idle, Thinking, Speaking, Error).

## User Review Required
> [!IMPORTANT]
> I am proposing a **CSS-animated Geometric Mascot** (a "Squircle" with expressive eyes) to fit the Brutalist theme while adding personality. It will not be a static image but a live React component.

## Proposed Changes

### Client Components

#### [NEW] [CoachMascot.tsx](file:///Users/lucasmpcoelho/BrutalistAITrainer/client/src/components/CoachMascot.tsx)
- Create a new component `CoachMascot` that accepts props:
    - `state`: 'idle' | 'thinking' | 'speaking' | 'error' | 'success'
    - `size`: 'sm' | 'md' | 'lg'
- Implement SVG/CSS animations for:
    - **Idle**: Gentle floating, occasional blinking.
    - **Thinking**: Eyes looking around or rotating loading state.
    - **Speaking**: Mouth animation or pulsing.
    - **Error**: Sad/Confused eyes.
    - **Success**: Happy/Squinting eyes.

### Client Pages

#### [MODIFY] [Coach.tsx](file:///Users/lucasmpcoelho/BrutalistAITrainer/client/src/pages/Coach.tsx)
- Import `CoachMascot`.
- Replace instances of `Bot` (Lucide icon) with `<CoachMascot />`.
- Pass current state (`thinking` based on `sendMessage.isPending`, etc.) to the mascot.
- Add a large version of the mascot in the center when there are no messages (placeholder).


## Mascot Enhancements (User Request)
- **Goal**: Add a visible mouth to the mascot in all states to make it clearly recognizable as a face, not just two dots.
- **Changes**:
    - Update `CoachMascot.tsx` to render a mouth element in `idle` and `thinking` states (previously hidden).
    - **Idle**: Small, neutral line or slight smile.
    - **Thinking**: Maybe a small "o" or straight line.
    - **Speaking**: Existing animation (moving mouth).
    - **Error/Success**: Existing variations (sad/happy mouth).

## Verification Plan

### Manual Verification
1.  **Idle State**: Open the "Coach" tab. Verify the mascot is present and gently animating (blinking/floating).
2.  **Thinking State**: Send a message. Verify the mascot changes to a "thinking" state (e.g., eyes moving) while waiting for the response.
3.  **Speaking/Response**: Verify the mascot reacts when the message arrives (optional: "happy" or "pulse" animation).
4.  **Empty State**: clear chat or view initial state. Verify the mascot is larger and welcoming in the center.
5.  **Quick Actions**: specific interactions like "Adjust Workout" should trigger reactive states if possible.
