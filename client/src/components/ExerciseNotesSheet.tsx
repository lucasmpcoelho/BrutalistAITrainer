import { useState } from "react";
import { Check, AlertTriangle, X, Play, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExerciseData } from "@/data/exercises";
import { Exercise } from "@/hooks/use-exercise";

// Union type to support both legacy ExerciseData and new API Exercise
type ExerciseInput = ExerciseData | Exercise;

interface ExerciseNotesSheetProps {
  exercise: ExerciseInput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Type guard to check if exercise is from API (has gifUrl)
function isApiExercise(exercise: ExerciseInput): exercise is Exercise {
  return "gifUrl" in exercise && typeof exercise.gifUrl === "string";
}

// Type guard to check if exercise is legacy format (has cues)
function isLegacyExercise(exercise: ExerciseInput): exercise is ExerciseData {
  return "cues" in exercise && Array.isArray(exercise.cues);
}

/**
 * Hero GIF Component
 * Displays the exercise demonstration GIF with loading state
 */
function HeroGif({ gifUrl, exerciseName }: { gifUrl: string; exerciseName: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Play className="w-12 h-12 mb-2" />
            <span className="text-xs font-mono uppercase">Demo Unavailable</span>
          </div>
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className="w-full bg-black border border-gray-800 rounded-xl relative overflow-hidden shadow-sm">
      <AspectRatio ratio={16 / 9}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}
        <img
          src={gifUrl}
          alt={`${exerciseName} demonstration`}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </AspectRatio>
    </div>
  );
}

export default function ExerciseNotesSheet({
  exercise,
  open,
  onOpenChange,
}: ExerciseNotesSheetProps) {
  if (!exercise) return null;

  // Extract data based on exercise type
  const isApi = isApiExercise(exercise);
  const isLegacy = isLegacyExercise(exercise);
  
  // Get cues (only available in legacy format)
  const keyCues = isLegacy ? exercise.cues.filter((c) => !c.isAvoid) : [];
  const avoidCues = isLegacy ? exercise.cues.filter((c) => c.isAvoid) : [];
  
  // Get instructions (API format) or empty array
  const instructions = isApi ? exercise.instructions : [];
  
  // Get muscles
  const primaryMuscles = isLegacy 
    ? exercise.primaryMuscles 
    : isApi 
      ? [exercise.target] 
      : [];
  const secondaryMuscles = isLegacy 
    ? exercise.secondaryMuscles 
    : isApi 
      ? exercise.secondaryMuscles 
      : [];

  // Get exercise type or body part
  const typeLabel = isLegacy ? exercise.type : isApi ? exercise.bodyPart : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-xl border-t border-gray-200 p-0 bg-white"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center 
            border border-gray-200 rounded-full bg-white/80 backdrop-blur-sm 
            hover:bg-gray-100 transition-colors z-10 shadow-sm"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="pb-6 overflow-y-auto h-full">
          {/* Hero GIF Section - API exercises only */}
          {isApi && exercise.gifUrl && (
            <div className="mb-4">
              <HeroGif gifUrl={exercise.gifUrl} exerciseName={exercise.name} />
            </div>
          )}

          <div className="px-6">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="font-display text-2xl font-black uppercase">
                {exercise.name}
              </SheetTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-mono px-2 py-1 bg-gray-100 border border-gray-200">
                  {exercise.equipment}
                </span>
                {typeLabel && (
                  <span className="text-xs font-mono px-2 py-1 bg-gray-100 border border-gray-200 uppercase">
                    {typeLabel}
                  </span>
                )}
              </div>
            </SheetHeader>

            {/* Muscle Groups */}
            {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">
                  Targets
                </div>
                <div className="flex flex-wrap gap-2">
                  {primaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="text-xs font-mono px-2 py-1 bg-black text-white"
                    >
                      {muscle}
                    </span>
                  ))}
                  {secondaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="text-xs font-mono px-2 py-1 border border-gray-300 text-gray-600"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions (API format) */}
            {instructions.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-3">
                  Instructions
                </div>
                <div className="space-y-3">
                  {instructions.map((instruction, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Cues (Legacy format) */}
            {keyCues.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-3">
                  Key Cues
                </div>
                <div className="space-y-2">
                  {keyCues.map((cue, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <p className="text-sm leading-relaxed">{cue.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes (Legacy format) */}
            {avoidCues.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  Avoid
                </div>
                <div className="space-y-2 bg-red-50 border border-red-100 p-3">
                  {avoidCues.map((cue, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm leading-relaxed text-red-800">{cue.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom padding for safe area */}
            <div className="h-8" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}




