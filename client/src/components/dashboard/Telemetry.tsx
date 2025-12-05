/**
 * HealthPreviewCard (aka Telemetry)
 * 
 * Displays a preview of health/biometrics data synced from wearables.
 * Formerly named "Telemetry" - aligned to "HealthPreviewCard" per roadmap P1-18.
 */
import { 
  Activity, 
  Watch, 
  RefreshCw, 
  Moon,
  Wifi
} from "lucide-react";
import { useState, useEffect } from "react";

// Named export for new naming convention
export function HealthPreviewCard() {
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "connected">("idle");
  const [hrv, setHrv] = useState(104);
  
  useEffect(() => {
    // Simulate periodic sync
    const interval = setInterval(() => {
      setSyncState("syncing");
      setTimeout(() => {
        setSyncState("connected");
        // Randomize HRV slightly to show "live" data
        setHrv(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        setTimeout(() => setSyncState("idle"), 2000);
      }, 1500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary/20 border-r-2 border-black p-6 flex flex-col gap-8 h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Watch size={16} />
          <span>Bio-Link</span>
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${
          syncState === "syncing" ? "text-accent animate-pulse" : "text-gray-500"
        }`}>
          {syncState === "syncing" ? (
            <>SYNCING <RefreshCw size={10} className="animate-spin" /></>
          ) : (
            <>LINKED <Wifi size={10} /></>
          )}
        </div>
      </div>

      {/* Device Card */}
      <div className="border-2 border-black bg-white p-4 relative group hover:bg-black hover:text-white transition-colors">
        <div className="absolute top-2 right-2 opacity-100">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="text-xs font-mono text-gray-400 mb-1 group-hover:text-gray-500">SOURCE DEVICE</div>
        <div className="font-display text-xl font-bold uppercase">Apple Watch<br/>Ultra 2</div>
        <div className="mt-4 flex gap-2 text-[10px] font-mono">
          <span className="border border-current px-1">BATT 82%</span>
          <span className="border border-current px-1">SENSORS OK</span>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="space-y-4">
        
        {/* HRV */}
        <div className="relative">
          <div className="flex justify-between items-end mb-1">
             <span className="text-xs font-bold flex items-center gap-2">
               <Activity size={14} /> HRV (rMSSD)
             </span>
             <span className="font-mono text-xs text-gray-400">LIVE</span>
          </div>
          <div className="font-display text-4xl font-black flex items-baseline gap-2">
            {hrv} <span className="text-sm font-normal text-gray-400">ms</span>
          </div>
          {/* Mock sparkline */}
          <div className="h-8 flex items-end gap-[2px] mt-2 opacity-50">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="w-full bg-current" 
                style={{ height: `${30 + Math.random() * 70}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Sleep */}
        <div>
          <div className="flex justify-between items-end mb-1">
             <span className="text-xs font-bold flex items-center gap-2">
               <Moon size={14} /> SLEEP DEBT
             </span>
             <span className="font-mono text-xs text-red-500 font-bold">+45m</span>
          </div>
          <div className="h-2 bg-gray-200 w-full mt-2 overflow-hidden">
             <div className="h-full bg-black w-[75%]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono mt-1 text-gray-400">
            <span>REM: 1h 42m</span>
            <span>DEEP: 1h 12m</span>
          </div>
        </div>

        {/* Recovery */}
        <div className="pt-4 border-t border-black/10">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold uppercase">System Recovery</span>
             <span className="text-xl font-display font-black">82%</span>
           </div>
           <p className="text-[10px] font-mono leading-relaxed text-gray-500">
             &gt; BASELINE EXCEEDED.<br/>
             &gt; CNS PRIMED FOR HIGH INTENSITY.<br/>
             &gt; SUGGESTED LOAD: 90-95% 1RM.
           </p>
        </div>

      </div>
    </div>
  );
}

// Default export for backwards compatibility
export default HealthPreviewCard;

// Alias for legacy code
export { HealthPreviewCard as Telemetry };