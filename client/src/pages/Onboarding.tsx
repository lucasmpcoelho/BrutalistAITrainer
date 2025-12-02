import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Terminal, ChevronLeft } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

// Question configuration for all 9 onboarding steps
const ONBOARDING_QUESTIONS = [
  {
    id: "mission",
    prompt: "What is your primary directive?",
    systemPrefix: "INITIALIZING NEURAL LINK...\nBIOMETRIC SCAN: NEGATIVE.\n\n",
    type: "options" as const,
    options: [
      { id: "hypertrophy", label: "Build Muscle" },
      { id: "strength", label: "Get Stronger" },
      { id: "fat_loss", label: "Burn Fat" },
      { id: "general", label: "General Fitness" },
    ],
  },
  {
    id: "height",
    prompt: "What's your height?",
    systemPrefix: "BIOMETRIC PROFILE INITIALIZING...\n\n",
    type: "hybrid" as const,
    unit: "cm",
    validRange: { min: 100, max: 250 },
    options: [
      { id: "150-160", label: "150-160cm" },
      { id: "161-170", label: "161-170cm" },
      { id: "171-180", label: "171-180cm" },
      { id: "181-190", label: "181-190cm" },
      { id: "191-200", label: "191-200cm" },
      { id: "200+", label: "200+cm" },
    ],
  },
  {
    id: "weight",
    prompt: "What's your weight?",
    systemPrefix: "HEIGHT LOGGED.\n\n",
    type: "hybrid" as const,
    unit: "kg",
    validRange: { min: 30, max: 200 },
    options: [
      { id: "50-60", label: "50-60kg" },
      { id: "61-70", label: "61-70kg" },
      { id: "71-80", label: "71-80kg" },
      { id: "81-90", label: "81-90kg" },
      { id: "91-100", label: "91-100kg" },
      { id: "100+", label: "100+kg" },
    ],
  },
  {
    id: "frequency",
    prompt: "How many days per week can you commit to suffering?",
    systemPrefix: "WEIGHT LOGGED.\n\n",
    type: "options" as const,
    options: [
      { id: "3", label: "3 Days" },
      { id: "4", label: "4 Days" },
      { id: "5", label: "5 Days" },
      { id: "6", label: "6 Days" },
    ],
  },
  {
    id: "equipment",
    prompt: "What hardware do you have access to?",
    systemPrefix: "OPTIMAL FREQUENCY CALCULATED.\n\n",
    type: "options" as const,
    options: [
      { id: "full_gym", label: "Full Gym" },
      { id: "home_gym", label: "Home Gym" },
      { id: "bodyweight", label: "Bodyweight Only" },
    ],
  },
  {
    id: "experience",
    prompt: "How long have you been in the iron game?",
    systemPrefix: "EQUIPMENT PROFILE LOADED.\n\n",
    type: "options" as const,
    options: [
      { id: "beginner", label: "Fresh Meat (<1yr)" },
      { id: "intermediate", label: "Intermediate (1-3yr)" },
      { id: "advanced", label: "Veteran (3yr+)" },
    ],
  },
  {
    id: "injuries",
    prompt: "Any damage I should know about?",
    systemPrefix: "EXPERIENCE LEVEL INDEXED.\n\n",
    type: "options" as const,
    options: [
      { id: "none", label: "None" },
      { id: "upper", label: "Upper Body" },
      { id: "lower", label: "Lower Body" },
      { id: "back", label: "Back/Spine" },
    ],
  },
  {
    id: "session_length",
    prompt: "How much time per session?",
    systemPrefix: "INJURY PROTOCOL NOTED.\n\n",
    type: "options" as const,
    options: [
      { id: "30", label: "30 min" },
      { id: "45", label: "45 min" },
      { id: "60", label: "60 min" },
      { id: "90", label: "90 min+" },
    ],
  },
  {
    id: "style",
    prompt: "What's your preferred suffering style?",
    systemPrefix: "TIME ALLOCATION CONFIRMED.\n\n",
    type: "options" as const,
    options: [
      { id: "traditional", label: "Traditional" },
      { id: "supersets", label: "Supersets" },
      { id: "circuits", label: "Circuits" },
      { id: "surprise", label: "Surprise Me" },
    ],
  },
];

type Message = {
  id: number;
  text: string;
  sender: "system" | "user";
};

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start animate-in fade-in duration-200">
      <div className="border border-green-900 bg-green-950/10 p-4">
        <span className="text-[10px] uppercase opacity-50 block mb-2">IRON_AI CORE</span>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// Completion celebration screen
