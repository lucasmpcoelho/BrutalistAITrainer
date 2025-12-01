// Exercise database with form cues, alternatives, and muscle targeting

export interface ExerciseCue {
  text: string;
  isAvoid?: boolean;
}

export interface ExerciseData {
  id: string;
  name: string;
  type: "compound" | "accessory" | "isolation";
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  cues: ExerciseCue[];
  alternatives: string[]; // IDs of alternative exercises
}

// Exercise database
export const EXERCISES: Record<string, ExerciseData> = {
  "barbell-squat": {
    id: "barbell-squat",
    name: "Barbell Squat",
    type: "compound",
    equipment: "Barbell + Rack",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Core", "Hamstrings"],
    cues: [
      { text: "Feet shoulder-width apart, toes slightly out" },
      { text: "Break at hips AND knees simultaneously" },
      { text: "Keep chest up and eyes forward" },
      { text: "Drive through mid-foot on the way up" },
      { text: "Knees caving inward", isAvoid: true },
      { text: "Heels lifting off the ground", isAvoid: true },
      { text: "Excessive forward lean", isAvoid: true },
    ],
    alternatives: ["leg-press", "goblet-squat", "hack-squat"],
  },
  "romanian-deadlift": {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    type: "compound",
    equipment: "Barbell",
    primaryMuscles: ["Hamstrings", "Glutes"],
    secondaryMuscles: ["Lower Back", "Core"],
    cues: [
      { text: "Start standing, barbell at hip level" },
      { text: "Push hips back while keeping legs nearly straight" },
      { text: "Lower until you feel a hamstring stretch" },
      { text: "Keep bar close to your legs throughout" },
      { text: "Rounding your lower back", isAvoid: true },
      { text: "Bending knees too much (this becomes a deadlift)", isAvoid: true },
      { text: "Looking up (keep neck neutral)", isAvoid: true },
    ],
    alternatives: ["stiff-leg-deadlift", "dumbbell-rdl", "good-morning"],
  },
  "walking-lunges": {
    id: "walking-lunges",
    name: "Walking Lunges",
    type: "accessory",
    equipment: "Dumbbells",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    cues: [
      { text: "Take a big step forward, lowering back knee to ground" },
      { text: "Keep torso upright throughout the movement" },
      { text: "Push through front heel to stand" },
      { text: "Alternate legs with each step" },
      { text: "Front knee going past toes excessively", isAvoid: true },
      { text: "Leaning forward or twisting torso", isAvoid: true },
      { text: "Taking too short of steps", isAvoid: true },
    ],
    alternatives: ["reverse-lunges", "split-squat", "step-ups"],
  },
  "leg-extension": {
    id: "leg-extension",
    name: "Leg Extension",
    type: "isolation",
    equipment: "Machine",
    primaryMuscles: ["Quads"],
    secondaryMuscles: [],
    cues: [
      { text: "Adjust pad to sit just above ankles" },
      { text: "Extend legs fully, squeezing quads at top" },
      { text: "Lower slowly with control (3 seconds)" },
      { text: "Keep back pressed firmly against seat" },
      { text: "Using momentum to swing the weight", isAvoid: true },
      { text: "Lifting hips off the seat", isAvoid: true },
      { text: "Locking knees aggressively at the top", isAvoid: true },
    ],
    alternatives: ["sissy-squat", "leg-press-high", "front-squat"],
  },
  // Alternative exercises
  "leg-press": {
    id: "leg-press",
    name: "Leg Press",
    type: "compound",
    equipment: "Machine",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings"],
    cues: [
      { text: "Place feet shoulder-width on platform" },
      { text: "Lower weight until knees are at 90 degrees" },
      { text: "Push through heels to extend legs" },
      { text: "Don't lock knees at the top" },
      { text: "Letting lower back round off the pad", isAvoid: true },
      { text: "Placing feet too high or too low", isAvoid: true },
    ],
    alternatives: ["barbell-squat", "hack-squat", "goblet-squat"],
  },
  "goblet-squat": {
    id: "goblet-squat",
    name: "Goblet Squat",
    type: "compound",
    equipment: "Dumbbell/Kettlebell",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Core"],
    cues: [
      { text: "Hold weight at chest level, elbows pointing down" },
      { text: "Squat between your legs, not over them" },
      { text: "Keep torso as upright as possible" },
      { text: "Push knees out over toes" },
      { text: "Letting elbows drop", isAvoid: true },
      { text: "Rounding upper back", isAvoid: true },
    ],
    alternatives: ["barbell-squat", "leg-press", "front-squat"],
  },
  "hack-squat": {
    id: "hack-squat",
    name: "Hack Squat",
    type: "compound",
    equipment: "Machine",
    primaryMuscles: ["Quads"],
    secondaryMuscles: ["Glutes"],
    cues: [
      { text: "Position shoulders under pads, back flat" },
      { text: "Feet shoulder-width, slightly forward on platform" },
      { text: "Lower until thighs are parallel or below" },
      { text: "Drive through heels to extend" },
      { text: "Heels coming off the platform", isAvoid: true },
      { text: "Locking knees at the top", isAvoid: true },
    ],
    alternatives: ["barbell-squat", "leg-press", "front-squat"],
  },
  "stiff-leg-deadlift": {
    id: "stiff-leg-deadlift",
    name: "Stiff-Leg Deadlift",
    type: "compound",
    equipment: "Barbell",
    primaryMuscles: ["Hamstrings"],
    secondaryMuscles: ["Glutes", "Lower Back"],
    cues: [
      { text: "Keep legs straight (slight bend okay)" },
      { text: "Hinge at hips, pushing them back" },
      { text: "Lower bar along legs until hamstring stretch" },
      { text: "Squeeze glutes at the top" },
      { text: "Rounding the lower back", isAvoid: true },
      { text: "Bending knees excessively", isAvoid: true },
    ],
    alternatives: ["romanian-deadlift", "dumbbell-rdl", "good-morning"],
  },
  "dumbbell-rdl": {
    id: "dumbbell-rdl",
    name: "Dumbbell RDL",
    type: "compound",
    equipment: "Dumbbells",
    primaryMuscles: ["Hamstrings", "Glutes"],
    secondaryMuscles: ["Lower Back"],
    cues: [
      { text: "Hold dumbbells in front of thighs" },
      { text: "Push hips back, sliding weights down legs" },
      { text: "Keep dumbbells close to your body" },
      { text: "Feel the stretch in hamstrings before returning" },
      { text: "Rounding the back", isAvoid: true },
      { text: "Going too fast on the eccentric", isAvoid: true },
    ],
    alternatives: ["romanian-deadlift", "stiff-leg-deadlift", "good-morning"],
  },
  "good-morning": {
    id: "good-morning",
    name: "Good Morning",
    type: "compound",
    equipment: "Barbell",
    primaryMuscles: ["Hamstrings", "Lower Back"],
    secondaryMuscles: ["Glutes"],
    cues: [
      { text: "Bar on upper back like a squat" },
      { text: "Push hips back, keeping legs nearly straight" },
      { text: "Lower until torso is near parallel to ground" },
      { text: "Squeeze glutes to return to standing" },
      { text: "Rounding the lower back", isAvoid: true },
      { text: "Going too heavy before mastering form", isAvoid: true },
    ],
    alternatives: ["romanian-deadlift", "stiff-leg-deadlift", "dumbbell-rdl"],
  },
  "reverse-lunges": {
    id: "reverse-lunges",
    name: "Reverse Lunges",
    type: "accessory",
    equipment: "Dumbbells",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings"],
    cues: [
      { text: "Step backward, lowering back knee toward ground" },
      { text: "Keep front shin vertical" },
      { text: "Push through front heel to return" },
      { text: "Keep torso upright throughout" },
      { text: "Letting front knee cave inward", isAvoid: true },
      { text: "Leaning forward excessively", isAvoid: true },
    ],
    alternatives: ["walking-lunges", "split-squat", "step-ups"],
  },
  "split-squat": {
    id: "split-squat",
    name: "Split Squat",
    type: "accessory",
    equipment: "Dumbbells",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings"],
    cues: [
      { text: "Stagger stance with one foot forward" },
      { text: "Lower straight down, back knee toward floor" },
      { text: "Keep 80% of weight on front leg" },
      { text: "Push through front heel to stand" },
      { text: "Leaning forward", isAvoid: true },
      { text: "Back foot doing too much work", isAvoid: true },
    ],
    alternatives: ["walking-lunges", "reverse-lunges", "step-ups"],
  },
  "step-ups": {
    id: "step-ups",
    name: "Step-Ups",
    type: "accessory",
    equipment: "Box/Bench + Dumbbells",
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings"],
    cues: [
      { text: "Place entire foot on box/bench" },
      { text: "Drive through heel of elevated foot" },
      { text: "Stand fully at the top" },
      { text: "Lower with control" },
      { text: "Pushing off back foot", isAvoid: true },
      { text: "Using momentum", isAvoid: true },
    ],
    alternatives: ["walking-lunges", "reverse-lunges", "split-squat"],
  },
  "sissy-squat": {
    id: "sissy-squat",
    name: "Sissy Squat",
    type: "isolation",
    equipment: "Bodyweight/Machine",
    primaryMuscles: ["Quads"],
    secondaryMuscles: [],
    cues: [
      { text: "Hold onto something for balance" },
      { text: "Rise onto toes, lean back at knees" },
      { text: "Lower until you feel deep quad stretch" },
      { text: "Keep hips extended throughout" },
      { text: "Bending at the hips", isAvoid: true },
      { text: "Going too deep too soon", isAvoid: true },
    ],
    alternatives: ["leg-extension", "front-squat", "leg-press-high"],
  },
  "leg-press-high": {
    id: "leg-press-high",
    name: "Leg Press (High Foot)",
    type: "compound",
    equipment: "Machine",
    primaryMuscles: ["Quads"],
    secondaryMuscles: ["Glutes"],
    cues: [
      { text: "Place feet high on platform" },
      { text: "This emphasizes quads more" },
      { text: "Lower with control, push through heels" },
      { text: "Don't lock knees at top" },
      { text: "Lower back rounding off pad", isAvoid: true },
    ],
    alternatives: ["leg-extension", "sissy-squat", "front-squat"],
  },
  "front-squat": {
    id: "front-squat",
    name: "Front Squat",
    type: "compound",
    equipment: "Barbell + Rack",
    primaryMuscles: ["Quads"],
    secondaryMuscles: ["Core", "Glutes"],
    cues: [
      { text: "Bar rests on front delts, elbows high" },
      { text: "Keep torso as vertical as possible" },
      { text: "Squat to parallel or below" },
      { text: "Drive through mid-foot" },
      { text: "Letting elbows drop", isAvoid: true },
      { text: "Leaning forward", isAvoid: true },
    ],
    alternatives: ["goblet-squat", "leg-press", "hack-squat"],
  },
};

// Helper function to get exercise by ID
export function getExercise(id: string): ExerciseData | undefined {
  return EXERCISES[id];
}

// Helper function to get alternatives for an exercise
export function getAlternatives(exerciseId: string): ExerciseData[] {
  const exercise = EXERCISES[exerciseId];
  if (!exercise) return [];
  
  return exercise.alternatives
    .map(altId => EXERCISES[altId])
    .filter((ex): ex is ExerciseData => ex !== undefined)
    .slice(0, 3); // Return max 3 alternatives
}

// Helper to convert exercise name to ID
export function nameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}


