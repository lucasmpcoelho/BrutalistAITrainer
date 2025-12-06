/**
 * Coach Hook
 * 
 * Provides interface to the AI Coach API for chat interactions,
 * proactive insights, and conversation history.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================================
// TYPES
// ============================================================================

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?: Date | string;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
  result?: {
    success: boolean;
    message: string;
    data?: unknown;
  };
}

export interface ChatResponse {
  message: string;
  toolCalls?: ToolCall[];
  conversationId?: string;
  context?: {
    todayWorkout?: {
      name: string;
      type: string;
      exerciseCount: number;
    };
    currentStreak?: number;
  };
}

export interface ProactiveInsight {
  insight: string;
  context?: {
    currentStreak: number;
    todayWorkout: {
      name: string;
      type: string;
      exerciseCount: number;
    } | null;
  };
}

export interface ConversationSummary {
  id: string;
  messageCount: number;
  lastMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FullConversation {
  id: string;
  messages: ChatMessage[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

// Note: getAuthHeaders is not used - token is passed directly to API functions

async function sendChatMessage(
  message: string,
  conversationId?: string,
  token?: string
): Promise<ChatResponse> {
  const response = await fetch("/api/coach/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send message");
  }

  return response.json();
}

async function fetchProactiveInsight(token?: string): Promise<ProactiveInsight> {
  const response = await fetch("/api/coach/insight", {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch insight");
  }

  return response.json();
}

async function fetchConversationHistory(
  limit: number = 10,
  token?: string
): Promise<{ conversations: ConversationSummary[] }> {
  const response = await fetch(`/api/coach/history?limit=${limit}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    return { conversations: [] };
  }

  return response.json();
}

async function fetchConversation(
  id: string,
  token?: string
): Promise<FullConversation> {
  const response = await fetch(`/api/coach/conversation/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch conversation");
  }

  return response.json();
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for sending chat messages to the AI Coach
 */
export function useSendMessage() {
  const { firebaseUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      conversationId,
    }: {
      message: string;
      conversationId?: string;
    }) => {
      const token = await firebaseUser?.getIdToken();
      return sendChatMessage(message, conversationId, token);
    },
    onSuccess: () => {
      // Invalidate conversation history to refresh
      queryClient.invalidateQueries({ queryKey: ["coach", "history"] });
    },
  });
}

/**
 * Hook for fetching a proactive AI insight
 */
export function useProactiveInsight() {
  const { firebaseUser, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coach", "insight"],
    queryFn: async () => {
      const token = await firebaseUser?.getIdToken();
      return fetchProactiveInsight(token);
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - insights don't change frequently
    retry: 1, // Only retry once on failure
  });
}

/**
 * Hook for fetching conversation history
 */
export function useConversationHistory(limit: number = 10) {
  const { firebaseUser, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coach", "history", limit],
    queryFn: async () => {
      const token = await firebaseUser?.getIdToken();
      return fetchConversationHistory(limit, token);
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for fetching a specific conversation
 */
export function useConversation(id: string | null) {
  const { firebaseUser, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["coach", "conversation", id],
    queryFn: async () => {
      if (!id) throw new Error("No conversation ID");
      const token = await firebaseUser?.getIdToken();
      return fetchConversation(id, token);
    },
    enabled: isAuthenticated && !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

