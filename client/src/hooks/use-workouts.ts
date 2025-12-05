import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIdToken } from "@/lib/firebase";

// ============================================================================
// AUTH HELPER
// ============================================================================

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

// ============================================================================
// TYPES
// ============================================================================

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  targetSets: number;
  targetReps: string;
  targetRpe: number | null;
  restSeconds: number | null;
  notes: string | null;
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  type: string;
  dayOfWeek: number | null;
  estimatedDurationMin: number | null;
  targetMuscles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exercises?: WorkoutExercise[];
}

export interface CreateWorkoutData {
  name: string;
  type: string;
  dayOfWeek?: number;
  estimatedDurationMin?: number;
  targetMuscles?: string[];
}

export interface AddExerciseData {
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  targetSets?: number;
  targetReps?: string;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function fetchWorkouts(): Promise<Workout[]> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/workouts", {
    headers,
    credentials: "include",
  });
  
  if (response.status === 401) {
    return [];
  }
  
  if (!response.ok) {
    throw new Error("Failed to fetch workouts");
  }
  
  const data = await response.json();
  return data.workouts;
}

async function fetchWorkout(id: string): Promise<Workout> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/workouts/${id}`, {
    headers,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch workout");
  }
  
  const data = await response.json();
  return data.workout;
}

async function createWorkout(data: CreateWorkoutData): Promise<Workout> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/workouts", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create workout");
  }
  
  const result = await response.json();
  return result.workout;
}

async function updateWorkout(id: string, data: Partial<CreateWorkoutData>): Promise<Workout> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/workouts/${id}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update workout");
  }
  
  const result = await response.json();
  return result.workout;
}

async function deleteWorkout(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/workouts/${id}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete workout");
  }
}

async function addExerciseToWorkout(workoutId: string, data: AddExerciseData): Promise<WorkoutExercise> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/workouts/${workoutId}/exercises`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add exercise");
  }
  
  const result = await response.json();
  return result.exercise;
}

async function deleteAllWorkouts(): Promise<{ message: string; deletedCount: number }> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/workouts/all", {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete workouts");
  }
  
  return response.json();
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Fetch all workouts for the current user
 */
export function useWorkouts() {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single workout by ID
 */
export function useWorkout(id: string | null) {
  return useQuery({
    queryKey: ["workout", id],
    queryFn: () => fetchWorkout(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new workout
 */
export function useCreateWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

/**
 * Update a workout
 */
export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWorkoutData> }) =>
      updateWorkout(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workout", id] });
    },
  });
}

/**
 * Delete a workout
 */
export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

/**
 * Add an exercise to a workout
 */
export function useAddExerciseToWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: AddExerciseData }) =>
      addExerciseToWorkout(workoutId, data),
    onSuccess: (_, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
    },
  });
}

/**
 * Get today's workout based on day of week
 */
export function useTodayWorkout() {
  const { data: workouts, isLoading } = useWorkouts();
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayWorkout = workouts?.find(w => w.dayOfWeek === today && w.isActive);
  
  return {
    workout: todayWorkout,
    isLoading,
    hasWorkout: !!todayWorkout,
  };
}

/**
 * Delete all workouts and reset onboarding status
 * Used for "Reset Training Plan" feature
 */
export function useDeleteAllWorkouts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAllWorkouts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

