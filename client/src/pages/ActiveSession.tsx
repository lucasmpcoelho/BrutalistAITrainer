import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Activity, 
  Clock, 
  Check, 
  X, 
  ChevronRight, 
  RotateCcw, 
  Maximize2,
  Play,
  Pause,
  SkipForward
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock Data (Same as Dashboard for consistency)
const workout = [
  { id: 1, name: "Barbell Squat", sets: 3, reps: "5", rpe: "8", rest: 180, last: "140kg x 5" },
  { id: 2, name: "Romanian Deadlift", sets: 3, reps: "8", rpe: "7", rest: 120, last: "110kg x 8" },
  { id: 3, name: "Walking Lunges", sets: 3, reps: "12", rpe: "9", rest: 90, last: "24kg x 12" },
  { id: 4, name: "Leg Extension", sets: 4, reps: "15", rpe: "10", rest: 60, last: "65kg x 15" },
];

export default function ActiveSession() {
  const [location, setLocation] = useLocation();
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");

  const currentExercise = workout[currentExerciseIdx];
  const isLastSet = currentSet === currentExercise.sets;
  const isLastExercise = currentExerciseIdx === workout.length - 1;

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
      // Auto-advance logic could go here
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogSet = () => {
    // Here we would save the data
    setWeightInput("");
    setRepsInput("");

    if (isLastSet) {
      if (isLastExercise) {
        // Finish Workout
        setLocation("/dashboard"); // In real app, show summary first
      } else {
        // Move to next exercise
        setCurrentExerciseIdx(prev => prev + 1);
        setCurrentSet(1);
        startRest();
      }
    } else {
      // Move to next set
      setCurrentSet(prev => prev + 1);
      startRest();
    }
  };

  const startRest = () => {
    setRestTimer(currentExercise.rest);
    setIsResting(true);
  };

  const skipRest = () => {
    setRestTimer(0);
    setIsResting(false);
  };

  const addRest = (seconds: number) => {
    setRestTimer(prev => prev + seconds);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col selection:bg-accent selection:text-black">
      
      {/* Top Bar */}
      <header className="bg-black text-white p-4 flex justify-between items-center border-b-2 border-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
          <span className="font-bold tracking-widest text-xs md:text-sm">LIVE SESSION</span>
        </div>
        <div className="font-display text-2xl font-bold tracking-tighter">
          {formatTime(sessionDuration)}
        </div>
        <button onClick={() => setLocation("/dashboard")} className="text-xs font-bold uppercase hover:text-red-500 transition-colors">
          Abort
        </button>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${((currentExerciseIdx * 100) + ((currentSet / currentExercise.sets) * (100 / workout.length)))}%` }} // Rough progress calc
          ></div>
        </div>

        {/* Main Exercise View */}
        <div className="flex-1 flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full">
          
          {/* Exercise Header */}
          <div className="mb-8">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
               Exercise {currentExerciseIdx + 1} of {workout.length}
             </div>
             <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-[0.9]">
               {currentExercise.name}
             </h1>
             <div className="mt-4 flex items-center gap-4 text-sm">
               <div className="bg-black text-white px-3 py-1 font-bold">
                 SET {currentSet} / {currentExercise.sets}
               </div>
               <div className="font-bold text-gray-500">
                 TARGET: <span className="text-black">{currentExercise.reps} REPS</span>
               </div>
               <div className="font-bold text-gray-500">
                 RPE: <span className="text-black">{currentExercise.rpe}</span>
               </div>
             </div>
          </div>

          {/* Data Entry Card */}
          <div className="border-2 border-black p-6 md:p-10 bg-white brutal-shadow-lg relative flex-1 flex flex-col justify-center">
            {/* Previous Performance Ghost */}
            <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 text-right">
              LAST SESSION<br/>
              <span className="text-black text-lg">{currentExercise.last}</span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase text-gray-500">Weight (kg)</label>
                <input 
                  type="tel" 
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full text-5xl md:text-7xl font-display font-black border-b-4 border-gray-200 focus:border-accent focus:outline-none bg-transparent placeholder-gray-200 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase text-gray-500">Reps</label>
                <input 
                  type="tel" 
                  value={repsInput}
                  onChange={(e) => setRepsInput(e.target.value)}
                  placeholder="0"
                  className="w-full text-5xl md:text-7xl font-display font-black border-b-4 border-gray-200 focus:border-accent focus:outline-none bg-transparent placeholder-gray-200 transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={handleLogSet}
              className="w-full bg-black text-white py-6 font-mono text-xl font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-all active:scale-[0.98]"
            >
              Log Set <Check className="inline ml-2 mb-1" />
            </button>
          </div>

        </div>

        {/* Rest Timer Overlay */}
        {isResting && (
          <div className="absolute inset-0 z-50 bg-black/95 text-white flex flex-col items-center justify-center p-8 backdrop-blur-sm">
            <div className="w-full max-w-md text-center space-y-8">
              <div className="text-sm font-bold text-accent uppercase tracking-[0.3em] animate-pulse">
                System Cooling Down
              </div>
              
              <div className="font-display text-[12rem] leading-none font-black tabular-nums">
                {formatTime(restTimer)}
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={() => addRest(30)} className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black font-mono text-xs uppercase transition-colors">
                  +30s
                </button>
                <button onClick={() => addRest(-30)} className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black font-mono text-xs uppercase transition-colors">
                  -30s
                </button>
              </div>

              <button 
                onClick={skipRest}
                className="mt-12 w-full bg-accent text-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                Skip Rest <SkipForward className="inline ml-2 w-4 h-4" />
              </button>

              <div className="mt-8 text-gray-500 text-xs font-mono">
                NEXT: {isLastSet && !isLastExercise ? workout[currentExerciseIdx + 1].name : "NEXT SET"}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}