import { Link } from "wouter";
import { Settings, Flame } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface AppHeaderProps {
  title?: string;
  showStreak?: boolean;
  streak?: number;
}

export default function AppHeader({ 
  title = "IRON_AI", 
  showStreak = true,
  streak = 12 
}: AppHeaderProps) {
  const { vibrate } = useHaptics();

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center sticky top-0 z-50 border-b-2 border-white">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <a className="font-display font-bold text-xl tracking-tighter hover:text-accent transition-colors">
            {title}
          </a>
        </Link>
        
        {/* System status indicator - hidden on mobile for cleaner look */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 border-l border-gray-700 pl-3">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          ONLINE
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Streak display */}
        {showStreak && (
          <div className="flex items-center gap-1.5 px-2 py-1 border border-accent/50 bg-accent/10">
            <Flame className="w-4 h-4 text-accent" />
            <span className="font-mono font-bold text-sm text-accent">{streak}</span>
          </div>
        )}
        
        {/* Settings gear */}
        <button
          onClick={() => {
            vibrate("light");
            // TODO: Open settings modal/page
          }}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 
            active:bg-white/20 transition-colors touch-manipulation"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

