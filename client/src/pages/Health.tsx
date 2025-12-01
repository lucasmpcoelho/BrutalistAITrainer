import { useState, useEffect } from "react";
import { 
  Activity, 
  Moon, 
  Heart, 
  Battery,
  TrendingUp,
  TrendingDown,
  Minus,
  Watch,
  Smartphone,
  AlertCircle
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useHaptics } from "@/hooks/use-haptics";

// Mock health data
const MOCK_DATA = {
  hrv: {
    current: 52,
    baseline: 58,
    trend: "down" as const,
    history: [48, 52, 55, 58, 54, 51, 52], // Last 7 days
  },
  restingHR: {
    current: 58,
    baseline: 55,
    trend: "up" as const,
    history: [54, 55, 56, 55, 57, 58, 58],
  },
  sleep: {
    total: 6.5,
    target: 8,
    rem: 1.7,
    deep: 1.2,
    light: 3.6,
    debt: 45, // minutes
  },
  recovery: {
    score: 72,
    status: "moderate" as const,
    recommendation: "Consider reducing intensity by 10-15% today. Your body is recovering but not fully primed for maximal effort.",
  },
};

// Trend icon component
function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
}

// Mini sparkline chart
function Sparkline({ data, highlight }: { data: number[], highlight?: "high" | "low" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="h-12 flex items-end gap-[2px]">
      {data.map((value, i) => {
        const height = ((value - min) / range) * 100;
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className={`flex-1 transition-all ${
              isLast 
                ? highlight === "high" ? "bg-red-500" : highlight === "low" ? "bg-green-500" : "bg-accent"
                : "bg-gray-300"
            }`}
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        );
      })}
    </div>
  );
}

// Sleep bar component
function SleepBar({ rem, deep, light, total, target }: { 
  rem: number; deep: number; light: number; total: number; target: number 
}) {
  const remPercent = (rem / total) * 100;
  const deepPercent = (deep / total) * 100;
  const lightPercent = (light / total) * 100;
  const targetPercent = Math.min((total / target) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="h-6 flex overflow-hidden border-2 border-black">
        <div className="bg-indigo-600 h-full" style={{ width: `${remPercent}%` }} />
        <div className="bg-indigo-400 h-full" style={{ width: `${deepPercent}%` }} />
        <div className="bg-indigo-200 h-full" style={{ width: `${lightPercent}%` }} />
      </div>
      <div className="flex justify-between text-[10px] font-mono uppercase">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-indigo-600" /> REM {rem}h
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-indigo-400" /> Deep {deep}h
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-indigo-200" /> Light {light}h
        </div>
      </div>
    </div>
  );
}

