import { useState, useMemo } from "react";
import { Calendar, Check, Loader2, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWorkouts, useUpdateWorkout, type Workout } from "@/hooks/use-workouts";
import { useHaptics } from "@/hooks/use-haptics";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// REST value constant for dropdown
const REST_VALUE = "__REST__";

interface ScheduleEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleEditor({ open, onOpenChange }: ScheduleEditorProps) {
  const { vibrate } = useHaptics();
  const { data: workouts, isLoading } = useWorkouts();
  const updateWorkout = useUpdateWorkout();
  
  // Track schedule by day: { dayOfWeek: workoutId | null }
  const [dayAssignments, setDayAssignments] = useState<Record<number, string | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize day assignments from current workouts when sheet opens
  useMemo(() => {
    if (open && workouts && !isInitialized) {
      const initial: Record<number, string | null> = {};
      // Initialize all days as REST
      for (let i = 0; i < 7; i++) {
        initial[i] = null;
      }
      // Assign workouts to their days
      workouts.filter(w => w.isActive && w.dayOfWeek !== null && w.dayOfWeek !== undefined).forEach(w => {
        initial[w.dayOfWeek!] = w.id;
      });
      setDayAssignments(initial);
      setIsInitialized(true);
    }
    if (!open) {
      setIsInitialized(false);
    }
  }, [open, workouts, isInitialized]);

  // Build schedule for display (Mon-Sun order)
  const schedule = useMemo(() => {
    const result: { dayOfWeek: number; workoutId: string | null; workout: Workout | null }[] = [];
    
    // Start from Monday (1) through Sunday (0)
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    
    for (const dayOfWeek of dayOrder) {
      const workoutId = dayAssignments[dayOfWeek] ?? null;
      const workout = workoutId ? workouts?.find(w => w.id === workoutId) || null : null;
      
      result.push({ dayOfWeek, workoutId, workout });
    }
    
    return result;
  }, [dayAssignments, workouts]);

  // Get list of all available workouts
  const availableWorkouts = useMemo(() => {
    if (!workouts) return [];
    return workouts.filter(w => w.isActive);
  }, [workouts]);

  // Handle changing workout for a day via dropdown
  const handleDayChange = (dayOfWeek: number, value: string) => {
    vibrate("light");
    
    const newWorkoutId = value === REST_VALUE ? null : value;
    
    // If assigning a workout that's already on another day, swap them
    if (newWorkoutId) {
      const existingDay = Object.entries(dayAssignments).find(
        ([_, wId]) => wId === newWorkoutId
      );
      
      if (existingDay) {
        const previousDay = parseInt(existingDay[0]);
        const currentWorkoutOnTargetDay = dayAssignments[dayOfWeek];
        
        // Swap: move the workout from its current day to target day,
        // and move target day's workout (if any) to the source day
        setDayAssignments(prev => ({
          ...prev,
          [dayOfWeek]: newWorkoutId,
          [previousDay]: currentWorkoutOnTargetDay,
        }));
        return;
      }
    }
    
    // Simple assignment (no swap needed)
    setDayAssignments(prev => ({
      ...prev,
      [dayOfWeek]: newWorkoutId,
    }));
  };

  // Calculate if there are changes from the original state
  const hasChanges = useMemo(() => {
    if (!workouts) return false;
    
    // Build original assignments for comparison
    const original: Record<number, string | null> = {};
    for (let i = 0; i < 7; i++) original[i] = null;
    workouts.filter(w => w.isActive && w.dayOfWeek !== null && w.dayOfWeek !== undefined).forEach(w => {
      original[w.dayOfWeek!] = w.id;
    });
    
    // Compare with current assignments
    for (let i = 0; i < 7; i++) {
      if (dayAssignments[i] !== original[i]) return true;
    }
    return false;
  }, [dayAssignments, workouts]);

