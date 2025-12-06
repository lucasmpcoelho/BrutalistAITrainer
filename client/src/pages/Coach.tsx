import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sliders, 
  HelpCircle, 
  RefreshCw, 
  TrendingUp,
  MessageSquare,
  ChevronLeft,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useHaptics } from "@/hooks/use-haptics";
import { useSendMessage, useProactiveInsight, type ChatMessage, type ToolCall } from "@/hooks/use-coach";

// Quick action definitions
const QUICK_ACTIONS = [
  { id: "adjust", label: "Adjust Today", icon: Sliders, description: "Modify today's workout" },
  { id: "explain", label: "Explain Plan", icon: HelpCircle, description: "Understand your program" },
  { id: "swap", label: "Swap Exercise", icon: RefreshCw, description: "Replace an exercise" },
  { id: "progress", label: "My Progress", icon: TrendingUp, description: "Review your gains" },
  { id: "question", label: "Ask Question", icon: MessageSquare, description: "Get coaching advice" },
  { id: "why", label: "Why This?", icon: Sparkles, description: "Understand today's protocol" },
];

// Map quick actions to prompts
const QUICK_ACTION_PROMPTS: Record<string, string> = {
  adjust: "I want to adjust today's workout. What are my options?",
  explain: "Explain my current training plan and why it's structured this way.",
  swap: "I need to swap an exercise in today's workout. What alternatives do you recommend?",
  progress: "Show me my progress and how I'm doing with my training.",
  question: "I have a question about my training.",
  why: "Why is this specific workout programmed for today? Explain the reasoning.",
};

