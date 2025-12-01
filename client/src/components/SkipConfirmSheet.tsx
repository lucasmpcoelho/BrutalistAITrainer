import { SkipForward, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useHaptics } from "@/hooks/use-haptics";

interface SkipConfirmSheetProps {
  exerciseName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkip: () => void;
  onSwapInstead: () => void;
}

export default function SkipConfirmSheet({
  exerciseName,
  open,
  onOpenChange,
  onSkip,
  onSwapInstead,
}: SkipConfirmSheetProps) {
  const { vibrate } = useHaptics();

  const handleSkip = () => {
    vibrate("medium");
    onSkip();
    onOpenChange(false);
  };

  const handleSwap = () => {
    vibrate("light");
    onSwapInstead();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-xl border-t-2 border-black p-0 bg-white"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pb-8 pt-2">
          <h2 className="font-display text-xl font-black uppercase text-center mb-2">
            Skip {exerciseName}?
          </h2>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            This exercise will be removed from today's workout. 
            You can always add it back.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 flex items-center justify-center gap-2 
                min-h-[56px] border-2 border-black bg-white
                font-mono text-sm font-bold uppercase tracking-wider
                hover:bg-gray-100 active:bg-gray-200 transition-colors
                touch-manipulation"
            >
              <SkipForward className="w-4 h-4" />
              Skip It
            </button>
            
            <button
              onClick={handleSwap}
              className="flex-1 flex items-center justify-center gap-2 
                min-h-[56px] border-2 border-black bg-black text-white
                font-mono text-sm font-bold uppercase tracking-wider
                hover:bg-accent hover:text-black transition-colors
                touch-manipulation"
            >
              <RefreshCw className="w-4 h-4" />
              Swap Instead
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}


