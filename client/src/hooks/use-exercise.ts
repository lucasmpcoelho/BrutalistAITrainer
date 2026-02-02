/**
 * useExercise Hook
 * 
 * Fetches a single exercise from the API by ID.
 */

import { useQuery } from "@tanstack/react-query";

export interface Exercise {
  id: string;
  name: string;
  equipment: string;
  bodyPart: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  gifUrl: string;
  source: string;
  // Optional fields from free-exercise-db
  category?: string;
  level?: "beginner" | "intermediate" | "expert";
  force?: "push" | "pull" | "static" | null;
  mechanic?: "compound" | "isolation" | null;
  /** Key form cue to show during workout (falls back to instructions[0]) */
  keyCue?: string;
}

interface UseExerciseOptions {
  enabled?: boolean;
}

/**
 * Fetch a single exercise by ID
 */
export function useExercise(id: string | null, options: UseExerciseOptions = {}) {
  const { enabled = true } = options;

  return useQuery<Exercise>({
    queryKey: ["/api/exercises", id],
    queryFn: async () => {
      if (!id) throw new Error("Exercise ID is required");
      
      const res = await fetch(`/api/exercises/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch exercise: ${res.statusText}`);
      }
      return res.json();
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 60, // 1 hour (exercise data rarely changes)
  });
}

/**
 * Fetch alternative exercises for a given exercise ID
 */
export function useExerciseAlternatives(
  exerciseId: string | null,
  options: UseExerciseOptions = {}
) {
  const { enabled = true } = options;

  return useQuery<{
    exerciseId: string;
    target: string;
    alternatives: Exercise[];
    count: number;
  }>({
    queryKey: ["/api/exercises", exerciseId, "alternatives"],
    queryFn: async () => {
      if (!exerciseId) throw new Error("Exercise ID is required");
      
      const res = await fetch(`/api/exercises/${exerciseId}/alternatives`);
      if (!res.ok) {
        throw new Error(`Failed to fetch alternatives: ${res.statusText}`);
      }
      return res.json();
    },
    enabled: enabled && !!exerciseId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useExercise;


