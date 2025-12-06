/**
 * AI Context Builder Service
 * 
 * Aggregates user data from Firestore and Data Connect to build
 * comprehensive context for the AI Coach.
 */

import { db } from "../config/firebase.js";
import { dataConnectStorage } from "../storage-dataconnect.js";
import { formatUserContext } from "./ai-prompts.js";

export interface UserProfile {
  name?: string;
  goal?: string;
  experience?: string;
  equipment?: string;
  injuries?: string;
  frequency?: number;
  heightCm?: number;
  weightKg?: number;
  onboardingCompleted?: boolean;
}

export interface WorkoutContext {
  name: string;
  type: string;
  exercises: Array<{
    id: string;
    name: string;
    targetSets: number;
    targetReps: string;
  }>;
}

export interface RecentWorkout {
  name: string;
  date: string;
  completed: boolean;
}

export interface WeeklyWorkout {
  dayOfWeek: number;
  dayName: string;
  workout: WorkoutContext | null; // null = rest day
}

export interface CoachContext {
  userContext: string;
  profile: UserProfile;
  todayWorkout?: WorkoutContext;
  weekSchedule: WeeklyWorkout[];
  recentWorkouts: RecentWorkout[];
  currentStreak: number;
}

/**
 * Fetch user profile from Firestore
 */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) {
    console.warn("[ai-context] Firestore not initialized");
    return null;
  }
  
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    
    const data = userDoc.data();
    if (!data?.preferences) {
      return null;
    }
    
    return {
      name: data.displayName || data.email?.split("@")[0],
      goal: data.preferences.goal,
      experience: data.preferences.experience,
      equipment: data.preferences.equipment,
      injuries: data.preferences.injuries,
      frequency: data.preferences.frequency,
      heightCm: data.preferences.heightCm,
      weightKg: data.preferences.weightKg,
      onboardingCompleted: data.onboardingCompleted,
    };
  } catch (error) {
    console.error("[ai-context] Error fetching user profile:", error);
    return null;
  }
}

/**
 * Get today's workout for the user
 */
async function getTodayWorkout(userId: string): Promise<WorkoutContext | undefined> {
  try {
    const workouts = await dataConnectStorage.getWorkouts(userId);
    const today = new Date().getDay(); // 0 = Sunday
    
    const todayWorkout = workouts.find(w => w.dayOfWeek === today && w.isActive);
    if (!todayWorkout) {
      return undefined;
    }
    
    const exercises = await dataConnectStorage.getWorkoutExercises(todayWorkout.id);
    
    return {
      name: todayWorkout.name,
      type: todayWorkout.type,
      exercises: exercises.map(e => ({
        id: e.exerciseId,
        name: e.exerciseName,
        targetSets: e.targetSets,
        targetReps: e.targetReps,
      })),
    };
  } catch (error) {
    console.error("[ai-context] Error fetching today's workout:", error);
    return undefined;
  }
}

/**
 * Get recent workout sessions (last 7 days)
 */
async function getRecentWorkouts(userId: string): Promise<RecentWorkout[]> {
  try {
    const sessions = await dataConnectStorage.getSessions(userId, 10);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sessions
      .filter(s => s.startedAt >= sevenDaysAgo)
      .map(s => ({
        name: s.workoutName,
        date: s.startedAt.toLocaleDateString("en-US", { 
          weekday: "short", 
          month: "short", 
          day: "numeric" 
        }),
        completed: s.status === "completed",
      }));
  } catch (error) {
    console.error("[ai-context] Error fetching recent workouts:", error);
    return [];
  }
}

/**
 * Get user's current streak
 */
