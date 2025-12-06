import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Settings, Flame, LogOut, User, Calendar, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteAllWorkouts } from "@/hooks/use-workouts";
import ScheduleEditor from "@/components/ScheduleEditor";

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
  const { userProfile, firebaseUser, logout, isAuthenticated, refetchProfile } = useAuth();
  const userId = firebaseUser?.uid ?? null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  
  // Pass userId for cache isolation
  const deleteAllWorkouts = useDeleteAllWorkouts(userId);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    vibrate("medium");
    setMenuOpen(false);
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEditSchedule = () => {
    vibrate("light");
    setMenuOpen(false);
    setScheduleOpen(true);
  };

  const handleResetClick = () => {
    vibrate("light");
    setMenuOpen(false);
    setResetConfirmOpen(true);
  };

  const handleResetConfirm = async () => {
    vibrate("medium");
    try {
      await deleteAllWorkouts.mutateAsync();
      // Refetch profile to update onboardingCompleted status
      await refetchProfile();
      vibrate("success");
      setResetConfirmOpen(false);
      // Redirect to onboarding
      setLocation("/onboarding");
    } catch (error) {
      console.error("Failed to reset training plan:", error);
      vibrate("error");
    }
  };

  const handleResetCancel = () => {
    vibrate("light");
    setResetConfirmOpen(false);
  };

  const displayName = userProfile?.displayName || firebaseUser?.email || "User";
  const displayEmail = userProfile?.email || firebaseUser?.email || "";
  const avatarUrl = userProfile?.photoURL || firebaseUser?.photoURL;

  return (
    <>
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
          
          {/* Settings/Account Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                vibrate("light");
                setMenuOpen(!menuOpen);
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 
                active:bg-white/20 transition-colors touch-manipulation"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full border border-white/30"
                />
              ) : (
                <Settings className="w-5 h-5" />
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-black border-2 border-white 
                shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* User Info */}
                {isAuthenticated && (
                  <div className="p-4 border-b border-white/20">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full border border-white/30"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-bold truncate">
                          {displayName}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {displayEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="p-2">
                  {isAuthenticated && (
                    <>
                      {/* Edit Schedule */}
                      <button
                        onClick={handleEditSchedule}
                        className="w-full flex items-center gap-3 px-3 py-2.5 
                          font-mono text-sm uppercase tracking-wider
                          hover:bg-white/10 active:bg-white/20 
                          transition-colors touch-manipulation text-left"
                      >
                        <Calendar className="w-4 h-4" />
                        Edit Schedule
                      </button>

                      {/* Reset Training Plan */}
                      <button
                        onClick={handleResetClick}
                        className="w-full flex items-center gap-3 px-3 py-2.5 
                          font-mono text-sm uppercase tracking-wider
                          hover:bg-red-900/50 active:bg-red-800/50 
                          text-red-400 hover:text-red-300
                          transition-colors touch-manipulation text-left"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset Training Plan
                      </button>

                      <div className="border-t border-white/10 my-2" />
                    </>
                  )}

                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 
                        font-mono text-sm uppercase tracking-wider
                        hover:bg-white/10 active:bg-white/20 
                        transition-colors touch-manipulation text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setLocation("/auth");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 
                        font-mono text-sm uppercase tracking-wider
                        hover:bg-white/10 active:bg-white/20 
                        transition-colors touch-manipulation text-left"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white border border-gray-200 rounded-xl max-w-sm w-full p-6 
            shadow-xl">
            
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 border border-red-200 rounded-full 
              flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="font-display text-xl font-black uppercase text-center mb-2">
              Reset Training Plan?
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              This will delete all your workouts and restart the onboarding process. 
              Your workout history and progress will be preserved.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleResetCancel}
                disabled={deleteAllWorkouts.isPending}
                className="flex-1 py-3 border border-gray-200 rounded-lg font-mono font-bold uppercase
                  hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                disabled={deleteAllWorkouts.isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg 
                  font-mono font-bold uppercase shadow-sm
                  hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {deleteAllWorkouts.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Editor Sheet */}
      <ScheduleEditor 
        open={scheduleOpen} 
        onOpenChange={setScheduleOpen} 
      />
    </>
  );
}
