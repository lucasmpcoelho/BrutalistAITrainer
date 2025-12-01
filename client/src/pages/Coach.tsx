import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sliders, 
  HelpCircle, 
  RefreshCw, 
  TrendingUp,
  Dumbbell,
  MessageSquare,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useHaptics } from "@/hooks/use-haptics";

// Quick action definitions
const QUICK_ACTIONS = [
  { id: "adjust", label: "Adjust Today", icon: Sliders, description: "Modify today's workout" },
  { id: "explain", label: "Explain Plan", icon: HelpCircle, description: "Understand your program" },
  { id: "swap", label: "Swap Exercise", icon: RefreshCw, description: "Replace an exercise" },
  { id: "progress", label: "My Progress", icon: TrendingUp, description: "Review your gains" },
  { id: "question", label: "Ask Question", icon: MessageSquare, description: "Get coaching advice" },
  { id: "why", label: "Why This?", icon: Sparkles, description: "Understand today's protocol" },
];

// Mock proactive insight
const PROACTIVE_INSIGHT = {
  message: "Your HRV is down 12% from baseline. I recommend reducing volume today by 1-2 sets per exercise. Want me to adjust your protocol?",
  actions: ["Yes, Adjust", "No, I Got This"],
};

type Message = {
  id: number;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
};

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start animate-in fade-in duration-200">
      <div className="bg-gray-100 border-2 border-black p-4 max-w-[80%]">
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [insightDismissed, setInsightDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { vibrate } = useHaptics();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleQuickAction = (actionId: string) => {
    vibrate("light");
    
    // Map action to a user message
    const actionMessages: Record<string, string> = {
      adjust: "I want to adjust today's workout",
      explain: "Explain my current training plan",
      swap: "I need to swap an exercise",
      progress: "Show me my progress",
      question: "I have a question",
      why: "Why is this workout programmed for today?",
    };

    const userMessage = actionMessages[actionId] || "Help me";
    
    // Add user message and expand to chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
    }]);
    
    setIsExpanded(true);
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: getAIResponse(actionId),
        sender: "ai",
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  const getAIResponse = (actionId: string): string => {
    const responses: Record<string, string> = {
      adjust: "I can adjust your workout. What would you like to change? You can:\n\n• Reduce volume (fewer sets)\n• Lower intensity (lighter weights)\n• Shorten the session\n• Skip specific exercises",
      explain: "Your current program is a 4-day Upper/Lower split focused on hypertrophy. We're in Week 3 of a 6-week mesocycle, which means intensity is ramping up while volume stays moderate. This builds toward a deload in Week 7.",
      swap: "Which exercise do you want to swap? Tell me the exercise name and I'll suggest alternatives that target the same muscle groups.",
      progress: "Over the past 4 weeks:\n\n• Bench Press: +5kg (75kg → 80kg)\n• Squat: +7.5kg (100kg → 107.5kg)\n• Total Volume: +12%\n\nYou're progressing well. Keep pushing!",
      question: "I'm here to help. What would you like to know about your training, nutrition, or recovery?",
      why: "Today is LEGS DAY because:\n\n1. It's been 72 hours since your last lower body session (optimal recovery)\n2. Your HRV indicates good readiness\n3. This maintains your 2x/week leg frequency for growth",
    };
    return responses[actionId] || "I'm here to help. What would you like to know?";
  };

  const handleInsightAction = (action: string) => {
    vibrate("medium");
    setInsightDismissed(true);
    
    if (action === "Yes, Adjust") {
      setMessages([{
        id: Date.now(),
        text: "Yes, please adjust my workout for today",
        sender: "user",
        timestamp: new Date(),
      }]);
      setIsExpanded(true);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Done! I've reduced each exercise by 1 set and lowered the target RPE by 1. Your workout will still be effective but won't overtax your recovery. You'll thank me tomorrow. 💪",
          sender: "ai",
          timestamp: new Date(),
        }]);
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    vibrate("light");
    
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "That's a great question. Based on your training history and goals, I'd recommend focusing on progressive overload while maintaining proper form. Would you like me to elaborate on any specific aspect?",
        sender: "ai",
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  // Expanded chat view
  if (isExpanded) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat header */}
        <header className="bg-black text-white p-4 flex items-center gap-4 sticky top-0 z-50 safe-area-top border-b-2 border-white">
          <button 
            onClick={() => {
              vibrate("light");
              setIsExpanded(false);
            }}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 touch-manipulation"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="font-display font-bold">IRON_AI COACH</div>
              <div className="text-xs text-gray-400">Always online</div>
            </div>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className={`max-w-[80%] p-4 border-2 ${
                msg.sender === "ai" 
                  ? "border-black bg-gray-100 text-black" 
                  : "border-black bg-black text-white"
              }`}>
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                <span className="text-[10px] opacity-50 mt-2 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="fixed bottom-16 inset-x-0 bg-white border-t-2 border-black p-4 safe-area-bottom">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your coach..."
              className="flex-1 px-4 py-3 border-2 border-black font-mono text-sm 
                focus:outline-none focus:border-accent bg-transparent"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-black text-white flex items-center justify-center 
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-accent hover:text-black transition-colors touch-manipulation"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Hub view (default)
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <AppHeader title="COACH" />

      <main className="flex-1 p-4 space-y-6">
        
        {/* Proactive AI Insight Card */}
        {!insightDismissed && (
          <div className="border-2 border-black bg-white p-5 brutal-shadow animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                  IRON_AI INSIGHT
                </div>
                <p className="text-sm leading-relaxed">
                  {PROACTIVE_INSIGHT.message}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {PROACTIVE_INSIGHT.actions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleInsightAction(action)}
                  className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-wider 
                    border-2 border-black touch-manipulation transition-colors ${
                    action.includes("Yes") 
                      ? "bg-black text-white hover:bg-accent hover:text-black" 
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
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
                    border-2 border-black bg-white hover:bg-black hover:text-white
                    transition-colors touch-manipulation group"
                >
                  <Icon className="w-6 h-6 mb-2 group-hover:text-accent transition-colors" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
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
            className="w-full border-2 border-gray-300 bg-gray-50 p-4 text-left 
              hover:border-black transition-colors touch-manipulation"
          >
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">
              Recent Conversation
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {messages[messages.length - 1]?.text}
            </p>
            <span className="text-xs text-accent font-bold mt-2 block">
              Tap to continue →
            </span>
          </button>
        )}
      </main>

      {/* Persistent chat input (collapsed) */}
      <div className="fixed bottom-16 inset-x-0 bg-white border-t-2 border-black p-4">
        <button
          onClick={() => {
            vibrate("light");
            setIsExpanded(true);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 
            text-gray-500 hover:border-black hover:text-black transition-colors touch-manipulation"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-mono text-sm">Ask your coach anything...</span>
        </button>
      </div>
    </div>
  );
}


