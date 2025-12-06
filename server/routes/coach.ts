/**
 * AI Coach API Routes
 * 
 * Handles chat interactions with the AI Coach using Google Gemini.
 */

import { Router, Request, Response } from "express";
import { verifyFirebaseToken } from "../middleware/firebase-auth.js";
import { sendCoachMessage, generateProactiveInsight } from "../services/ai-provider.js";
import { buildCoachContext } from "../services/ai-context.js";
import { COACH_TOOLS, executeTool } from "../services/ai-tools.js";
import { db } from "../config/firebase.js";

const router = Router();

// All coach routes require authentication
router.use(verifyFirebaseToken);

// Types for conversation storage
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, unknown>;
    result?: unknown;
  }>;
  createdAt: Date;
}

interface Conversation {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * POST /api/coach/chat
 * Send a message to the AI Coach and get a response
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { message, conversationId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ 
        error: "AI service not configured",
        message: "The AI Coach is not available. Please configure GEMINI_API_KEY.",
      });
    }

    // Build context from user's data
    const context = await buildCoachContext(userId);

    // Get or create conversation
    let conversation: Conversation | null = null;
    let conversationHistory: { role: "user" | "assistant"; content: string }[] = [];

    if (conversationId && db) {
      // Load existing conversation
      const convDoc = await db.collection("conversations").doc(conversationId).get();
      if (convDoc.exists) {
        const data = convDoc.data();
        conversation = {
          id: convDoc.id,
          userId: data?.userId,
          messages: data?.messages || [],
          status: data?.status || "active",
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate() || new Date(),
        };
        
        // Extract history for AI context
        conversationHistory = conversation.messages.map(m => ({
          role: m.role,
          content: m.content,
        }));
      }
    }

    // Send message to AI
    const aiResponse = await sendCoachMessage(
      message,
      conversationHistory,
      context.userContext,
      [COACH_TOOLS]
    );

    // Execute any tool calls
    let finalResponse = aiResponse.text;
    const executedTools: Array<{
      name: string;
      arguments: Record<string, unknown>;
      result: unknown;
    }> = [];

    if (aiResponse.toolCalls && aiResponse.toolCalls.length > 0) {
      for (const toolCall of aiResponse.toolCalls) {
        const result = await executeTool(toolCall.name, toolCall.arguments, userId);
        executedTools.push({
          name: toolCall.name,
          arguments: toolCall.arguments,
          result,
        });

        // Append tool result context to response if needed
        if (result.success && result.message) {
          // The AI should incorporate tool results into its response
          // For now, we'll append a note about what was done
          if (!finalResponse.includes(result.message)) {
            finalResponse += `\n\n[Action completed: ${result.message}]`;
          }
        }
      }
    }

    // Save conversation to Firestore
    let activeConversationId = conversation?.id;
    
    if (db) {
      const now = new Date();
      const userMessage: ConversationMessage = {
        role: "user",
        content: message,
        createdAt: now,
      };
      // Only include toolCalls if there are any (Firestore doesn't allow undefined)
      const assistantMessage: ConversationMessage = {
        role: "assistant",
        content: finalResponse,
        createdAt: now,
        ...(executedTools.length > 0 && { toolCalls: executedTools }),
      };

      if (conversation) {
        // Update existing conversation
        await db.collection("conversations").doc(conversation.id).update({
          messages: [...conversation.messages, userMessage, assistantMessage],
          updatedAt: now,
        });
      } else {
        // Create new conversation and capture its ID
        const newConv = await db.collection("conversations").add({
          userId,
          messages: [userMessage, assistantMessage],
          status: "active",
          createdAt: now,
          updatedAt: now,
        });
        activeConversationId = newConv.id;
      }
    }

    res.json({
      message: finalResponse,
      ...(executedTools.length > 0 && { toolCalls: executedTools }),
      conversationId: activeConversationId,
      context: {
        todayWorkout: context.todayWorkout,
        currentStreak: context.currentStreak,
      },
    });
  } catch (error) {
    console.error("[coach] Chat error:", error);
    
    // Check for specific Gemini errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("API key")) {
      return res.status(503).json({
        error: "AI service configuration error",
        message: "There's an issue with the AI service configuration.",
      });
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      return res.status(429).json({
        error: "Rate limited",
        message: "Too many requests. Please try again in a moment.",
      });
    }
    
    res.status(500).json({ 
      error: "Failed to process message",
      message: "The AI Coach encountered an error. Please try again.",
    });
  }
});

/**
 * GET /api/coach/insight
 * Get a proactive insight based on user's current state
 */
router.get("/insight", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ 
        error: "AI service not configured",
        message: "Proactive insights are not available.",
      });
    }

    // Build context
    const context = await buildCoachContext(userId);

    // Generate insight
    const insight = await generateProactiveInsight(context.userContext);

    res.json({
      insight,
      context: {
        currentStreak: context.currentStreak,
        todayWorkout: context.todayWorkout ? {
          name: context.todayWorkout.name,
          type: context.todayWorkout.type,
          exerciseCount: context.todayWorkout.exercises.length,
        } : null,
      },
    });
  } catch (error) {
    console.error("[coach] Insight error:", error);
    res.status(500).json({ 
      error: "Failed to generate insight",
      message: "Could not generate a proactive insight at this time.",
    });
  }
});

/**
 * GET /api/coach/history
 * Get conversation history for the user
 */
router.get("/history", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { limit = "10" } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50);

    if (!db) {
      return res.json({ conversations: [] });
    }

    const snapshot = await db.collection("conversations")
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .orderBy("updatedAt", "desc")
      .limit(limitNum)
      .get();

    const conversations = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        messageCount: data.messages?.length || 0,
        lastMessage: data.messages?.length > 0 
          ? data.messages[data.messages.length - 1].content.substring(0, 100)
          : null,
        createdAt: data.createdAt?.toDate()?.toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString(),
      };
    });

    res.json({ conversations });
  } catch (error) {
    console.error("[coach] History error:", error);
    res.status(500).json({ 
      error: "Failed to fetch history",
      conversations: [],
    });
  }
});

/**
 * GET /api/coach/conversation/:id
 * Get a specific conversation with full messages
 */
router.get("/conversation/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { id } = req.params;

    if (!db) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const doc = await db.collection("conversations").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const data = doc.data();
    
    if (!data) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    // Verify ownership
    if (data.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      id: doc.id,
      messages: (data.messages || []).map((m: ConversationMessage) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
      status: data.status,
      createdAt: data.createdAt?.toDate()?.toISOString(),
      updatedAt: data.updatedAt?.toDate()?.toISOString(),
    });
  } catch (error) {
    console.error("[coach] Get conversation error:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

/**
 * DELETE /api/coach/conversation/:id
 * Archive a conversation (soft delete)
 */
router.delete("/conversation/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { id } = req.params;

    if (!db) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const doc = await db.collection("conversations").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const data = doc.data();
    
    // Verify ownership
    if (data?.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Soft delete by archiving
    await db.collection("conversations").doc(id).update({
      status: "archived",
      updatedAt: new Date(),
    });

    res.json({ success: true, message: "Conversation archived" });
  } catch (error) {
    console.error("[coach] Delete conversation error:", error);
    res.status(500).json({ error: "Failed to archive conversation" });
  }
});

export default router;

