import { X, ArrowRight, Dumbbell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ExerciseData } from "@/data/exercises";
import { useHaptics } from "@/hooks/use-haptics";

interface SwapExerciseSheetProps {
  currentExercise: ExerciseData | null;
  alternatives: ExerciseData[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwap: (newExercise: ExerciseData) => void;
}

export default function SwapExerciseSheet({
  currentExercise,
  alternatives,
  open,
  onOpenChange,
  onSwap,
}: SwapExerciseSheetProps) {
  const { vibrate } = useHaptics();

  if (!currentExercise) return null;

  const handleSwap = (newExercise: ExerciseData) => {
    vibrate("medium");
    onSwap(newExercise);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[60vh] rounded-t-xl border-t-2 border-black p-0 bg-white"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center 
            border-2 border-black hover:bg-black hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pb-6 overflow-y-auto h-full">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="font-display text-xl font-black uppercase">
              Swap {currentExercise.name}
            </SheetTitle>
            <p className="text-sm text-gray-600 mt-1">
              Select an alternative exercise
            </p>
          </SheetHeader>

          {/* Alternatives List */}
          <div className="space-y-3">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => handleSwap(alt)}
                className="w-full text-left border-2 border-black p-4 
                  hover:bg-black hover:text-white group transition-all
                  active:translate-x-1 active:translate-y-1 
                  touch-manipulation"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-white/20 
                      flex items-center justify-center transition-colors">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold uppercase">
                        {alt.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono opacity-60 uppercase">
                          {alt.equipment}
                        </span>
                        <span className="text-[10px] opacity-40">•</span>
                        <span className="text-[10px] font-mono opacity-60">
                          {alt.primaryMuscles.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 
                    transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          {/* Empty state if no alternatives */}
          {alternatives.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No alternatives available</p>
            </div>
          )}

          {/* Bottom padding for safe area */}
          <div className="h-8" />
        </div>
      </SheetContent>
    </Sheet>
  );
}


