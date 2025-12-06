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
 * Fetch all workouts for a specific user
 * @param userId - Firebase user ID (required for cache isolation between users)
 */
export function useWorkouts(userId: string | null) {
  return useQuery({
    queryKey: ["workouts", userId],
    queryFn: fetchWorkouts,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single workout by ID
 * @param id - Workout ID
 * @param userId - Firebase user ID (required for cache isolation between users)
 */
export function useWorkout(id: string | null, userId: string | null) {
  return useQuery({
    queryKey: ["workout", userId, id],
    queryFn: () => fetchWorkout(id!),
    enabled: !!id && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new workout
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useCreateWorkout(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
      }
    },
  });
}

/**
 * Update a workout
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useUpdateWorkout(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWorkoutData> }) =>
      updateWorkout(id, data),
    onSuccess: (_, { id }) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
        queryClient.invalidateQueries({ queryKey: ["workout", userId, id] });
      }
    },
  });
}

/**
 * Delete a workout
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useDeleteWorkout(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
      }
    },
  });
}

/**
 * Add an exercise to a workout
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useAddExerciseToWorkout(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: AddExerciseData }) =>
      addExerciseToWorkout(workoutId, data),
    onSuccess: (_, { workoutId }) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
        queryClient.invalidateQueries({ queryKey: ["workout", userId, workoutId] });
      }
    },
  });
}

/**
 * Get today's workout based on day of week
 * @param userId - Firebase user ID (required for cache isolation between users)
 */
export function useTodayWorkout(userId: string | null) {
  const { data: workouts, isLoading } = useWorkouts(userId);
  
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
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useDeleteAllWorkouts(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAllWorkouts,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
      }
    },
  });
}

