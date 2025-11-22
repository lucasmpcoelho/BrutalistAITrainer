import { ArrowRight, Activity, Brain, Zap, Terminal } from "lucide-react";
import videoSrc from "@assets/generated_videos/cinematic_black_and_white_abstract_fitness_background.mp4";
import { useRef, useEffect } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col border-b-2 border-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 grayscale contrast-125"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Overlay Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-12 max-w-7xl mx-auto w-full pt-20">
        <div className="max-w-4xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent px-3 py-1 border-2 border-black font-mono text-xs font-bold uppercase tracking-wider w-fit transform -rotate-1 brutal-shadow">
            <Terminal size={14} />
            <span>System v.2.0 Online</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-white mix-blend-difference">
            Construct<br />
            <span className="text-stroke text-transparent">Your</span><br />
            Machine
          </h1>

          {/* Subheading */}
          <p className="font-mono text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed border-l-4 border-accent pl-6">
            Biometric optimization. Algorithmic hypertrophy. 
            The first AI trainer that understands pain is data.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button className="group relative bg-white text-black px-8 py-4 font-mono font-bold uppercase tracking-wider border-2 border-black brutal-shadow-lg hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 cursor-pointer">
              Initialize Protocol
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 font-mono font-bold uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer">
              View Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stat Bar */}
      <div className="relative z-10 bg-black text-white border-t-2 border-white/20 grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-white/20">
        {[
          { label: "Active Users", value: "14,203" },
          { label: "Workouts", value: "892,101" },
          { label: "Volume Lifted", value: "4.2M kg" },
          { label: "System Status", value: "OPERATIONAL" },
        ].map((stat, i) => (
          <div key={i} className="p-4 md:p-6 flex flex-col">
            <span className="font-mono text-xs text-gray-400 uppercase mb-1">{stat.label}</span>
            <span className="font-display text-2xl md:text-3xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}