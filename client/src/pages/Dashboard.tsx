import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Check,
  Minus,
  Dumbbell,
  Zap,
  Clock,
  RefreshCw,
  SkipForward,
  BookOpen,
  LogIn,
  Loader2,
  Calendar
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import ExerciseNotesSheet from "@/components/ExerciseNotesSheet";
import SkipConfirmSheet from "@/components/SkipConfirmSheet";
import SwapExerciseSheet from "@/components/SwapExerciseSheet";
import ScheduleEditor from "@/components/ScheduleEditor";
import { useHaptics } from "@/hooks/use-haptics";
import { useExercise, type Exercise } from "@/hooks/use-exercise";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkouts, useTodayWorkout, type Workout, type WorkoutExercise as ApiWorkoutExercise } from "@/hooks/use-workouts";
import { useSessions } from "@/hooks/use-sessions";

// Day names for display
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Exercise type for local state
interface LocalExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  type: "compound" | "accessory" | "isolation";
  restSeconds: number;
  orderIndex: number;
}

// Helper to get current week dates
function getWeekDates(): { day: string; date: number; dayOfWeek: number; isToday: boolean }[] {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday
  const dates: { day: string; date: number; dayOfWeek: number; isToday: boolean }[] = [];
  
  // Start from Monday (dayOfWeek = 1)
  for (let i = 0; i < 7; i++) {
    const dayOfWeek = (i + 1) % 7; // Mon=1, Tue=2, ..., Sun=0
    const diff = dayOfWeek - currentDayOfWeek;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    
    dates.push({
      day: DAY_NAMES[dayOfWeek],
      date: date.getDate(),
      dayOfWeek,
      isToday: diff === 0,
    });
  }
  
  return dates;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [weekExpanded, setWeekExpanded] = useState(false);
  const { vibrate } = useHaptics();
  const { isAuthenticated, userProfile, isLoading: isAuthLoading } = useAuth();
  
  // Fetch workouts from API
  const { data: apiWorkouts, isLoading: isWorkoutsLoading } = useWorkouts();
  const { workout: todayWorkout, isLoading: isTodayLoading, hasWorkout } = useTodayWorkout();
  
  // Fetch recent sessions to check completion status
  const { data: sessions } = useSessions(10);

  // Local state for exercises (allows swapping/skipping)
  const [localExercises, setLocalExercises] = useState<LocalExercise[] | null>(null);

  // Sheet states
  const [notesOpen, setNotesOpen] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<LocalExercise | null>(null);

  // Get week dates
  const weekDates = useMemo(() => getWeekDates(), []);

  // Build week data from API workouts
  const weekData = useMemo(() => {
    if (!apiWorkouts) return weekDates.map(d => ({ ...d, type: "REST", completed: false, muscles: [] as string[], workoutId: null as string | null }));
    
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check which days have completed sessions this week
    const completedDays = new Set<number>();
    if (sessions) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      
      sessions.forEach(session => {
        if (session.status === "completed") {
          const sessionDate = new Date(session.startedAt);
          if (sessionDate >= weekStart) {
            completedDays.add(sessionDate.getDay());
          }
        }
      });
    }
    
    return weekDates.map(d => {
      const workout = apiWorkouts.find(w => w.dayOfWeek === d.dayOfWeek && w.isActive);
      return {
        ...d,
        type: workout?.name || "REST",
        completed: completedDays.has(d.dayOfWeek),
        muscles: workout?.targetMuscles || [],
        workoutId: workout?.id || null,
      };
    });
  }, [apiWorkouts, weekDates, sessions]);

  // Initialize local exercises from today's workout
  const exercises = useMemo(() => {
    if (localExercises !== null) return localExercises;
    if (!todayWorkout?.exercises) return [];
    
    return todayWorkout.exercises.map((ex): LocalExercise => ({
      id: ex.id,
      exerciseId: ex.exerciseId,
      name: ex.exerciseName,
      sets: ex.targetSets,
      reps: ex.targetReps,
      type: "compound", // TODO: Get from exercise data
      restSeconds: ex.restSeconds || 90,
      orderIndex: ex.orderIndex,
    }));
  }, [todayWorkout, localExercises]);

  // Today's data
  const todayData = weekData.find(d => d.isToday);
  const completedDays = weekData.filter(d => d.completed).length;
  const workoutDaysCount = weekData.filter(d => d.type !== "REST").length;
  
  // Show user's name if available
  const displayName = userProfile?.displayName || userProfile?.email || "Recruit";

  // Calculate workout stats
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const duration = todayWorkout?.estimatedDurationMin 
    ? `~${todayWorkout.estimatedDurationMin} min`
    : `~${Math.round(totalSets * 4)} min`;

  // Hook to fetch API exercise data for the selected exercise
  const { data: apiExerciseData } = useExercise(
    selectedExercise?.exerciseId || null
  );

  // Action handlers
  const handleNotesClick = (exercise: LocalExercise) => {
    vibrate("light");
    setSelectedExercise(exercise);
    setNotesOpen(true);
  };

  const handleSkipClick = (exercise: LocalExercise) => {
    vibrate("light");
    setSelectedExercise(exercise);
    setSkipOpen(true);
  };

  const handleSwapClick = (exercise: LocalExercise) => {
    vibrate("light");
    setSelectedExercise(exercise);
    setSwapOpen(true);
  };

  const handleSkip = () => {
    if (!selectedExercise) return;
    const newExercises = exercises.filter(ex => ex.id !== selectedExercise.id);
    setLocalExercises(newExercises);
    vibrate("success");
  };

  const handleSwapInstead = () => {
    setSkipOpen(false);
    setTimeout(() => setSwapOpen(true), 200);
  };

  const handleSwap = (newExercise: Exercise) => {
    if (!selectedExercise) return;
    
    const newExercises = exercises.map(ex => 
      ex.id === selectedExercise.id
        ? {
            ...ex,
            exerciseId: newExercise.id,
            name: newExercise.name,
          }
        : ex
    );
    setLocalExercises(newExercises);
    vibrate("success");
  };

  // Get current exercise data from API
  const currentExerciseData = apiExerciseData || null;

  // Loading state
  const isLoading = isAuthLoading || isWorkoutsLoading || isTodayLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <AppHeader title="TODAY" streak={12} />

      <main className="flex-1 flex flex-col">
        
        {/* Week Preview Strip */}
        <div className="bg-white border-b border-gray-200">
          {/* Week progress header */}
          <button
            onClick={() => {
              vibrate("light");
              setWeekExpanded(!weekExpanded);
            }}
            className="w-full flex items-center justify-between p-3 touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold uppercase text-gray-500">
                Week Progress
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent-foreground">
                <span className="font-mono text-xs font-bold">{completedDays}/{workoutDaysCount}</span>
              </div>
            </div>
            {weekExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Week days strip */}
          <div className="flex border-t border-gray-200 overflow-x-auto scrollbar-hide">
            {weekData.map((day, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center min-w-[calc(100%/7)] py-3 border-r border-gray-100 last:border-r-0 ${
                  day.isToday 
                    ? "bg-black text-white" 
                    : day.completed 
                      ? "bg-accent/10" 
                      : ""
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1 opacity-60">
                  {day.day}
                </span>
                <span className="text-lg font-display font-bold">
                  {day.date}
                </span>
                <div className="mt-1.5 h-4 flex items-center justify-center">
                  {day.completed ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : day.type === "REST" ? (
                    <Minus className="w-4 h-4 opacity-30" />
                  ) : day.isToday ? (
                    <Zap className="w-4 h-4 text-accent" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Expanded week details */}
          {weekExpanded && (
            <div className="border-t border-gray-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase text-gray-500">
                  This Week's Training
                </div>
                {isAuthenticated && apiWorkouts && apiWorkouts.length > 0 && (
                  <button
                    onClick={() => {
                      vibrate("light");
                      setScheduleOpen(true);
                    }}
                    className="text-xs font-mono uppercase text-accent hover:text-black transition-colors"
                  >
                    Edit Schedule
                  </button>
                )}
              </div>
              {weekData.filter(d => d.type !== "REST").map((day, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    day.isToday 
                      ? "border-accent bg-accent/5" 
                      : day.completed 
                        ? "border-gray-200 bg-gray-50" 
                        : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center ${
                      day.completed ? "bg-green-100" : day.isToday ? "bg-accent" : "bg-gray-100"
                    }`}>
                      {day.completed ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Dumbbell className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold uppercase">{day.type}</div>
                      <div className="text-[10px] text-gray-500">
                        {day.muscles.join(" • ") || "No muscles specified"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    {day.day} {day.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Workout Section */}
        <div className="flex-1 p-4 space-y-4 pb-32">
          
          {/* Auth prompt for unauthenticated users */}
          {!isAuthenticated && !isAuthLoading && (
            <div className="border-2 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogIn className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="font-mono text-xs uppercase text-yellow-700 font-bold">Demo Mode</div>
                    <div className="text-xs text-yellow-600">Sign in to save your progress and get personalized workouts</div>
                  </div>
                </div>
                <button
                  onClick={() => setLocation("/auth")}
                  className="px-4 py-2 bg-black text-white font-mono text-xs uppercase
                    hover:bg-gray-900 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && isAuthenticated && (
            <div className="border-2 border-gray-200 bg-white p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-500">Loading your workout...</p>
            </div>
          )}

          {/* No workout for today */}
          {!isLoading && isAuthenticated && !hasWorkout && (
            <div className="border-2 border-gray-200 bg-white p-8 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <h2 className="font-display text-xl font-bold mb-2">Rest Day</h2>
              <p className="text-sm text-gray-500 mb-4">
                {apiWorkouts && apiWorkouts.length > 0 
                  ? "No workout scheduled for today. Enjoy your recovery!"
                  : "No workouts generated yet. Complete onboarding to get your personalized program."
                }
              </p>
              {(!apiWorkouts || apiWorkouts.length === 0) && (
                <button
                  onClick={() => setLocation("/onboarding")}
                  className="px-6 py-3 bg-black text-white font-mono text-sm uppercase
                    hover:bg-gray-900 transition-colors"
                >
                  Start Onboarding
                </button>
              )}
            </div>
          )}

          {/* Workout Header Card */}
          {!isLoading && hasWorkout && todayWorkout && (
            <>
              <div className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Today's Protocol
                    </div>
                    <h1 className="font-display text-2xl font-black uppercase">
                      {todayWorkout.name}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-mono">
                      <Clock className="w-4 h-4" />
                      {duration}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 text-xs font-mono">
                  <div>
                    <span className="text-gray-500">EXERCISES:</span>{" "}
                    <span className="font-bold">{exercises.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">SETS:</span>{" "}
                    <span className="font-bold">{totalSets}</span>
                  </div>
                  {todayWorkout.targetMuscles && todayWorkout.targetMuscles.length > 0 && (
                    <div className="flex-1 text-right">
                      <span className="text-gray-400">
                        {todayWorkout.targetMuscles.slice(0, 3).join(" • ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase text-gray-500">
                  Exercises
                </div>
                
                {exercises.map((exercise, i) => (
                  <div
                    key={exercise.id}
                    className="border border-gray-200 bg-white overflow-hidden rounded-xl shadow-sm"
                  >
                    {/* Exercise Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 flex items-center justify-center font-mono font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <h3 className="font-display font-bold uppercase text-lg leading-tight">
                              {exercise.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Sets</div>
                          <div className="font-mono font-bold">{exercise.sets}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Reps</div>
                          <div className="font-mono font-bold">{exercise.reps}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Rest</div>
                          <div className="font-mono font-bold">{exercise.restSeconds}s</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex border-t border-gray-100">
                      <button
                        onClick={() => handleSwapClick(exercise)}
                        className="flex-1 flex items-center justify-center gap-2 py-3
                          font-mono text-xs font-bold uppercase
                          hover:bg-gray-50 active:bg-gray-100 transition-colors
                          touch-manipulation border-r border-gray-100 text-gray-600"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Swap
                      </button>
                      <button
                        onClick={() => handleSkipClick(exercise)}
                        className="flex-1 flex items-center justify-center gap-2 py-3
                          font-mono text-xs font-bold uppercase
                          hover:bg-gray-50 active:bg-gray-100 transition-colors
                          touch-manipulation border-r border-gray-100 text-gray-600"
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip
                      </button>
                      <button
                        onClick={() => handleNotesClick(exercise)}
                        className="flex-1 flex items-center justify-center gap-2 py-3
                          font-mono text-xs font-bold uppercase
                          hover:bg-gray-50 active:bg-gray-100 transition-colors
                          touch-manipulation text-gray-600"
                      >
                        <BookOpen className="w-4 h-4" />
                        Notes
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {exercises.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                    <Dumbbell className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No exercises remaining</p>
                    <p className="text-xs text-gray-400 mt-1">All exercises have been skipped</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Fixed Start Workout CTA */}
        {!isLoading && hasWorkout && exercises.length > 0 && (
          <div className="fixed bottom-20 inset-x-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
            <Link 
              href={`/session?workoutId=${todayWorkout?.id}`}
              onClick={() => vibrate("medium")}
              className="flex items-center justify-center gap-2 w-full min-h-[56px] 
                bg-black text-white font-mono font-bold text-lg uppercase tracking-wider
                rounded-xl shadow-lg hover:bg-gray-900 hover:scale-[1.01]
                transition-all active:scale-[0.99]
                touch-manipulation"
            >
              <Zap className="w-5 h-5" />
              Start Workout
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </main>

      {/* Bottom Sheets */}
      <ExerciseNotesSheet
        exercise={currentExerciseData || null}
        open={notesOpen}
        onOpenChange={setNotesOpen}
      />

      <SkipConfirmSheet
        exerciseName={selectedExercise?.name || ""}
        open={skipOpen}
        onOpenChange={setSkipOpen}
        onSkip={handleSkip}
        onSwapInstead={handleSwapInstead}
      />

      <SwapExerciseSheet
        exerciseId={selectedExercise?.exerciseId || null}
        open={swapOpen}
        onOpenChange={setSwapOpen}
        onSwap={handleSwap}
      />

      <ScheduleEditor
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
    </div>
  );
}