async function getCurrentStreak(userId: string): Promise<number> {
  try {
    const streak = await dataConnectStorage.getStreak(userId);
    return streak?.currentStreak || 0;
  } catch (error) {
    console.error("[ai-context] Error fetching streak:", error);
    return 0;
  }
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Get full week schedule with all exercises for each day
 */
async function getWeekSchedule(userId: string): Promise<WeeklyWorkout[]> {
  try {
    const workouts = await dataConnectStorage.getWorkouts(userId);
    const activeWorkouts = workouts.filter(w => w.isActive);
    
    // Build schedule for all 7 days
    const weekSchedule: WeeklyWorkout[] = [];
    
    for (let day = 0; day < 7; day++) {
      const workout = activeWorkouts.find(w => w.dayOfWeek === day);
      
      if (workout) {
        // Fetch exercises for this workout
        const exercises = await dataConnectStorage.getWorkoutExercises(workout.id);
        
        weekSchedule.push({
          dayOfWeek: day,
          dayName: DAY_NAMES[day],
          workout: {
            name: workout.name,
            type: workout.type,
            exercises: exercises.map(e => ({
              id: e.exerciseId,
              name: e.exerciseName,
              targetSets: e.targetSets,
              targetReps: e.targetReps,
            })),
          },
        });
      } else {
        weekSchedule.push({
          dayOfWeek: day,
          dayName: DAY_NAMES[day],
          workout: null, // Rest day
        });
      }
    }
    
    return weekSchedule;
  } catch (error) {
    console.error("[ai-context] Error fetching week schedule:", error);
    return [];
  }
}

/**
 * Build complete context for the AI Coach
 */
export async function buildCoachContext(userId: string): Promise<CoachContext> {
  // Fetch profile, streak, and recent workouts in parallel
  // Then fetch week schedule (which includes today's workout)
  const [profile, recentWorkouts, currentStreak, weekSchedule] = await Promise.all([
    getUserProfile(userId),
    getRecentWorkouts(userId),
    getCurrentStreak(userId),
    getWeekSchedule(userId),
  ]);
  
  // Extract today's workout from the week schedule
  const today = new Date().getDay();
  const todayFromSchedule = weekSchedule.find(w => w.dayOfWeek === today);
  const todayWorkout = todayFromSchedule?.workout || undefined;
  
  // Format user context string for the AI
  const userContext = formatUserContext({
    name: profile?.name,
    goal: profile?.goal,
    experience: profile?.experience,
    equipment: profile?.equipment,
    injuries: profile?.injuries,
    frequency: profile?.frequency,
    recentWorkouts,
    currentStreak,
    weekSchedule,
    todayWorkout: todayWorkout ? {
      name: todayWorkout.name,
      type: todayWorkout.type,
      exercises: todayWorkout.exercises.map(e => ({
        name: e.name,
        targetSets: e.targetSets,
        targetReps: e.targetReps,
      })),
    } : undefined,
  });
  
  return {
    userContext,
    profile: profile || {},
    todayWorkout,
    weekSchedule,
    recentWorkouts,
    currentStreak,
  };
}

/**
 * Get a specific workout by ID with exercises
 */
export async function getWorkoutWithExercises(workoutId: string): Promise<WorkoutContext | undefined> {
  try {
    const workout = await dataConnectStorage.getWorkout(workoutId);
    if (!workout) {
      return undefined;
    }
    
    const exercises = await dataConnectStorage.getWorkoutExercises(workoutId);
    
    return {
      name: workout.name,
      type: workout.type,
      exercises: exercises.map(e => ({
        id: e.exerciseId,
        name: e.exerciseName,
        targetSets: e.targetSets,
        targetReps: e.targetReps,
      })),
    };
  } catch (error) {
    console.error("[ai-context] Error fetching workout:", error);
    return undefined;
  }
}

/**
 * Get all workouts for a user (for schedule overview)
 */
export async function getUserWorkoutsSchedule(userId: string): Promise<Array<{
  id: string;
  name: string;
  type: string;
  dayOfWeek: number | null;
}>> {
  try {
    const workouts = await dataConnectStorage.getWorkouts(userId);
    return workouts
      .filter(w => w.isActive)
      .map(w => ({
        id: w.id,
        name: w.name,
        type: w.type,
        dayOfWeek: w.dayOfWeek,
      }));
  } catch (error) {
    console.error("[ai-context] Error fetching workouts schedule:", error);
    return [];
  }
}

