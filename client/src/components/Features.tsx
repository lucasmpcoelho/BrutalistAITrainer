import { 
  Cpu, 
  Watch, 
  Activity, 
  Lock, 
  Zap,
  Crosshair
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Neural Coaching",
    desc: "Beyond static programs. A dynamic protocol that learns your preferences and feedback, adapting instantly like an elite human coach.",
  },
  {
    icon: Watch,
    title: "Biometric Sync",
    desc: "Hardline integration with Apple Watch & wearables. We read your HRV and sleep data to prescribe the exact dosage of suffering for today.",
  },
  {
    icon: Crosshair,
    title: "Precision Form",
    desc: "Computer vision analysis via your camera. Immediate audio feedback on spinal alignment and depth.",
  },
  {
    icon: Activity,
    title: "Recovery Metrics",
    desc: "HRV integration determines daily intensity caps. We don't let you overtrain. We optimize your rest.",
  },
  {
    icon: Lock,
    title: "Offline Mode",
    desc: "Download your protocol. Train in the bunker. Sync when you return to the grid.",
  },
  {
    icon: Zap,
    title: "Stimulant Timing",
    desc: "Caffeine half-life tracking. We tell you exactly when to dose for peak plasma concentration.",
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-background relative">
      {/* Decorative Background Text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-5">
        <h2 className="font-display text-[20vw] leading-none uppercase font-black text-black whitespace-nowrap">
          System Features
        </h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 border-b-4 border-black pb-8">
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase mb-4">
            Core Modules
          </h2>
          <p className="font-mono text-lg max-w-2xl">
            Our stack is built on performance primitives. No fluff. Just raw output optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div 
              key={i}
              className="group border-2 border-black bg-card p-8 hover:bg-black hover:text-white transition-colors duration-300 brutal-shadow-hover relative overflow-hidden"
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

              <f.icon className="w-12 h-12 mb-6 stroke-1 group-hover:stroke-accent transition-colors" />
              
              <h3 className="font-display text-2xl font-bold uppercase mb-4 tracking-tight">
                {f.title}
              </h3>
              
              <p className="font-mono text-sm leading-relaxed opacity-80 group-hover:opacity-100">
                {f.desc}
              </p>

              {/* Number */}
              <div className="absolute bottom-4 right-4 font-mono text-4xl font-black opacity-10 group-hover:text-accent group-hover:opacity-100 transition-all">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}