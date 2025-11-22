import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Terminal, ArrowRight, Check, ChevronRight } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "system" | "user";
  type?: "text" | "options" | "input";
  options?: string[];
};

export default function Onboarding() {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "INITIALIZING NEURAL LINK...", sender: "system" },
    { id: 2, text: "BIOMETRIC SCAN: NEGATIVE.", sender: "system" },
    { id: 3, text: "Welcome to IRON_AI. I need to calibrate your baseline. What is your primary directive?", sender: "system", type: "options", options: ["Hypertrophy", "Strength", "Endurance", "Hybrid"] }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOptionClick = (option: string) => {
    const userMsg: Message = { id: Date.now(), text: option, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      nextStep(option);
    }, 600);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: inputValue, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    
    setTimeout(() => {
      nextStep(inputValue);
    }, 600);
  };

  const nextStep = (lastAnswer: string) => {
    let nextMsg: Message | null = null;

    switch (step) {
      case 0:
        nextMsg = { 
          id: Date.now() + 1, 
          text: `ACKNOWLEDGED: ${lastAnswer.toUpperCase()} PROTOCOL SELECTED. How many days per week can you commit to suffering?`, 
          sender: "system", 
          type: "options", 
          options: ["3 Days", "4 Days", "5 Days", "6 Days (Psychopath)"] 
        };
        break;
      case 1:
        nextMsg = { 
          id: Date.now() + 1, 
          text: "OPTIMAL FREQUENCY CALCULATED. Do you have access to a full commercial gym or limited equipment?", 
          sender: "system", 
          type: "options", 
          options: ["Full Gym", "Home Gym", "Bodyweight Only"] 
        };
        break;
      case 2:
        nextMsg = { 
          id: Date.now() + 1, 
          text: "EQUIPMENT PROFILE LOADED. Last question: What is your current estimated 1RM for Squat (in kg)? Enter '0' if unknown.", 
          sender: "system", 
          type: "input" 
        };
        break;
      case 3:
        nextMsg = { 
          id: Date.now() + 1, 
          text: "CALIBRATION COMPLETE. GENERATING PROTOCOL v1.0...", 
          sender: "system" 
        };
        setTimeout(() => {
           setLocation("/dashboard");
        }, 2000);
        break;
    }

    if (nextMsg) {
      setMessages(prev => [...prev, nextMsg]);
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-green-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={20} />
          <span className="font-bold tracking-widest">SYSTEM_CONFIG</span>
        </div>
        <div className="text-xs text-green-800">
          SECURE_CONNECTION_ESTABLISHED
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 max-w-3xl mx-auto w-full mb-20 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[80%] p-4 border ${
              msg.sender === "system" 
                ? "border-green-900 bg-green-950/10 text-green-500 rounded-tr-lg rounded-br-lg rounded-bl-lg" 
                : "border-white/20 bg-white/5 text-white rounded-tl-lg rounded-bl-lg rounded-br-lg"
            }`}>
              <span className="text-[10px] uppercase opacity-50 mb-1 block">
                {msg.sender === "system" ? "IRON_AI CORE" : "SUBJECT #892"}
              </span>
              <p className="leading-relaxed">{msg.text}</p>
            </div>

            {/* Options Renderer */}
            {msg.type === "options" && msg.options && (
              <div className="mt-3 flex flex-wrap gap-2">
                {msg.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionClick(opt)}
                    className="px-4 py-2 border border-green-700 hover:bg-green-500 hover:text-black transition-colors text-sm uppercase tracking-wider"
                  >
                    {">"} {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Only if needed) */}
      {messages[messages.length - 1]?.type === "input" && (
        <div className="fixed bottom-0 left-0 w-full bg-black border-t border-green-900 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleInputSubmit} className="flex gap-2">
              <span className="py-3 text-green-500">{">"}</span>
              <input 
                type="text" 
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white font-mono text-lg outline-none placeholder-green-900"
                placeholder="ENTER DATA..."
              />
              <button type="submit" className="text-green-500 hover:text-white">
                <ArrowRight />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}