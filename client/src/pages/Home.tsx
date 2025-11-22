import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Features />
        
        {/* Manifesto Section */}
        <section id="philosophy" className="bg-black text-white py-24 px-4 border-t-2 border-white">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-block border border-white px-4 py-1 font-mono text-xs uppercase tracking-[0.2em]">
              The Philosophy
            </div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight uppercase">
              "The body is hardware.<br />
              <span className="text-accent">The mind is software.</span><br />
              Upgrade both."
            </h2>
            <p className="font-mono text-gray-400 max-w-2xl mx-auto">
              We reject the notion of casual fitness. Training is a discipline of engineering. 
              Measure everything. Optimize constantly. Fail forward.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-accent text-black py-12 px-4 border-t-4 border-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <h3 className="font-display text-4xl font-black uppercase italic">IRON_AI</h3>
              <p className="font-mono text-xs mt-2 max-w-xs font-bold">
                EST. 2025 // BUSHWICK, NY // EARTH
              </p>
            </div>
            
            <div className="font-mono text-sm space-y-1 text-right">
              <p>SYSTEM STATUS: ONLINE</p>
              <p>© 2025 IRON_AI INC.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}