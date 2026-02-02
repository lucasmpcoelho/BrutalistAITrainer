import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { 
  Check, 
  SkipForward,
  Plus,
  Minus,
  BookOpen,
  Loader2,
  AlertCircle,
  Lightbulb,
  X
} from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { useExercise } from "@/hooks/use-exercise";
import { useWorkout } from "@/hooks/use-workouts";
import { 
  useStartSession, 
  useLogSet, 
  useCompleteSession,
  useActiveSession 
} from "@/hooks/use-sessions";
import { useAuth } from "@/contexts/AuthContext";
import ExerciseNotesSheet from "@/components/ExerciseNotesSheet";

// Exercise type for local session state
interface SessionExercise {
  id: string;
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: string;
  targetRpe: number | null;
  restSeconds: number;
  orderIndex: number;
}

export default function ActiveSession() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const { firebaseUser } = useAuth();
  const userId = firebaseUser?.uid ?? null;
  
  // Parse workout ID from URL
  const workoutId = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return params.get("workoutId");
  }, [searchParams]);

  // Fetch workout data (with userId for cache isolation)
  const { data: workoutData, isLoading: isWorkoutLoading } = useWorkout(workoutId, userId);
  
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Input state
  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  
  // Form cue state
  const [showFormCue, setShowFormCue] = useState(false);
  const formCueTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { vibrate } = useHaptics();

  // Session hooks (with userId for cache isolation)
  const startSession = useStartSession(userId);
  const logSet = useLogSet(userId);
  const completeSession = useCompleteSession(userId);
  const { session: existingActiveSession } = useActiveSession(userId);

  // Build exercises array from workout data
  const exercises: SessionExercise[] = useMemo(() => {
    if (!workoutData?.exercises) return [];
    return workoutData.exercises
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((ex) => ({
        id: ex.id,
        exerciseId: ex.exerciseId,
        name: ex.exerciseName,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        targetRpe: ex.targetRpe,
        restSeconds: ex.restSeconds || 90,
        orderIndex: ex.orderIndex,
      }));
  }, [workoutData]);

  const currentExercise = exercises[currentExerciseIdx];
  const isLastSet = currentExercise ? currentSet === currentExercise.targetSets : false;
  const isLastExercise = currentExerciseIdx === exercises.length - 1;
  
  // Fetch exercise data from API for notes sheet
  const { data: exerciseData } = useExercise(currentExercise?.exerciseId || null);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      // Check for existing active session
      if (existingActiveSession) {
        console.log("[ActiveSession] Resuming existing session:", existingActiveSession.id);
        setSessionId(existingActiveSession.id);
        setIsInitializing(false);
        return;
      }

      // Create new session if we have workout data
      if (workoutData && !sessionId) {
        try {
          const newSession = await startSession.mutateAsync({
            workoutId: workoutData.id,
            workoutName: workoutData.name,
          });
          console.log("[ActiveSession] Created new session:", newSession.id);
          setSessionId(newSession.id);
        } catch (error) {
          console.error("[ActiveSession] Failed to create session:", error);
        }
      }
      
      setIsInitializing(false);
    };

    if (workoutData && !isWorkoutLoading) {
      initSession();
    }
  }, [workoutData, isWorkoutLoading, existingActiveSession, sessionId, startSession]);

  // Session Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimer === 0) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  // Show form cue when rest ends
  useEffect(() => {
    // When rest ends (isResting goes from true to false)
    if (!isResting && exerciseData) {
      // Clear any existing timer
      if (formCueTimerRef.current) {
        clearTimeout(formCueTimerRef.current);
      }
      
      // Show the form cue
      setShowFormCue(true);
      
      // Auto-hide after 4 seconds
      formCueTimerRef.current = setTimeout(() => {
        setShowFormCue(false);
      }, 4000);
    }
    
    return () => {
      if (formCueTimerRef.current) {
        clearTimeout(formCueTimerRef.current);
      }
    };
  }, [isResting, exerciseData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogSet = async () => {
    if (!currentExercise || !sessionId) return;
    
    const weight = parseFloat(weightInput) || 0;
    const reps = parseInt(repsInput) || 0;
    
    vibrate("success");

    // Log set to API
    try {
      const result = await logSet.mutateAsync({
        sessionId,
        data: {
          exerciseId: currentExercise.exerciseId,
          exerciseName: currentExercise.name,
          setNumber: currentSet,
          weight,
          reps,
          rpe: currentExercise.targetRpe ?? undefined,
          isWarmup: false,
        },
      });
      
      console.log("[ActiveSession] Logged set:", result);
      
      // Show PR celebration if applicable
      if (result.isPR) {
        vibrate("success");
        // TODO: Show PR celebration modal
      }
    } catch (error) {
      console.error("[ActiveSession] Failed to log set:", error);
      // Continue anyway - local state will track progress
    }

    setWeightInput("");
    setRepsInput("");

    if (isLastSet) {
      if (isLastExercise) {
        // Complete the session
        await handleCompleteSession();
      } else {
        setCurrentExerciseIdx(prev => prev + 1);
        setCurrentSet(1);
        startRest();
      }
    } else {
      setCurrentSet(prev => prev + 1);
      startRest();
    }
  };

  const handleCompleteSession = async () => {
    if (sessionId) {
      try {
        await completeSession.mutateAsync({ id: sessionId });
        console.log("[ActiveSession] Session completed");
      } catch (error) {
        console.error("[ActiveSession] Failed to complete session:", error);
      }
    }
    vibrate("success");
    setLocation("/dashboard");
  };

  const handleAbort = async () => {
    if (sessionId) {
      try {
        await completeSession.mutateAsync({ 
          id: sessionId, 
          notes: "Workout abandoned" 
        });
      } catch (error) {
        console.error("[ActiveSession] Failed to abandon session:", error);
      }
    }
    setLocation("/dashboard");
  };

  const startRest = () => {
    if (currentExercise) {
      setRestTimer(currentExercise.restSeconds);
      setIsResting(true);
    }
  };

  const skipRest = () => {
    vibrate("medium");
    setRestTimer(0);
    setIsResting(false);
  };

  const addRest = (seconds: number) => {
    vibrate("light");
    setRestTimer(prev => Math.max(0, prev + seconds));
  };
  
  // Quick adjust handlers with haptics
  const adjustWeight = (delta: number) => {
    vibrate("light");
    const current = parseFloat(weightInput) || 0;
    const newValue = Math.max(0, current + delta);
    setWeightInput(newValue === 0 ? "" : newValue.toString());
  };
  
  const adjustReps = (delta: number) => {
    vibrate("light");
    const current = parseInt(repsInput) || 0;
    const newValue = Math.max(0, current + delta);
    setRepsInput(newValue === 0 ? "" : newValue.toString());
  };
  
  const handleNotesClick = () => {
    vibrate("light");
    setNotesOpen(true);
  };

  const dismissFormCue = () => {
    vibrate("light");
    setShowFormCue(false);
    if (formCueTimerRef.current) {
      clearTimeout(formCueTimerRef.current);
    }
  };

  // Get the form cue to display (keyCue or first instruction)
  const formCue = exerciseData?.keyCue || exerciseData?.instructions?.[0] || null;

  // Loading state
  if (isWorkoutLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-mono text-sm uppercase">Loading workout...</p>
      </div>
    );
  }

  // Error state - no workout found
  if (!workoutData || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">No Workout Found</h1>
        <p className="text-gray-500 text-center mb-6">
          {!workoutId 
            ? "No workout ID provided. Start a workout from the dashboard."
            : "The requested workout could not be found."
          }
        </p>
        <button
          onClick={() => setLocation("/dashboard")}
          className="px-6 py-3 bg-black text-white font-mono text-sm uppercase"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col selection:bg-accent selection:text-black">
      
      {/* Top Bar */}
      <header className="bg-black text-white p-4 flex justify-between items-center border-b border-white/20 sticky top-0 z-50">
        <div className="flex items-center gap-4 h-10">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
          <span className="font-bold tracking-widest text-xs md:text-sm">LIVE SESSION</span>
        </div>
        <div className="font-display text-2xl font-bold tracking-tighter h-10 flex items-center">
          {formatTime(sessionDuration)}
        </div>
        <button 
          onClick={handleAbort} 
          className="text-xs font-bold uppercase hover:text-red-500 transition-colors h-10 flex items-center"
        >
          Abort
        </button>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${((currentExerciseIdx * 100) + ((currentSet / currentExercise.targetSets) * (100 / exercises.length)))}%` }} 
          ></div>
        </div>

        {/* Main Exercise View */}
        <div className="flex-1 flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full">
          
          {/* Exercise Header */}
          <div className="mb-8">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
               Exercise {currentExerciseIdx + 1} of {exercises.length}
             </div>
             <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-[0.9]">
               {currentExercise.name}
             </h1>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm mb-8 flex-wrap">
             <div className="bg-black text-white px-3 py-1 font-bold">
               SET {currentSet} / {currentExercise.targetSets}
             </div>
             <div className="font-bold text-gray-500">
               TARGET: <span className="text-black">{currentExercise.targetReps} REPS</span>
             </div>
             {currentExercise.targetRpe && (
               <div className="font-bold text-gray-500">
                 RPE: <span className="text-black">{currentExercise.targetRpe}</span>
               </div>
             )}
           </div>

          {/* Data Entry Card */}
          <div className="border border-gray-200 rounded-xl p-4 md:p-8 bg-white shadow-md relative flex-1 flex flex-col justify-center">
            {/* Notes Button */}
            <div className="flex items-start justify-end mb-6">
              <button
                onClick={handleNotesClick}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg 
                  font-mono text-xs font-bold uppercase text-gray-600
                  hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <BookOpen className="w-4 h-4" />
                Form Cues
              </button>
            </div>

            {/* Weight Input with +/- buttons */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                Weight (kg)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => adjustWeight(-2.5)}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
                    border border-gray-200 rounded-xl bg-gray-50 
                    hover:bg-gray-100 active:bg-gray-200
                    transition-colors touch-manipulation text-gray-600"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 min-h-[60px] flex items-center">
                  <input 
                    type="tel"
                    inputMode="decimal"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    placeholder="0"
                    autoFocus
                    className="w-full text-4xl md:text-5xl font-display font-black 
                      border-b-2 border-gray-100 focus:border-accent focus:outline-none 
                      bg-transparent placeholder-gray-200 transition-colors text-center pb-2"
                  />
                </div>
                <button
                  onClick={() => adjustWeight(2.5)}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
                    border border-gray-200 rounded-xl bg-gray-50 
                    hover:bg-gray-100 active:bg-gray-200
                    transition-colors touch-manipulation text-gray-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reps Input with +/- buttons */}
            <div className="mb-8">
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                Reps
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => adjustReps(-1)}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
                    border border-gray-200 rounded-xl bg-gray-50 
                    hover:bg-gray-100 active:bg-gray-200
                    transition-colors touch-manipulation text-gray-600"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 min-h-[60px] flex items-center">
                  <input 
                    type="tel"
                    inputMode="numeric"
                    value={repsInput}
                    onChange={(e) => setRepsInput(e.target.value)}
                    placeholder="0"
                    className="w-full text-4xl md:text-5xl font-display font-black 
                      border-b-2 border-gray-100 focus:border-accent focus:outline-none 
                      bg-transparent placeholder-gray-200 transition-colors text-center pb-2"
                  />
                </div>
                <button
                  onClick={() => adjustReps(1)}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
                    border border-gray-200 rounded-xl bg-gray-50 
                    hover:bg-gray-100 active:bg-gray-200
                    transition-colors touch-manipulation text-gray-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Log Set Button - Full width, 56px+ height */}
            <button 
              onClick={handleLogSet}
              disabled={logSet.isPending}
              className="w-full min-h-[56px] bg-black text-white py-4 
                font-mono text-lg font-bold uppercase tracking-widest 
                rounded-xl shadow-lg hover:bg-gray-900 transition-all 
                active:scale-[0.98] touch-manipulation
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {logSet.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging...
                </>
              ) : (
                <>
                  Log Set <Check className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Form Cue Overlay - Shows after rest ends */}
        {showFormCue && formCue && !isResting && (
          <div 
            className="absolute top-20 left-4 right-4 z-40 animate-in fade-in slide-in-from-top-4 duration-300"
            onClick={dismissFormCue}
          >
            <div className="bg-accent/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-accent flex items-start gap-3 cursor-pointer">
              <div className="bg-black/10 rounded-lg p-2 flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
                  Form Cue
                </div>
                <p className="text-sm font-medium text-black leading-snug">
                  {formCue}
                </p>
              </div>
              <button 
                onClick={dismissFormCue}
                className="text-black/40 hover:text-black/70 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Rest Timer Overlay */}
        {isResting && (
          <div className="absolute inset-0 z-50 bg-black/95 text-white flex flex-col items-center justify-center p-8 backdrop-blur-sm safe-area-inset-bottom">
            <div className="w-full max-w-md text-center space-y-8">
              <div className="text-sm font-bold text-accent uppercase tracking-[0.3em] animate-pulse">
                System Cooling Down
              </div>
              
              {/* Giant Timer Display */}
              <div className="font-display text-[80px] md:text-[120px] leading-none font-black tabular-nums font-mono">
                {formatTime(restTimer)}
              </div>

              {/* +/- Rest Buttons - Large touch targets */}
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => addRest(30)} 
                  className="min-w-[80px] px-6 py-4 border border-white/20 rounded-xl
                    hover:bg-white/10 font-mono text-sm uppercase 
                    transition-colors touch-manipulation active:scale-95"
                >
                  +30s
                </button>
                <button 
                  onClick={() => addRest(-30)} 
                  className="min-w-[80px] px-6 py-4 border border-white/20 rounded-xl
                    hover:bg-white/10 font-mono text-sm uppercase 
                    transition-colors touch-manipulation active:scale-95"
                >
                  -30s
                </button>
              </div>

              {/* Skip Button - Large touch target */}
              <button 
                onClick={skipRest}
                className="mt-8 w-full min-h-[56px] bg-accent text-black py-4 
                  font-bold uppercase tracking-widest rounded-xl hover:bg-white 
                  transition-colors touch-manipulation active:scale-[0.98]"
              >
                Skip Rest <SkipForward className="inline ml-2 w-5 h-5" />
              </button>

              {/* Next Preview */}
              <div className="mt-6 text-gray-500 text-xs font-mono">
                NEXT: {isLastSet && !isLastExercise ? exercises[currentExerciseIdx + 1].name : "NEXT SET"}
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Exercise Notes Sheet */}
      <ExerciseNotesSheet
        exercise={exerciseData || null}
        open={notesOpen}
        onOpenChange={setNotesOpen}
      />
    </div>
  );
}