export default function Health() {
  const [isConnected, setIsConnected] = useState(true);
  const { vibrate } = useHaptics();

  // Get recovery status color
  const getRecoveryColor = (score: number) => {
    if (score >= 80) return "text-green-500 bg-green-500";
    if (score >= 60) return "text-yellow-500 bg-yellow-500";
    return "text-red-500 bg-red-500";
  };

  const recoveryColor = getRecoveryColor(MOCK_DATA.recovery.score);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <AppHeader title="HEALTH" />

      <main className="flex-1 p-4 space-y-4">
        
        {/* Connection Status */}
        <div className="flex items-center justify-between border-2 border-black bg-white p-3">
          <div className="flex items-center gap-3">
            <Watch className="w-5 h-5" />
            <div>
              <div className="text-xs font-bold uppercase">Apple Watch Ultra 2</div>
              <div className="text-[10px] text-gray-500 font-mono">
                {isConnected ? "SYNCED 2 MIN AGO" : "NOT CONNECTED"}
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1 text-[10px] font-bold uppercase ${
            isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {isConnected ? "LINKED" : "OFFLINE"}
          </div>
        </div>

        {/* Recovery Score Card - Main Metric */}
        <div className="border-2 border-black bg-white p-5 brutal-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                Recovery Score
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`font-display text-6xl font-black ${recoveryColor.split(" ")[0]}`}>
                  {MOCK_DATA.recovery.score}
                </span>
                <span className="text-xl text-gray-400">/ 100</span>
              </div>
            </div>
            <div className={`px-3 py-1 text-xs font-bold uppercase ${
              MOCK_DATA.recovery.score >= 80 ? "bg-green-100 text-green-700" :
              MOCK_DATA.recovery.score >= 60 ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {MOCK_DATA.recovery.status}
            </div>
          </div>
          
          {/* Recovery bar */}
          <div className="h-3 bg-gray-200 mb-4 overflow-hidden">
            <div 
              className={`h-full ${recoveryColor.split(" ")[1]} transition-all duration-500`}
              style={{ width: `${MOCK_DATA.recovery.score}%` }}
            />
          </div>

          {/* AI Recommendation */}
          <div className="flex gap-3 p-3 bg-gray-50 border border-gray-200">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-gray-700">
              {MOCK_DATA.recovery.recommendation}
            </p>
          </div>
        </div>

        {/* HRV and Resting HR - Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* HRV Card */}
          <div className="border-2 border-black bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">HRV</span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${
                MOCK_DATA.hrv.trend === "down" ? "text-red-500" : "text-green-500"
              }`}>
                <TrendIcon trend={MOCK_DATA.hrv.trend} />
                {Math.abs(MOCK_DATA.hrv.current - MOCK_DATA.hrv.baseline)}ms
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-display text-3xl font-black">{MOCK_DATA.hrv.current}</span>
              <span className="text-sm text-gray-400">ms</span>
            </div>

            <Sparkline data={MOCK_DATA.hrv.history} highlight="low" />
            
            <div className="text-[10px] text-gray-500 mt-2 font-mono">
              Baseline: {MOCK_DATA.hrv.baseline}ms
            </div>
          </div>

          {/* Resting HR Card */}
          <div className="border-2 border-black bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Rest HR</span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${
                MOCK_DATA.restingHR.trend === "up" ? "text-yellow-500" : "text-green-500"
              }`}>
                <TrendIcon trend={MOCK_DATA.restingHR.trend} />
                {Math.abs(MOCK_DATA.restingHR.current - MOCK_DATA.restingHR.baseline)}bpm
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-display text-3xl font-black">{MOCK_DATA.restingHR.current}</span>
              <span className="text-sm text-gray-400">bpm</span>
            </div>

            <Sparkline data={MOCK_DATA.restingHR.history} highlight="high" />
            
            <div className="text-[10px] text-gray-500 mt-2 font-mono">
              Baseline: {MOCK_DATA.restingHR.baseline}bpm
            </div>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="border-2 border-black bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Sleep</span>
            </div>
            {MOCK_DATA.sleep.debt > 0 && (
              <span className="text-[10px] font-bold text-red-500">
                -{MOCK_DATA.sleep.debt}m DEBT
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-4xl font-black">{MOCK_DATA.sleep.total}</span>
            <span className="text-lg text-gray-400">/ {MOCK_DATA.sleep.target}h target</span>
          </div>

          <SleepBar 
            rem={MOCK_DATA.sleep.rem}
            deep={MOCK_DATA.sleep.deep}
            light={MOCK_DATA.sleep.light}
            total={MOCK_DATA.sleep.total}
            target={MOCK_DATA.sleep.target}
          />
        </div>

        {/* HealthKit Connection CTA */}
        <button 
          onClick={() => vibrate("medium")}
          className="w-full border-2 border-dashed border-gray-400 p-4 
            text-gray-500 hover:border-black hover:text-black transition-colors
            flex items-center justify-center gap-3 touch-manipulation"
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-xs font-bold uppercase">
            Connect Apple Health for Live Data
          </span>
        </button>
      </main>
    </div>
  );
}


