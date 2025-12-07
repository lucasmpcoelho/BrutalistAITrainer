# AI Coach Mascot Upgrade Walkthrough

I have successfully upgraded the AI Coach UI by replacing the static robot icon with a dynamic, animated **Coach Mascot**.

## Changes

### 1. New Mascot Component
Created `CoachMascot.tsx`, a CSS-animated component featuring:
- **"Squircle" Shape**: A brutalist-friendly geometric face.
- **Animated States**:
    - **Idle**: Periodic blinking loops (randomized) + **Neutral Mouth**.
    - **Thinking**: Orbiting indicator, pulsating eyes + **"O" shaped Mouth**.
    - **Speaking**: Mouth animation simulation (opening/closing).
    - **Error/Success**: Emotive eye shapes + **Expressive Mouths** (sad/happy).

### 2. UI Integration
Modified `Coach.tsx` to integrate the mascot in key areas:
- **Header**: Shows small mascot, reacting to "Thinking" state when sending messages.
- **Insight Card**: Shows mascot next to daily insights.
- **Empty State**: Displays a large welcoming mascot when no conversation exists.

## Verification
The mascot logic handles state transitions based on `sendMessage.isPending` and other flags, ensuring the user gets visual feedback during AI interactions.

## Next Steps
- You can experiment with more states (e.g., "Success" after completing a workout).
- Adjust animations if needed for performance or style preferences.