function CompletionScreen({ onContinue }: { onContinue: () => void }) {
  const [showButton, setShowButton] = useState(false);
  const { vibrate } = useHaptics();

  useEffect(() => {
    // Trigger success haptic
    vibrate("success");
    
    // Show button after animation
    const timer = setTimeout(() => setShowButton(true), 1500);
    return () => clearTimeout(timer);
  }, [vibrate]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 z-50 animate-in fade-in duration-500">
      <div className="text-accent text-xs uppercase tracking-[0.5em] mb-4 animate-pulse">
        CALIBRATION COMPLETE
      </div>
      
      <h1 className="font-display text-5xl md:text-7xl font-black text-white text-center mb-8 animate-in slide-in-from-bottom-4 duration-700">
        PROTOCOL<br/>GENERATED
      </h1>
      
      {/* Animated progress bar */}
      <div className="w-64 h-1 bg-green-900 mb-8 overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-1000 ease-out"
          style={{ 
            width: '100%',
            animation: 'grow 1s ease-out forwards'
          }} 
        />
      </div>

      {/* System readout summary */}
      <div className="text-green-700 text-xs font-mono uppercase tracking-wider mb-8 text-center animate-in fade-in duration-500 delay-500">
        <p>ALL SYSTEMS NOMINAL</p>
        <p className="text-green-500 mt-1">READY FOR DEPLOYMENT</p>
      </div>
      
      {showButton && (
        <button 
          onClick={() => {
            vibrate("medium");
            onContinue();
          }}
          className="bg-accent text-black px-8 py-4 font-bold uppercase tracking-widest 
            hover:bg-white transition-colors touch-manipulation min-h-[56px]
            animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          Initialize Training
        </button>
      )}
    </div>
  );
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [customInputError, setCustomInputError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { vibrate } = useHaptics();

  const currentQuestion = ONBOARDING_QUESTIONS[step];
  const totalSteps = ONBOARDING_QUESTIONS.length;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize first question
  useEffect(() => {
    const firstQuestion = ONBOARDING_QUESTIONS[0];
    const initialText = firstQuestion.systemPrefix + firstQuestion.prompt;
    
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages([{ id: Date.now(), text: initialText, sender: "system" }]);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOptionSelect = (optionId: string, optionLabel: string) => {
    vibrate("light");
    
    // Store the answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    
    // Clear custom input state
    setCustomInput("");
    setCustomInputError("");
    
    // Add user message
    const userMsg: Message = { id: Date.now(), text: optionLabel, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    
    // Check if this was the last question
    if (step >= totalSteps - 1) {
      // Show completion screen after a brief delay
      setTimeout(() => {
        setIsComplete(true);
      }, 600);
      return;
    }
    
    // Show typing indicator, then next question
    setIsTyping(true);
    setTimeout(() => {
      const nextQuestion = ONBOARDING_QUESTIONS[step + 1];
      let systemText = nextQuestion.systemPrefix || "";
      
      // Replace placeholder with previous answer if present
      if (systemText.includes("{PREV}")) {
        systemText = systemText.replace("{PREV}", optionLabel.toUpperCase());
      }
      
      systemText += nextQuestion.prompt;
      
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: systemText, sender: "system" }]);
      setStep(prev => prev + 1);
    }, 500);
  };

  const handleCustomInputSubmit = () => {
    if (currentQuestion.type !== "hybrid") return;
    
    const value = parseFloat(customInput);
    const { min, max } = currentQuestion.validRange;
    
    if (isNaN(value) || value < min || value > max) {
      setCustomInputError(`Enter a value between ${min}-${max}`);
      vibrate("error");
      return;
    }
    
    const label = `${value}${currentQuestion.unit}`;
    handleOptionSelect(customInput, label);
  };

  const handleBackClick = () => {
    if (step === 0 || isTyping) return;
    
    vibrate("light");
    
    // Remove the last user message and system message from the chat
    // Messages array: [system1, user1, system2, user2, ...]
    // We need to remove the last user message and the current system message
    setMessages(prev => {
      const newMessages = [...prev];
      // Remove last user message (the answer to the current step - 1)
      const lastUserIdx = newMessages.map(m => m.sender).lastIndexOf("user");
      if (lastUserIdx !== -1) {
        newMessages.splice(lastUserIdx, 1);
      }
      // Remove the current system message (the question for current step)
      const lastSystemIdx = newMessages.map(m => m.sender).lastIndexOf("system");
      if (lastSystemIdx !== -1 && lastSystemIdx > 0) {
        newMessages.splice(lastSystemIdx, 1);
      }
      return newMessages;
    });
    
    // Clear custom input state
    setCustomInput("");
    setCustomInputError("");
    
    // Go back one step
    setStep(prev => prev - 1);
  };

  const handleComplete = () => {
    // TODO: Save answers to backend/storage
    console.log("Onboarding complete with answers:", answers);
    setLocation("/dashboard");
  };

  if (isComplete) {
    return <CompletionScreen onContinue={handleComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-green-900 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <Terminal size={20} />
          <span className="font-bold tracking-widest text-sm">SYSTEM_CONFIG</span>
        </div>
        <div className="text-xs text-green-800">
          SECURE_CONNECTION
        </div>
      </header>

      {/* Chat Area - Read-only message history */}
      {/* pb-72 for regular questions, pb-96 for hybrid questions (6 options + custom input) */}
      <div className={`flex-1 overflow-y-auto px-4 pt-4 ${currentQuestion?.type === 'hybrid' ? 'pb-96' : 'pb-72'}`}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className={`max-w-[85%] p-4 border ${
                msg.sender === "system" 
                  ? "border-green-900 bg-green-950/10 text-green-500" 
                  : "border-white/20 bg-white/5 text-white"
              }`}>
                <span className="text-[10px] uppercase opacity-50 mb-1 block">
                  {msg.sender === "system" ? "IRON_AI CORE" : "SUBJECT #892"}
                </span>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="fixed bottom-0 inset-x-0 bg-black border-t-2 border-green-900 safe-area-bottom">
        <div className="max-w-3xl mx-auto p-4">
          {/* Progress indicator with Back button */}
          <div className="flex items-center gap-3 mb-4">
            {/* Back button */}
            <button
              onClick={handleBackClick}
              disabled={step === 0 || isTyping}
              className={`flex items-center justify-center w-8 h-8 border border-green-700 
                transition-colors duration-150 touch-manipulation
                ${step === 0 || isTyping 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-green-500 hover:text-black active:bg-green-400'
                }`}
              aria-label="Go back"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="text-green-700 text-xs font-bold">▸ STEP {step + 1}/{totalSteps}</span>
            <div className="flex-1 h-0.5 bg-green-900 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }} 
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-1">
              {ONBOARDING_QUESTIONS.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 border border-green-700 transition-colors duration-300 ${
                    i <= step ? 'bg-green-500' : 'bg-transparent'
                  }`} 
                />
              ))}
            </div>
          </div>
          
          {/* Options Grid */}
          {currentQuestion && !isTyping && (
            <div 
              className={`grid gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                currentQuestion.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'
              }`}
            >
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id, opt.label)}
                  className="min-h-[56px] px-4 py-3 border-2 border-green-700 
                    hover:bg-green-500 hover:text-black active:bg-green-400
                    transition-colors duration-150
                    text-sm uppercase tracking-wider font-bold
                    touch-manipulation
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span className="text-green-700 mr-2">▸</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Custom numeric input for hybrid type questions */}
          {currentQuestion && currentQuestion.type === "hybrid" && !isTyping && (
            <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      setCustomInputError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCustomInputSubmit();
                      }
                    }}
                    placeholder={`Or enter custom (${currentQuestion.unit})`}
                    className="w-full min-h-[56px] px-4 py-3 bg-transparent border-2 border-green-700/50
                      text-green-500 placeholder-green-700/50
                      text-sm uppercase tracking-wider font-bold
                      focus:outline-none focus:border-green-500
                      touch-manipulation"
                  />
                  {customInputError && (
                    <div className="absolute -bottom-5 left-0 text-red-500 text-[10px] uppercase">
                      {customInputError}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCustomInputSubmit}
                  disabled={!customInput}
                  className={`min-h-[56px] px-6 border-2 border-green-700 
                    text-sm uppercase tracking-wider font-bold
                    touch-manipulation transition-colors duration-150
                    ${customInput 
                      ? 'hover:bg-green-500 hover:text-black active:bg-green-400' 
                      : 'opacity-30 cursor-not-allowed'
                    }`}
                >
                  ▸
                </button>
              </div>
            </div>
          )}
          
          {/* Show waiting state while typing */}
          {isTyping && (
            <div className="text-center text-green-700 text-xs uppercase tracking-wider py-4 animate-pulse">
              Processing...
            </div>
          )}
        </div>
      </div>

      {/* CSS for grow animation */}
      <style>{`
        @keyframes grow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
