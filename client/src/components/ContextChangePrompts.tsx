import { useLocation } from "wouter";
import { Hotel, Target, Heart, RotateCcw } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

const CONTEXT_CHANGES = [
  {
    id: "traveling",
    label: "Tô viajando",
    emoji: "🏨",
    icon: Hotel,
    prompt: "Estou viajando e tenho acesso limitado a equipamentos. Só tenho:",
  },
  {
    id: "focus",
    label: "Quero focar em...",
    emoji: "🎯",
    icon: Target,
    prompt: "Quero focar mais em [músculo] nas próximas semanas.",
  },
  {
    id: "pain",
    label: "Tô com dor",
    emoji: "🤕",
    icon: Heart,
    prompt: "Estou com dor em [área] e preciso modificar meu treino.",
  },
  {
    id: "normal",
    label: "Voltei ao normal",
    emoji: "🔄",
    icon: RotateCcw,
    prompt: "Voltei ao normal! Pode restaurar meu programa original?",
  },
];

export default function ContextChangePrompts() {
  const [, setLocation] = useLocation();
  const { vibrate } = useHaptics();

  const handlePromptClick = (prompt: string) => {
    vibrate("light");
    // Navigate to coach with the prompt as a URL parameter
    const encodedPrompt = encodeURIComponent(prompt);
    setLocation(`/coach?prompt=${encodedPrompt}`);
  };

  return (
    <div className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
          Algo mudou?
        </div>
        <h2 className="font-display text-lg font-black uppercase">
          Context Change
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Tell your coach about changes in your situation
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {CONTEXT_CHANGES.map((change) => {
          const Icon = change.icon;
          return (
            <button
              key={change.id}
              onClick={() => handlePromptClick(change.prompt)}
              className="flex flex-col items-center justify-center p-3 min-h-[80px]
                border border-gray-200 bg-white rounded-lg
                hover:border-gray-300 hover:bg-gray-50
                transition-all touch-manipulation group active:scale-[0.98]"
            >
              <span className="text-2xl mb-1">{change.emoji}</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-gray-600 group-hover:text-black text-center">
                {change.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
