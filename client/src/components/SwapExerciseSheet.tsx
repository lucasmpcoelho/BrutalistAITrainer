import { X, ArrowRight, Dumbbell, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Exercise, useExercise, useExerciseAlternatives } from "@/hooks/use-exercise";
import { useHaptics } from "@/hooks/use-haptics";

interface SwapExerciseSheetProps {
  exerciseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwap: (newExercise: Exercise) => void;
}

export default function SwapExerciseSheet({
  exerciseId,
  open,
  onOpenChange,
  onSwap,
}: SwapExerciseSheetProps) {
  const { vibrate } = useHaptics();
  
  // Fetch current exercise data from API
  const { data: currentExercise, isLoading: isLoadingExercise } = useExercise(
    exerciseId,
    { enabled: open && !!exerciseId }
  );
  
  // Fetch alternatives for current exercise
  const { data: apiAlternativesData, isLoading: isLoadingAlternatives, error } = useExerciseAlternatives(
    currentExercise?.id || null,
    { enabled: open && !!currentExercise }
  );

  const isLoading = isLoadingExercise || isLoadingAlternatives;
  const alternatives: Exercise[] = apiAlternativesData?.alternatives || [];
  
  // Check if we need the Firestore index
  const needsIndex = error?.message?.includes("index");

  const handleSwap = (newExercise: Exercise) => {
    vibrate("medium");
    onSwap(newExercise);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[60vh] rounded-t-xl border-t border-gray-200 p-0 bg-white"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center 
            border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="px-6 pb-6 overflow-y-auto h-full">
          {/* Loading state - exercise not loaded yet */}
          {isLoadingExercise && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {/* Main content - once exercise is loaded */}
          {currentExercise && (
            <>
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="font-display text-xl font-black uppercase">
                  Swap {currentExercise.name}
                </SheetTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Select an alternative targeting <span className="font-semibold">{currentExercise.target}</span>
                </p>
              </SheetHeader>

              {/* Loading alternatives */}
              {isLoadingAlternatives && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}

              {/* Alternatives List */}
              {!isLoadingAlternatives && alternatives.length > 0 && (
                <div className="space-y-3">
                  {alternatives.map((alt) => (
                    <button
                      key={alt.id}
                      onClick={() => handleSwap(alt)}
                      className="w-full text-left border border-gray-200 rounded-xl p-4 
                        hover:bg-gray-50 group transition-all
                        active:scale-[0.99] shadow-sm
                        touch-manipulation"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {alt.gifUrl ? (
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-white/20 
                              overflow-hidden transition-colors">
                              <img 
                                src={alt.gifUrl} 
                                alt={alt.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-white/20 
                              flex items-center justify-center transition-colors">
                              <Dumbbell className="w-5 h-5" />
                            </div>
                          )}
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
                                {alt.target}
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
              )}

              {/* Empty state if no alternatives */}
              {!isLoadingAlternatives && alternatives.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Dumbbell className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No alternatives available</p>
                  {needsIndex && (
                    <p className="text-xs text-gray-400 mt-1">
                      Firestore index needs to be created
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* No exerciseId provided */}
          {!exerciseId && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Select an exercise to swap</p>
            </div>
          )}

          {/* Bottom padding for safe area */}
          <div className="h-8" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
