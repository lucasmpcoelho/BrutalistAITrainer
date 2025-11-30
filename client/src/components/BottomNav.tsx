import { Link, useLocation } from "wouter";
import { Home, LayoutDashboard, BarChart3, User } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/stats", label: "Stats", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const [location] = useLocation();
  const { vibrate } = useHaptics();

  const handleClick = () => {
    vibrate("light");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center flex-1 h-full touch-manipulation transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

