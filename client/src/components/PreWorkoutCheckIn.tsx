import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Moon, 
  Zap, 
  Flame, 
  AlertTriangle,
  ChevronRight,
  Check,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useHaptics } from "@/hooks/use-haptics";

type EnergyLevel = "tired" | "normal" | "energized" | "pain";

interface VolumeAdjustment {
  type: "volume";
  percentage: number;
  reason: string;
}

interface Suggestion {
  id: string;
  text: string;
  type: "volume" | "swap" | "skip";
  accepted: boolean;
}

interface PreWorkoutCheckInProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutId: string;
  workoutName: string;
  exercises: Array<{
    id: string;
    name: string;
    targetSets: number;
  }>;
}

const ENERGY_OPTIONS: {
  id: EnergyLevel;
  label: string;
  emoji: string;
  icon: typeof Moon;
  color: string;
  bgColor: string;
  adjustment: VolumeAdjustment | null;
}[] = [
  {
    id: "tired",
    label: "Cansado",
    emoji: "😴",
    icon: Moon,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20 border-blue-500/30",
    adjustment: { type: "volume", percentage: -20, reason: "Reduzir volume em 20% pra respeitar a fadiga" },
  },
  {
    id: "normal",
    label: "Normal",
    emoji: "💪",
    icon: Zap,
    color: "text-white",
    bgColor: "bg-white/10 border-white/20",
    adjustment: null,
  },
  {
    id: "energized",
    label: "Energizado",
    emoji: "🔥",
    icon: Flame,
    color: "text-accent",
    bgColor: "bg-accent/20 border-accent/30",
    adjustment: { type: "volume", percentage: 10, reason: "Aproveitar a energia com +1 set nos compostos" },
  },
  {
    id: "pain",
    label: "Com dor",
    emoji: "🤕",
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-500/20 border-red-500/30",
    adjustment: null, // Will show exercise-specific options
  },
];

export default function PreWorkoutCheckIn({
  open,
  onOpenChange,
  workoutId,
  workoutName,
  exercises,
}: PreWorkoutCheckInProps) {
  const [, setLocation] = useLocation();
  const { vibrate } = useHaptics();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleEnergySelect = (energy: EnergyLevel) => {
    vibrate("light");
    setSelectedEnergy(energy);

    const option = ENERGY_OPTIONS.find(o => o.id === energy);
    
    if (energy === "normal") {
      // No adjustments needed, go straight to workout
      setTimeout(() => {
        onOpenChange(false);
        setLocation(`/session?workoutId=${workoutId}`);
      }, 300);
      return;
    }

    if (energy === "pain") {
      // Show exercise-specific suggestions
      const painSuggestions: Suggestion[] = exercises.slice(0, 3).map((ex, i) => ({
        id: `pain-${i}`,
        text: `Modificar ou pular ${ex.name}?`,
        type: "swap" as const,
        accepted: false,
      }));
      setSuggestions(painSuggestions);
      setShowSuggestions(true);
      return;
    }

    if (option?.adjustment) {
      // Show volume adjustment suggestion
      setSuggestions([{
        id: "volume-adjust",
        text: option.adjustment.reason,
        type: "volume",
        accepted: true,
      }]);
      setShowSuggestions(true);
    }
  };

  const handleConfirm = () => {
    vibrate("medium");
    onOpenChange(false);
    
    // TODO: Pass adjustments to session via URL params or context
    const acceptedSuggestions = suggestions.filter(s => s.accepted);
    const volumeAdjust = acceptedSuggestions.find(s => s.type === "volume");
    
    let url = `/session?workoutId=${workoutId}`;
    
    if (selectedEnergy === "tired" && volumeAdjust?.accepted) {
      url += "&volumeAdjust=-20";
    } else if (selectedEnergy === "energized" && volumeAdjust?.accepted) {
      url += "&volumeAdjust=10";
    }
    
    setLocation(url);
  };

  const handleSkip = () => {
    vibrate("light");
    onOpenChange(false);
    setLocation(`/session?workoutId=${workoutId}`);
  };

  const toggleSuggestion = (id: string) => {
    vibrate("light");
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, accepted: !s.accepted } : s)
    );
  };

  const resetState = () => {
    setSelectedEnergy(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Sheet 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) resetState();
        onOpenChange(isOpen);
      }}
    >
      <SheetContent 
        side="bottom" 
        className="h-auto max-h-[85vh] rounded-t-xl border-t border-white/10 p-0 bg-black text-white [&>button]:text-white"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="font-display text-2xl font-black uppercase text-white">
              {!showSuggestions ? "Como você tá hoje?" : "Sugestões"}
            </SheetTitle>
            <p className="text-sm text-gray-400 font-mono">
              {workoutName}
            </p>
          </SheetHeader>

          {/* Energy Selection */}
          {!showSuggestions && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {ENERGY_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedEnergy === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleEnergySelect(option.id)}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-xl border-2
                      transition-all duration-200 touch-manipulation
                      ${isSelected 
                        ? `${option.bgColor} scale-[1.02]` 
                        : "border-white/10 hover:border-white/20"
                      }
                    `}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className={`text-sm font-mono uppercase ${isSelected ? option.color : "text-gray-400"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && (
            <div className="space-y-3 mb-6">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => toggleSuggestion(suggestion.id)}
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-xl border-2
                    transition-all duration-200 touch-manipulation text-left
                    ${suggestion.accepted 
                      ? "border-accent bg-accent/10" 
                      : "border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
                    ${suggestion.accepted ? "bg-accent text-black" : "border border-white/30"}
                  `}>
                    {suggestion.accepted && <Check className="w-4 h-4" />}
                  </div>
                  <span className="text-sm flex-1">{suggestion.text}</span>
                </button>
              ))}

              {/* Back button */}
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  setSelectedEnergy(null);
                }}
                className="text-sm text-gray-500 hover:text-white transition-colors font-mono"
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {showSuggestions && (
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full min-h-[56px] bg-accent text-black py-4 
                  font-bold uppercase tracking-widest rounded-xl
                  hover:bg-white transition-colors touch-manipulation
                  flex items-center justify-center gap-2"
              >
                Confirmar e Começar
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full py-3 text-gray-500 hover:text-white
                  font-mono text-sm uppercase transition-colors"
              >
                Pular ajustes
              </button>
            </div>
          )}

          {/* Skip check-in entirely */}
          {!showSuggestions && (
            <button
              onClick={handleSkip}
              className="w-full py-3 text-gray-500 hover:text-white
                font-mono text-xs uppercase transition-colors mt-4"
            >
              Pular check-in →
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