type LocalMessage = {
  id: number;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  toolCalls?: ToolCall[];
  isError?: boolean;
};

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start animate-in fade-in duration-200">
      <div className="bg-gray-100 border border-gray-200 p-4 max-w-[80%] rounded-2xl rounded-tl-none">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default function Coach() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [insightDismissed, setInsightDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { vibrate } = useHaptics();

  // API hooks
  const sendMessage = useSendMessage();
  const { data: insightData, isLoading: insightLoading, error: insightError } = useProactiveInsight();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    vibrate("light");

    // Add user message immediately
    const userMessage: LocalMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await sendMessage.mutateAsync({
        message: text,
        conversationId,
      });

      // Update conversation ID if we got one
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      // Add AI response
      const aiMessage: LocalMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: "ai",
        timestamp: new Date(),
        toolCalls: response.toolCalls,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: LocalMessage = {
        id: Date.now() + 1,
        text: error instanceof Error 
          ? error.message 
          : "Failed to get a response. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleQuickAction = (actionId: string) => {
    vibrate("light");
    const prompt = QUICK_ACTION_PROMPTS[actionId] || "Help me with my training.";
    setIsExpanded(true);
    
    // Small delay to ensure UI expands before sending
    setTimeout(() => {
      handleSendMessage(prompt);
    }, 100);
  };

  const handleInsightAction = async (action: string) => {
    vibrate("medium");
    setInsightDismissed(true);
    
    if (action === "Yes, Adjust" && insightData?.insight) {
      setIsExpanded(true);
      setTimeout(() => {
        handleSendMessage(`Based on your insight about my recovery, please adjust my workout for today.`);
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sendMessage.isPending) return;
    handleSendMessage(inputValue);
  };

  // Expanded chat view
  if (isExpanded) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat header */}
        <header className="bg-black text-white p-4 flex items-center gap-3 sticky top-0 z-50 border-b-2 border-white">
          <button 
            onClick={() => {
              vibrate("light");
              setIsExpanded(false);
            }}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 touch-manipulation -ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-accent flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-xl tracking-tighter">IRON_AI COACH</div>
            <div className="text-xs text-gray-400">
              {sendMessage.isPending ? "Thinking..." : "Always online"}
            </div>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[calc(5rem+env(safe-area-inset-bottom)+4rem)]">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Start a conversation with your AI coach</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className={`max-w-[80%] p-4 border rounded-2xl ${
                msg.sender === "ai" 
                  ? msg.isError
                    ? "border-red-200 bg-red-50 text-red-800 rounded-tl-none"
                    : "border-gray-200 bg-gray-50 text-gray-800 rounded-tl-none" 
                  : "border-black bg-black text-white rounded-tr-none"
              }`}>
                {msg.isError && (
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Error</span>
                  </div>
                )}
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                
                {/* Show tool calls if any */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">
                      Actions Taken
                    </div>
                    {msg.toolCalls.map((tc, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        {tc.result?.message || tc.name}
                      </div>
                    ))}
                  </div>
                )}
                
                <span className={`text-[10px] opacity-50 mt-2 block ${msg.sender === "user" ? "text-gray-400" : "text-gray-500"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {sendMessage.isPending && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div 
          className="fixed inset-x-0 bg-white border-t border-gray-200 p-4"
          style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your coach..."
              disabled={sendMessage.isPending}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm 
                focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || sendMessage.isPending}
              className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center 
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-800 transition-colors touch-manipulation shadow-sm"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Hub view (default)
  return (
    <div className="min-h-screen bg-background flex flex-col pb-40">
      <AppHeader title="COACH" />

      <main className="flex-1 p-4 space-y-6">
        
        {/* Proactive AI Insight Card */}
        {!insightDismissed && (
          <div className="border border-gray-200 bg-white p-5 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                {insightLoading ? (
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                ) : (
                  <Bot className="w-6 h-6 text-black" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                  IRON_AI INSIGHT
                </div>
                {insightLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : insightError ? (
                  <p className="text-sm text-gray-500 italic">
                    Unable to generate insight at this time. Start a conversation to get personalized coaching.
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-gray-700">
                    {insightData?.insight || "Ready to help you train smarter. Tap a quick action or ask me anything."}
                  </p>
                )}
              </div>
            </div>
            
            {!insightLoading && !insightError && insightData?.insight && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleInsightAction("Yes, Adjust")}
                  className="flex-1 py-3 font-mono text-xs font-bold uppercase tracking-wider 
                    bg-black text-white border border-black rounded-lg touch-manipulation 
                    transition-colors hover:bg-gray-900"
                >
                  Apply Suggestion
                </button>
                <button
                  onClick={() => setInsightDismissed(true)}
                  className="flex-1 py-3 font-mono text-xs font-bold uppercase tracking-wider 
                    bg-white text-gray-700 border border-gray-200 rounded-lg touch-manipulation 
                    transition-colors hover:bg-gray-50"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-0.5 flex-1 bg-black" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Quick Actions
            </span>
            <div className="h-0.5 flex-1 bg-black" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex flex-col items-center justify-center p-4 min-h-[100px]
                    border border-gray-200 bg-white rounded-xl shadow-sm
                    hover:border-gray-300 hover:bg-gray-50
                    transition-all touch-manipulation group active:scale-[0.98]"
                >
                  <Icon className="w-6 h-6 mb-2 text-gray-700 group-hover:text-black transition-colors" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-600 group-hover:text-black">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent conversation teaser */}
        {messages.length > 0 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full border border-gray-200 bg-gray-50 p-4 text-left rounded-xl
              hover:bg-gray-100 transition-colors touch-manipulation"
          >
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">
              Recent Conversation
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {messages[messages.length - 1]?.text}
            </p>
            <span className="text-xs text-black font-bold mt-2 block flex items-center gap-1">
              Tap to continue <span className="text-lg">→</span>
            </span>
          </button>
        )}
      </main>

      {/* Persistent chat input (collapsed) */}
      <div 
        className="fixed inset-x-0 bg-white border-t border-gray-200 p-4"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => {
            vibrate("light");
            setIsExpanded(true);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl
            bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-colors touch-manipulation"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-mono text-sm">Ask your coach anything...</span>
        </button>
      </div>
    </div>
  );
}
