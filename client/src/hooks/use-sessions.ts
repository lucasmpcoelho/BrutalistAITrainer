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

export interface LoggedSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number | null;
  isWarmup: boolean;
  isPR: boolean;
  notes: string | null;
  completedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  workoutId: string | null;
  workoutName: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  totalVolume: number | null;
  exerciseCount: number | null;
  setCount: number | null;
  notes: string | null;
  sets?: LoggedSet[];
}

export interface CreateSessionData {
  workoutId?: string;
  workoutName: string;
}

export interface LogSetData {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  isWarmup?: boolean;
  notes?: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function fetchSessions(limit = 50): Promise<Session[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/sessions?limit=${limit}`, {
    headers,
    credentials: "include",
  });
  
  if (response.status === 401) {
    return [];
  }
  
  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }
  
  const data = await response.json();
  return data.sessions;
}

async function fetchSession(id: string): Promise<Session> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/sessions/${id}`, {
    headers,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch session");
  }
  
  const data = await response.json();
  return data.session;
}

async function createSession(data: CreateSessionData): Promise<Session> {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to start session");
  }
  
  const result = await response.json();
  return result.session;
}

async function completeSession(id: string, notes?: string): Promise<Session> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/sessions/${id}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ status: "completed", notes }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to complete session");
  }
  
  const result = await response.json();
  return result.session;
}

async function abandonSession(id: string): Promise<Session> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/sessions/${id}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ status: "abandoned" }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to abandon session");
  }
  
  const result = await response.json();
  return result.session;
}

async function logSet(sessionId: string, data: LogSetData): Promise<{ set: LoggedSet; isPR: boolean }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/sessions/${sessionId}/sets`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to log set");
  }
  
  return response.json();
}

async function fetchSessionSets(sessionId: string): Promise<LoggedSet[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/sessions/${sessionId}/sets`, {
    headers,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch sets");
  }
  
  const data = await response.json();
  return data.sets;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Fetch workout sessions
 * @param userId - Firebase user ID (required for cache isolation between users)
 * @param limit - Maximum number of sessions to fetch
 */
export function useSessions(userId: string | null, limit = 50) {
  return useQuery({
    queryKey: ["sessions", userId, limit],
    queryFn: () => fetchSessions(limit),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch a single session with sets
 * @param id - Session ID
 * @param userId - Firebase user ID (required for cache isolation between users)
 */
export function useSession(id: string | null, userId: string | null) {
  return useQuery({
    queryKey: ["session", userId, id],
    queryFn: () => fetchSession(id!),
    enabled: !!id && !!userId,
  });
}

/**
 * Start a new workout session
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useStartSession(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["sessions", userId] });
      }
    },
  });
}

/**
 * Complete a workout session
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useCompleteSession(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      completeSession(id, notes),
    onSuccess: (_, { id }) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["sessions", userId] });
        queryClient.invalidateQueries({ queryKey: ["session", userId, id] });
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }); // Refresh streak
    },
  });
}

/**
 * Abandon a workout session
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useAbandonSession(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: abandonSession,
    onSuccess: (_, id) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["sessions", userId] });
        queryClient.invalidateQueries({ queryKey: ["session", userId, id] });
      }
    },
  });
}

/**
 * Log a set in a session
 * @param userId - Firebase user ID (for cache invalidation)
 */
export function useLogSet(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: LogSetData }) =>
      logSet(sessionId, data),
    onSuccess: (_, { sessionId }) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["session", userId, sessionId] });
      }
    },
  });
}

/**
 * Fetch sets for a session
 * @param sessionId - Session ID
 * @param userId - Firebase user ID (required for cache isolation between users)
 */
export function useSessionSets(sessionId: string | null, userId: string | null) {
  return useQuery({
    queryKey: ["sessionSets", userId, sessionId],
    queryFn: () => fetchSessionSets(sessionId!),
    enabled: !!sessionId && !!userId,
  });
}

/**
 * Get the most recent in-progress session
 * @param userId - Firebase user ID (required for cache isolation between users)
 */
export function useActiveSession(userId: string | null) {
  const { data: sessions, isLoading } = useSessions(userId, 10);
  
  const activeSession = sessions?.find(s => s.status === "in_progress");
  
  return {
    session: activeSession,
    isLoading,
    hasActiveSession: !!activeSession,
  };
}

