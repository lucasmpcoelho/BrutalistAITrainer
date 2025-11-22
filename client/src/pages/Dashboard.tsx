import { 
  Activity, 
  Battery, 
  Clock, 
  Cpu, 
  Dumbbell, 
  Heart, 
  Maximize2, 
  Play, 
  CheckSquare, 
  Terminal,
  TrendingUp,
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Dashboard() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock dates for the calendar strip
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    return d;
  });

  const toggleComplete = (id: number) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter(c => c !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };

  // Mock data changing based on date selection (simple toggle for prototype)
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  
  const workout = isToday ? [
    { id: 1, name: "Barbell Squat", sets: "3", reps: "5", rpe: "8", rest: "180s" },
    { id: 2, name: "Romanian Deadlift", sets: "3", reps: "8", rpe: "7", rest: "120s" },
    { id: 3, name: "Walking Lunges", sets: "3", reps: "12", rpe: "9", rest: "90s" },
    { id: 4, name: "Leg Extension", sets: "4", reps: "15", rpe: "10", rest: "60s" },
  ] : [
    { id: 1, name: "Bench Press", sets: "5", reps: "5", rpe: "9", rest: "180s", completed: true },
    { id: 2, name: "Incline DB Press", sets: "3", reps: "10", rpe: "8", rest: "120s", completed: true },
    { id: 3, name: "Lateral Raise", sets: "4", reps: "15", rpe: "10", rest: "60s", completed: true },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-accent selection:text-black flex flex-col">
      {/* Top Status Bar */}
      <header className="border-b-2 border-black bg-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="font-display font-bold text-xl tracking-tighter hover:text-accent transition-colors">IRON_AI</a>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 border-l border-gray-700 pl-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-xs md:text-sm font-bold">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            <span>HR: 62 BPM</span>
          </div>
          <div className="flex items-center gap-2">
            <Battery size={16} className="text-accent" />
            <span>PWR: 98%</span>
          </div>
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-display font-black">
            JS
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black">
        
        {/* Sidebar / Biometrics (Left Panel) */}
        <aside className="lg:col-span-4 bg-secondary/20 p-6 space-y-8">
          
          {/* Calendar Strip (Mobile only, usually. But let's put it here for now or in main content) */}
          {/* Actually let's keep Sidebar for Bio and Main for Workout Context */}

          {/* Readiness Score */}
          <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold uppercase flex items-center gap-2">
                <Zap size={18} /> Readiness
              </h3>
              <span className="bg-black text-white text-xs px-2 py-1">
                {isToday ? "TODAY" : "PAST DATA"}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-display text-7xl font-black leading-none">
                {isToday ? "82" : "65"}
              </span>
              <span className="text-xl font-bold mb-1">%</span>
            </div>
            <p className="text-xs text-gray-600 border-t-2 border-black pt-2 mt-2">
              {isToday 
                ? "CNS recovery optimal. HRV baseline exceeded. You are cleared for heavy loading."
                : "Recovery was compromised. Sleep latency detected. Volume was reduced by 15%."}
            </p>
          </div>

          {/* AI Insight Terminal */}
          <div className="bg-black text-green-500 p-4 font-mono text-xs border-2 border-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 border-b border-green-900 pb-2 mb-2">
                <Terminal size={14} />
                <span className="font-bold">NEURAL_COACH_LOG</span>
              </div>
              {isToday ? (
                <>
                  <p>{">"} DETECTED: Sleep latency improved by 12%.</p>
                  <p>{">"} ANALYZING: Previous squat session velocity dip.</p>
                  <p>{">"} ADJUSTMENT: Added +2.5kg to working sets.</p>
                  <p>{">"} PRESCRIPTION: Focus on eccentric control (3s).</p>
                  <p className="animate-pulse mt-4">_WAITING_FOR_INPUT...</p>
                </>
              ) : (
                 <>
                  <p>{">"} ARCHIVE_MODE: Viewing historical data.</p>
                  <p>{">"} SESSION_STATUS: COMPLETED.</p>
                  <p>{">"} METRICS: Volume 12,400kg | Intensity 8.5 RPE.</p>
                  <p>{">"} NOTE: User reported slight shoulder impingement.</p>
                </>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-black bg-white p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">Sleep</div>
              <div className="font-display text-2xl font-bold">{isToday ? "7h 42m" : "6h 10m"}</div>
            </div>
            <div className="border-2 border-black bg-white p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">HRV</div>
              <div className="font-display text-2xl font-bold">{isToday ? "104ms" : "89ms"}</div>
            </div>
            <div className="border-2 border-black bg-white p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">Strain</div>
              <div className="font-display text-2xl font-bold">{isToday ? "14.2" : "18.5"}</div>
            </div>
            <div className="border-2 border-black bg-white p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">Calories</div>
              <div className="font-display text-2xl font-bold">{isToday ? "2,840" : "3,100"}</div>
            </div>
          </div>
        </aside>

        {/* Main Content / Workout (Right Panel) */}
        <section className="lg:col-span-8 bg-background p-6 md:p-10 flex flex-col">
          
          {/* Date Navigation Strip */}
          <div className="flex items-center justify-between mb-8 border-b-2 border-gray-200 pb-4 overflow-x-auto">
             <div className="flex gap-2">
               {dates.map((date, i) => {
                 const isSelected = date.toDateString() === selectedDate.toDateString();
                 const isTodayDate = date.toDateString() === new Date().toDateString();
                 
                 return (
                   <button 
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[60px] p-2 border-2 transition-all ${
                      isSelected 
                        ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)]" 
                        : "border-transparent hover:border-gray-300 text-gray-400 hover:text-black"
                    }`}
                   >
                     <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                     <span className="text-xl font-display font-bold">{date.getDate()}</span>
                     {isTodayDate && <span className="w-1 h-1 bg-accent rounded-full mt-1"></span>}
                   </button>
                 )
               })}
             </div>
             <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase border-2 border-black px-3 py-2 hover:bg-black hover:text-white transition-colors">
               <Calendar size={14} /> Full History
             </button>
          </div>

          <div className="max-w-3xl mx-auto w-full flex-1">
            
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">
                  {isToday ? "Todays Protocol" : "Past Session"}
                </div>
                <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-none">
                  {isToday ? "Legs" : "Push"} / <span className="text-stroke text-transparent text-foreground">
                    {isToday ? "Power" : "Hypertrophy"}
                  </span>
                </h1>
              </div>
              <div className="flex gap-2">
                 <div className="px-3 py-1 border-2 border-black text-xs font-bold uppercase bg-accent">
                   {isToday ? "Strength" : "Volume"}
                 </div>
                 <div className="px-3 py-1 border-2 border-black text-xs font-bold uppercase bg-white">
                   {isToday ? "60 Min" : "45 Min"}
                 </div>
              </div>
            </div>

            {/* Workout List */}
            <div className="space-y-4">
              {workout.map((exercise: any) => (
                <div 
                  key={exercise.id}
                  className={`border-2 border-black p-0 transition-all duration-300 ${
                    (completed.includes(exercise.id) || exercise.completed) ? "bg-gray-100 text-gray-500" : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Status Checkbox */}
                    <button 
                      onClick={() => isToday && toggleComplete(exercise.id)}
                      disabled={!isToday}
                      className={`w-full md:w-16 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-black p-4 transition-colors ${
                        (completed.includes(exercise.id) || exercise.completed) 
                          ? "bg-black text-white" 
                          : isToday ? "hover:bg-accent hover:text-black" : "bg-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <CheckSquare size={24} />
                    </button>

                    {/* Details */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-display text-2xl font-bold uppercase">{exercise.name}</h3>
                        <div className="text-xs font-mono border border-current px-2 py-0.5 opacity-50">
                          ID: {exercise.id}0{exercise.id}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 font-mono text-sm">
                        <div>
                          <span className="block text-[10px] uppercase opacity-60">Sets</span>
                          <span className="text-xl font-bold">{exercise.sets}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase opacity-60">Reps</span>
                          <span className="text-xl font-bold">{exercise.reps}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase opacity-60">Target RPE</span>
                          <span className="text-xl font-bold text-accent-foreground">{exercise.rpe}</span>
                        </div>
                         <div>
                          <span className="block text-[10px] uppercase opacity-60">Rest</span>
                          <span className="text-xl font-bold">{exercise.rest}</span>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="md:w-32 border-t-2 md:border-t-0 md:border-l-2 border-black bg-gray-50 p-4 flex flex-col justify-center gap-2">
                      <label className="text-[10px] font-bold uppercase">Load (kg)</label>
                      {isToday ? (
                        <input 
                          type="text" 
                          placeholder="0.0" 
                          className="w-full bg-white border-2 border-black p-2 font-mono font-bold text-center focus:outline-none focus:bg-accent focus:border-black"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="font-mono font-bold text-center text-xl line-through decoration-2 decoration-accent">
                           {100 + (exercise.id * 10)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Start Button */}
            {isToday && (
              <div className="mt-12 flex justify-end">
                 <button className="bg-black text-white px-8 py-4 font-mono font-bold uppercase text-lg tracking-wider border-2 border-black hover:bg-accent hover:text-black transition-all flex items-center gap-2 brutal-shadow-lg hover:translate-y-1 hover:shadow-none">
                   Begin Session <Play size={20} fill="currentColor" />
                 </button>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}