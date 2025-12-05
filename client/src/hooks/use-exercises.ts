/**
 * useExercises Hook
 * 
 * Fetches a list of exercises from the API with optional filtering.
 */

import { useQuery } from "@tanstack/react-query";
import { Exercise } from "./use-exercise";

interface ExercisesResponse {
  exercises: Exercise[];
  count: number;
  offset: number;
  limit: number;
}

interface UseExercisesFilters {
  search?: string;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  limit?: number;
  offset?: number;
}

interface UseExercisesOptions {
  enabled?: boolean;
}

/**
 * Build query string from filters
 */
function buildQueryString(filters: UseExercisesFilters): string {
  const params = new URLSearchParams();
  
  if (filters.search) params.set("search", filters.search);
  if (filters.bodyPart) params.set("bodyPart", filters.bodyPart);
  if (filters.target) params.set("target", filters.target);
  if (filters.equipment) params.set("equipment", filters.equipment);
  if (filters.limit) params.set("limit", filters.limit.toString());
  if (filters.offset) params.set("offset", filters.offset.toString());
  
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetch a list of exercises with optional filters
 */
export function useExercises(
  filters: UseExercisesFilters = {},
  options: UseExercisesOptions = {}
) {
  const { enabled = true } = options;
  const queryString = buildQueryString(filters);

  return useQuery<ExercisesResponse>({
    queryKey: ["/api/exercises", filters],
    queryFn: async () => {
      const res = await fetch(`/api/exercises${queryString}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch exercises: ${res.statusText}`);
      }
      return res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch exercises by body part
 */
export function useExercisesByBodyPart(
  bodyPart: string | null,
  options: UseExercisesOptions & { limit?: number; offset?: number } = {}
) {
  const { enabled = true, limit = 50, offset = 0 } = options;

  return useQuery<ExercisesResponse & { bodyPart: string }>({
    queryKey: ["/api/exercises/by-body-part", bodyPart, { limit, offset }],
    queryFn: async () => {
      if (!bodyPart) throw new Error("Body part is required");
      
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      params.set("offset", offset.toString());
      
      const res = await fetch(`/api/exercises/by-body-part/${encodeURIComponent(bodyPart)}?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch exercises: ${res.statusText}`);
      }
      return res.json();
    },
    enabled: enabled && !!bodyPart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch exercises by target muscle
 */
export function useExercisesByTarget(
  target: string | null,
  options: UseExercisesOptions & { limit?: number; offset?: number } = {}
) {
  const { enabled = true, limit = 50, offset = 0 } = options;

  return useQuery<ExercisesResponse & { target: string }>({
    queryKey: ["/api/exercises/by-target", target, { limit, offset }],
    queryFn: async () => {
      if (!target) throw new Error("Target muscle is required");
      
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      params.set("offset", offset.toString());
      
      const res = await fetch(`/api/exercises/by-target/${encodeURIComponent(target)}?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch exercises: ${res.statusText}`);
      }
      return res.json();
    },
    enabled: enabled && !!target,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export default useExercises;




