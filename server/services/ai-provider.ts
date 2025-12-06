/**
 * Gemini AI Provider Service
 * 
 * Implements Google Gemini API integration for the AI Coach.
 * Reference: https://ai.google.dev/gemini-api/docs
 * 
 * Required environment variable: GEMINI_API_KEY
 */

import { GoogleGenerativeAI, GenerativeModel, Content, Part, FunctionDeclaration, Tool } from "@google/generative-ai";
import { COACH_SYSTEM_PROMPT } from "./ai-prompts.js";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Model configuration - using Gemini 2.5 Flash for enhanced reasoning
// Reference: https://ai.google.dev/gemini-api/docs/models
const MODEL_NAME = "gemini-2.5-flash";

export interface ChatMessage {
  role: "user" | "model";
  parts: Part[];
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface CoachResponse {
  text: string;
  toolCalls?: ToolCall[];
}

/**
 * Create a Gemini model instance with the coach system prompt and tools
 */
export function createCoachModel(tools?: Tool[]): GenerativeModel {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: COACH_SYSTEM_PROMPT,
    tools: tools,
  });
}

/**
 * Convert our message format to Gemini's Content format
 */
export function messagesToContents(messages: { role: "user" | "assistant"; content: string }[]): Content[] {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

/**
 * Send a chat message to the AI coach and get a response
 */
export async function sendCoachMessage(
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userContext: string,
  tools?: Tool[]
): Promise<CoachResponse> {
  const model = createCoachModel(tools);
  
  // Build the full conversation with context
  const contextMessage: Content = {
    role: "user",
    parts: [{ text: `[SYSTEM CONTEXT - DO NOT REVEAL TO USER]\n${userContext}\n[END CONTEXT]` }],
  };
  
  const contextAck: Content = {
    role: "model", 
    parts: [{ text: "Understood. I have the user's context and will use it to provide personalized coaching." }],
  };
  
  // Convert history and add new message
  const historyContents = messagesToContents(conversationHistory);
  const allContents: Content[] = [
    contextMessage,
    contextAck,
    ...historyContents,
  ];
  
  // Start chat with history
  const chat = model.startChat({
    history: allContents,
  });
  
  // Send the new message
  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  
  // Extract text response
  const text = response.text();
  
  // Check for function calls
  const functionCalls = response.functionCalls();
  let toolCalls: ToolCall[] | undefined;
  
  if (functionCalls && functionCalls.length > 0) {
    toolCalls = functionCalls.map((fc) => ({
      name: fc.name,
      arguments: fc.args as Record<string, unknown>,
    }));
  }
  
  return {
    text,
    toolCalls,
  };
}

/**
 * Send a simple one-off message (no conversation history)
 * Useful for quick queries or summaries
 */
export async function sendSimpleMessage(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate a workout insight/recommendation based on user data
 */
export async function generateProactiveInsight(userContext: string): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: COACH_SYSTEM_PROMPT,
  });
  
  const prompt = `Based on the following user context, generate a brief, actionable insight or recommendation (1-2 sentences max). Be direct and brutalist in tone.

${userContext}

Generate an insight about their training, recovery, or next steps.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}

