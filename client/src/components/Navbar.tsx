import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Ticker */}
      <div className="bg-accent text-accent-foreground font-mono text-xs py-1 overflow-hidden border-b-2 border-black z-50 relative">
        <div className="animate-marquee whitespace-nowrap">
          EARLY ACCESS OPEN /// JOIN THE REVOLUTION /// NO PAIN NO GAIN /// AI OPTIMIZED HYPERTROPHY /// QUANTIFIED SUFFERING /// EARLY ACCESS OPEN /// JOIN THE REVOLUTION ///
        </div>
      </div>

      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b-2 border-black">
        <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/">
            <a className="font-display text-2xl font-bold tracking-tighter uppercase italic hover:text-accent transition-colors">
              IRON_AI
            </a>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-mono text-sm font-bold uppercase">
            <a href="#features" className="hover:underline decoration-2 underline-offset-4">Protocol</a>
            <a href="#philosophy" className="hover:underline decoration-2 underline-offset-4">Philosophy</a>
            <a href="#pricing" className="hover:underline decoration-2 underline-offset-4">Membership</a>
            
            <Link href="/dashboard">
              <a className="bg-primary text-primary-foreground px-6 py-2 border-2 border-transparent hover:bg-transparent hover:text-primary hover:border-primary transition-all brutal-shadow-hover">
                Start Training
              </a>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 border-2 border-black hover:bg-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-b-2 border-black bg-background p-4 flex flex-col gap-4 font-mono uppercase font-bold">
            <a href="#features" onClick={() => setIsOpen(false)}>Protocol</a>
            <a href="#philosophy" onClick={() => setIsOpen(false)}>Philosophy</a>
            <a href="#pricing" onClick={() => setIsOpen(false)}>Membership</a>
            <Link href="/dashboard">
              <a className="w-full block text-center bg-primary text-primary-foreground px-6 py-3 border-2 border-transparent hover:bg-accent hover:text-accent-foreground transition-colors">
                Start Training
              </a>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}