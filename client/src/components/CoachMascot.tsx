import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type MascotState = "idle" | "thinking" | "speaking" | "error" | "success";
export type MascotSize = "sm" | "md" | "lg" | "xl";

interface CoachMascotProps {
    state?: MascotState;
    size?: MascotSize;
    className?: string;
}

export default function CoachMascot({
    state = "idle",
    size = "md",
    className
}: CoachMascotProps) {
    const [blink, setBlink] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);

    // Random blink effect for idle/thinking
    useEffect(() => {
        if (state === "error") return;

        const tick = () => {
            setBlink(true);
            setTimeout(() => setBlink(false), 200);

            // Random next blink between 2s and 8s
            const nextBlink = Math.random() * 6000 + 2000;
            return setTimeout(tick, nextBlink);
        };

        const timer = setTimeout(tick, 2000);
        return () => clearTimeout(timer);
    }, [state]);

    // Speaking animation
    useEffect(() => {
        if (state !== "speaking") {
            setMouthOpen(false);
            return;
        }

        const interval = setInterval(() => {
            setMouthOpen(prev => !prev);
        }, 150);

        return () => clearInterval(interval);
    }, [state]);

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-24 h-24",
        xl: "w-32 h-32"
    };

    const containerBase = "relative flex items-center justify-center bg-black transition-all duration-300";
    // "Squircle" shape - between square and circle for brutalist feel
    const shapeClass = "rounded-[25%]";

    return (
        <div className={cn(containerBase, shapeClass, sizeClasses[size], className)}>
            {/* Eyes Container */}
            <div className={cn(
                "flex justify-center items-center gap-[15%] w-full h-full transition-all duration-300",
                state === "thinking" && "animate-pulse"
            )}>
                {/* Left Eye */}
                <div className={cn(
                    "bg-white transition-all duration-200",
                    // Size relative to container
                    size === "sm" ? "w-1.5 h-1.5" :
                        size === "md" ? "w-2.5 h-2.5" :
                            "w-5 h-5",
                    // Eye shape variations
                    state === "success" ? "h-1 rounded-full scale-x-125 keyframes-laugh" : "rounded-full",
                    // Blink logic
                    (blink && state !== "speaking") ? "scale-y-[0.1]" : "scale-y-100",
                    state === "error" && "rotate-[-20deg] rounded-sm"
                )} />

                {/* Right Eye */}
                <div className={cn(
                    "bg-white transition-all duration-200",
                    size === "sm" ? "w-1.5 h-1.5" :
                        size === "md" ? "w-2.5 h-2.5" :
                            "w-5 h-5",
                    state === "success" ? "h-1 rounded-full scale-x-125" : "rounded-full",
                    (blink && state !== "speaking") ? "scale-y-[0.1]" : "scale-y-100",
                    state === "error" && "rotate-[20deg] rounded-sm"
                )} />
            </div>

            {/* Mouth (Persistent) */}
            <div className={cn(
                "absolute bottom-[20%] bg-white rounded-full transition-all duration-300",

                // Size & Shape variations based on state
                state === "idle" && (
                    size === "sm" ? "h-[2px] w-1.5" :
                        size === "md" ? "h-[3px] w-2.5" :
                            "h-1 w-5"
                ),

                state === "thinking" && (
                    size === "sm" ? "h-1 w-1 rounded-full" :
                        size === "md" ? "h-2 w-2 rounded-full" :
                            "h-4 w-4 rounded-full"
                ),

                state === "speaking" && (
                    size === "sm" ? "h-0.5 w-2" :
                        size === "md" ? "h-1 w-3" :
                            "h-2 w-6"
                ),

                state === "success" && (
                    size === "sm" ? "h-[2px] w-2 rounded-b-full" :
                        size === "md" ? "h-1 w-3 rounded-b-full" :
                            "h-2 w-6 rounded-b-full"
                ),

                state === "error" && (
                    size === "sm" ? "h-[2px] w-2 rounded-t-full mt-[1px]" :
                        size === "md" ? "h-1 w-3 rounded-t-full mt-1" :
                            "h-2 w-6 rounded-t-full mt-2"
                ),

                // Animations
                state === "speaking" && (mouthOpen ? "scale-y-100" : "scale-y-25"),
            )} />

            {/* Thinking Indicator (orbiting dot) */}
            {state === "thinking" && (
                <div className="absolute inset-[-10%] border-2 border-black/10 rounded-[30%] animate-[spin_3s_linear_infinite]" />
            )}
        </div>
    );
}
