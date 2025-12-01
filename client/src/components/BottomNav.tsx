import { Link, useLocation } from "wouter";
import { Zap, Bot, Heart } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Today", icon: Zap },
  { path: "/coach", label: "Coach", icon: Bot },
  { path: "/health", label: "Health", icon: Heart },
];

export default function BottomNav() {
  const [location] = useLocation();
  const { vibrate } = useHaptics();

  const handleClick = () => {
    vibrate("light");
  };

  // Check if current location matches any nav item or is a sub-route
  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location === "/dashboard" || location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t-2 border-white safe-area-bottom">
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center flex-1 touch-manipulation transition-all duration-150 relative ${
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white active:bg-white/10"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-black" : ""}`} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