  // Save all changes
  const handleSave = async () => {
    if (!hasChanges) {
      onOpenChange(false);
      return;
    }

    setIsSaving(true);
    vibrate("light");

    try {
      // Build updates: for each workout, determine its new day
      const updates: { workoutId: string; newDay: number | null }[] = [];
      
      // Create a map of workout -> new day from current assignments
      const workoutToDayMap: Record<string, number | null> = {};
      availableWorkouts.forEach(w => {
        workoutToDayMap[w.id] = null; // Default to unassigned
      });
      
      // Map from day assignments
      Object.entries(dayAssignments).forEach(([dayStr, workoutId]) => {
        if (workoutId) {
          workoutToDayMap[workoutId] = parseInt(dayStr);
        }
      });
      
      // Create updates for workouts whose day changed
      for (const workout of availableWorkouts) {
        const originalDay = workout.dayOfWeek;
        const newDay = workoutToDayMap[workout.id];
        
        if (originalDay !== newDay) {
          updates.push({ workoutId: workout.id, newDay });
        }
      }
      
      // Apply all changes
      await Promise.all(
        updates.map(({ workoutId, newDay }) =>
          updateWorkout.mutateAsync({
            id: workoutId,
            data: { dayOfWeek: newDay ?? undefined },
          })
        )
      );

      vibrate("success");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      vibrate("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes to original state
  const handleReset = () => {
    vibrate("light");
    setIsInitialized(false); // Will re-initialize from workouts
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="font-display text-xl">Edit Schedule</SheetTitle>
            </div>
            {hasChanges && (
              <button
                onClick={handleReset}
                className="text-xs font-mono uppercase text-gray-500 hover:text-black"
              >
                Reset
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {/* Week Schedule with Dropdowns */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-gray-500 mb-3">
                  Weekly Schedule
                </div>
                
                {schedule.map((day) => {
                  // Check if this day's assignment differs from original
                  const originalWorkout = workouts?.find(
                    w => w.isActive && w.dayOfWeek === day.dayOfWeek
                  );
                  const isChanged = day.workoutId !== (originalWorkout?.id ?? null);
                  
                  return (
                    <div
                      key={day.dayOfWeek}
                      className={`flex items-center gap-3 p-3 border transition-colors rounded-xl ${
                        isChanged
                          ? "border-accent bg-accent/5"
                          : day.workout
                            ? "border-gray-300 bg-white shadow-sm"
                            : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      {/* Day Badge */}
                      <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-mono font-bold text-sm ${
                        day.workout ? "bg-black text-white" : "bg-gray-200 text-gray-400"
                      }`}>
                        {DAY_NAMES[day.dayOfWeek]}
                      </div>
                      
                      {/* Workout Dropdown */}
                      <div className="flex-1 relative">
                        <select
                          value={day.workoutId || REST_VALUE}
                          onChange={(e) => handleDayChange(day.dayOfWeek, e.target.value)}
                          className="w-full appearance-none bg-transparent border-0 
                            font-mono text-sm font-bold uppercase cursor-pointer
                            focus:outline-none focus:ring-0 pr-8
                            py-2"
                        >
                          <option value={REST_VALUE}>REST</option>
                          {availableWorkouts.map((workout) => (
                            <option key={workout.id} value={workout.id}>
                              {workout.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        
                        {/* Target muscles subtitle */}
                        {day.workout?.targetMuscles && (
                          <div className="text-[10px] text-gray-500 -mt-1">
                            {day.workout.targetMuscles.slice(0, 3).join(" • ")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-500 text-center py-4 px-4">
                Tap a day to change its workout. Selecting a workout already assigned elsewhere will swap them.
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-gray-200 bg-white safe-area-bottom">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full min-h-[56px] font-mono font-bold text-lg uppercase tracking-wider
              rounded-xl shadow-sm transition-all touch-manipulation
              flex items-center justify-center gap-2
              ${hasChanges
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : hasChanges ? (
              <>
                <Check className="w-5 h-5" />
                Save Changes
              </>
            ) : (
              "No Changes"
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

