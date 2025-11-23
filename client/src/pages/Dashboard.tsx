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
  ChevronRight,
  Info
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import Telemetry from "@/components/dashboard/Telemetry";
import ProtocolCircuit from "@/components/dashboard/ProtocolCircuit";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock dates for the calendar strip
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    return d;
  });
  
  const isToday = selectedDate.toDateString() === new Date().toDateString();

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
        <aside className="lg:col-span-3 bg-secondary/10 hidden lg:block h-[calc(100vh-64px)] sticky top-[64px]">
          <Telemetry />
        </aside>

        {/* Main Content / Circuit (Right Panel) */}
        <section className="lg:col-span-9 bg-background flex flex-col">
          
          {/* Date Navigation Strip */}
          <div className="flex items-center justify-between border-b-2 border-gray-200 overflow-x-auto bg-white">
             <div className="flex">
               {dates.map((date, i) => {
                 const isSelected = date.toDateString() === selectedDate.toDateString();
                 const isTodayDate = date.toDateString() === new Date().toDateString();
                 
                 return (
                   <button 
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[80px] p-4 border-r transition-all ${
                      isSelected 
                        ? "bg-black text-white" 
                        : "bg-transparent hover:bg-gray-100 text-gray-400 hover:text-black"
                    }`}
                   >
                     <span className="text-[10px] font-bold uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                     <span className="text-xl font-display font-bold">{date.getDate()}</span>
                     {isTodayDate && <span className={`w-1 h-1 rounded-full mt-2 ${isSelected ? "bg-accent" : "bg-black"}`}></span>}
                   </button>
                 )
               })}
             </div>
             <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase px-6 hover:text-accent transition-colors whitespace-nowrap">
               <Calendar size={14} /> View Archive
             </button>
          </div>

          {/* The Protocol Circuit View */}
          <div className="flex-1">
            {isToday ? (
              <ProtocolCircuit />
            ) : (
               <div className="p-10 flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                 <Terminal size={48} />
                 <p className="font-mono text-sm">ARCHIVED DATA ENCRYPTED</p>
                 <button className="px-4 py-2 border border-gray-300 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                   DECRYPT SESSION LOG
                 </button>
               </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}