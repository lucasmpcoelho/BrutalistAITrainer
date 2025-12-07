import { useState, useEffect } from "react";
import type { ToolCall } from "./use-coach";

export type LocalMessage = {
    id: number;
    text: string;
    sender: "ai" | "user";
    timestamp: Date; // Note: LocalStorage stores dates as strings, we parse them back
    toolCalls?: ToolCall[];
    isError?: boolean;
};

const STORAGE_KEY = "iron_ai_chat_history";
const MAX_MESSAGES = 50;

export function usePersistentChat() {
    // Initialize state function to avoid reading localStorage on every render
    const [messages, setMessages] = useState<LocalMessage[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Revive Date objects
                return parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                }));
            }
        } catch (error) {
            console.error("Failed to load chat history:", error);
        }
        return [];
    });

    // Sync to localStorage whenever messages change
    useEffect(() => {
        try {
            // Keep only last N messages to prevent storage bloat
            const toStore = messages.slice(-MAX_MESSAGES);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } catch (error) {
            console.error("Failed to save chat history:", error);
        }
    }, [messages]);

    const addMessage = (message: LocalMessage) => {
        setMessages((prev) => [...prev, message]);
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        messages,
        setMessages, // Exposed in case direct manipulation is needed (compatible with useState API)
        addMessage,
        clearChat,
    };
}
