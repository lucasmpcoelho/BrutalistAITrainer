import { Check, AlertTriangle, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ExerciseData } from "@/data/exercises";

interface ExerciseNotesSheetProps {
  exercise: ExerciseData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExerciseNotesSheet({
  exercise,
  open,
  onOpenChange,
}: ExerciseNotesSheetProps) {
  if (!exercise) return null;

  const keyCues = exercise.cues.filter((c) => !c.isAvoid);
  const avoidCues = exercise.cues.filter((c) => c.isAvoid);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[70vh] rounded-t-xl border-t-2 border-black p-0 bg-white"
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
            <SheetTitle className="font-display text-2xl font-black uppercase">
              {exercise.name}
            </SheetTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs font-mono px-2 py-1 bg-gray-100 border border-gray-200">
                {exercise.equipment}
              </span>
              <span className="text-xs font-mono px-2 py-1 bg-gray-100 border border-gray-200 uppercase">
                {exercise.type}
              </span>
            </div>
          </SheetHeader>

          {/* Muscle Groups */}
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">
              Targets
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.primaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="text-xs font-mono px-2 py-1 bg-black text-white"
                >
                  {muscle}
                </span>
              ))}
              {exercise.secondaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="text-xs font-mono px-2 py-1 border border-gray-300 text-gray-600"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Key Cues */}
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

          {/* Common Mistakes */}
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
      </SheetContent>
    </Sheet>
  );
}




