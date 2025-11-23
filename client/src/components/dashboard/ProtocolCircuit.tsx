import { 
  Settings, 
  Maximize2, 
  ChevronRight, 
  AlertTriangle,
  Dumbbell,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Slider } from "@/components/ui/slider";

const initialModules = [
  { id: 1, name: "Barbell Squat", sets: 3, reps: 5, load: 142.5, rpe: 8, type: "compound" },
  { id: 2, name: "Romanian Deadlift", sets: 3, reps: 8, load: 110, rpe: 7, type: "compound" },
  { id: 3, name: "Walking Lunges", sets: 3, reps: 12, load: 24, rpe: 9, type: "accessory" },
  { id: 4, name: "Leg Extension", sets: 4, reps: 15, load: 65, rpe: 10, type: "isolation" },
];

export default function ProtocolCircuit() {
  const [modules, setModules] = useState(initialModules);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [systemStress, setSystemStress] = useState(82); // Mock stress score

  const handleLoadChange = (id: number, newLoad: number) => {
    setModules(modules.map(m => m.id === id ? { ...m, load: newLoad } : m));
    // Mock stress calculation
    setSystemStress(prev => Math.min(100, prev + (newLoad > 100 ? 2 : 1)));
  };

  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-2">
            <Zap size={14} className="text-accent" />
            Active Protocol // Legs_Hypertrophy_v2
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase">
            The Circuit
          </h2>
        </div>
        
        {/* System Stress Indicator */}
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">Projected System Stress</div>
          <div className="flex items-center justify-end gap-2">
            <div className={`h-2 w-24 bg-gray-200 overflow-hidden skew-x-[-20deg]`}>
              <div 
                className={`h-full transition-all duration-500 ${
                  systemStress > 90 ? "bg-red-500 animate-pulse" : "bg-black"
                }`} 
                style={{ width: `${systemStress}%` }}
              ></div>
            </div>
            <span className="font-display text-2xl font-bold">{systemStress}%</span>
          </div>
        </div>
      </div>

      {/* The Circuit Grid */}
      <div className="flex-1 relative space-y-8">
        {/* Connecting Line (Visual) */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 -z-10"></div>

        {modules.map((module, i) => (
          <div 
            key={module.id} 
            className={`relative pl-16 transition-all duration-300 ${
              editMode === module.id ? "scale-105 z-10" : ""
            }`}
          >
            {/* Node Connector */}
            <div className={`absolute left-[29px] top-8 w-4 h-4 rounded-full border-4 border-white ${
              module.type === "compound" ? "bg-black" : "bg-gray-400"
            }`}></div>
            
            {/* Line to Card */}
            <div className="absolute left-8 top-[38px] w-8 h-0.5 bg-gray-200"></div>

            {/* Module Card */}
            <div 
              className={`border-2 bg-white p-6 transition-all ${
                editMode === module.id 
                  ? "border-accent shadow-[8px_8px_0px_0px_#ccff33]" 
                  : "border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
              onClick={() => setEditMode(module.id === editMode ? null : module.id)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    MODULE 0{i+1} // {module.type}
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase">{module.name}</h3>
                </div>
                {editMode === module.id ? (
                  <button className="text-xs bg-black text-white px-2 py-1 font-bold uppercase">
                    TUNING...
                  </button>
                ) : (
                  <Settings size={16} className="text-gray-300" />
                )}
              </div>

              {/* Controls / Display */}
              {editMode === module.id ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Tuning Interface */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-2 block">Load (kg)</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleLoadChange(module.id, module.load - 2.5); }}
                          className="w-8 h-8 flex items-center justify-center border border-black hover:bg-black hover:text-white font-bold"
                        >-</button>
                        <span className="font-display text-2xl font-black flex-1 text-center">{module.load}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleLoadChange(module.id, module.load + 2.5); }}
                          className="w-8 h-8 flex items-center justify-center border border-black hover:bg-black hover:text-white font-bold"
                        >+</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-2 block">Volume (Sets)</label>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-2xl font-black flex-1 text-center">{module.sets}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Warning if load high */}
                  {module.load > 140 && (
                    <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-2 border border-red-100">
                      <AlertTriangle size={14} />
                      <span>INTENSITY THRESHOLD WARNING</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Read-only view */
                <div className="grid grid-cols-4 gap-4 text-sm font-mono">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">SETS</span>
                    <span className="font-bold">{module.sets}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">REPS</span>
                    <span className="font-bold">{module.reps}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">LOAD</span>
                    <span className="font-bold">{module.load}kg</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">RPE</span>
                    <span className="font-bold text-accent-foreground">{module.rpe}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex justify-end sticky bottom-0 pt-4 bg-gradient-to-t from-background to-transparent pb-4">
        <Link href="/session">
          <a className="group bg-black text-white px-8 py-4 font-mono font-bold uppercase text-lg tracking-wider border-2 border-black hover:bg-accent hover:text-black transition-all flex items-center gap-2 brutal-shadow-lg hover:translate-y-1 hover:shadow-none">
            Execute Circuit
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </Link>
      </div>
    </div>
  );
}