import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Terminal, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHaptics } from "@/hooks/use-haptics";
import { isFirebaseConfigured } from "@/lib/firebase";

type Mode = "login" | "register";

// Google icon SVG component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmailPassword, 
    isAuthenticated,
    needsOnboarding,
    isLoading,
    isProfileLoading,
    isReady
  } = useAuth();
  const { vibrate } = useHaptics();
  const [, setLocation] = useLocation();
  
  // Redirect based on auth state - wait for both auth AND profile to be ready
  useEffect(() => {
    console.log("[Auth] State check:", { isReady, isAuthenticated, needsOnboarding, isProfileLoading });
    
    if (isReady && isAuthenticated) {
      if (needsOnboarding) {
        console.log("[Auth] Redirecting to onboarding");
        setLocation("/onboarding");
      } else {
        console.log("[Auth] Redirecting to dashboard");
        setLocation("/dashboard");
      }
    }
  }, [isAuthenticated, needsOnboarding, isReady, setLocation]);
  
  // Show loading while checking auth OR loading profile after sign-in
  if (isLoading || (isAuthenticated && isProfileLoading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-gray-500">
            {isProfileLoading ? "LOADING PROFILE..." : "INITIALIZING..."}
          </p>
        </div>
      </div>
    );
  }
  
  const handleGoogleSignIn = async () => {
    setError("");
    setIsSubmitting(true);
    vibrate("light");
    
    try {
      await loginWithGoogle();
      vibrate("success");
      // Redirect handled by useEffect
    } catch (err) {
      vibrate("error");
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    vibrate("light");
    
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmailPassword(email, password);
      }
      vibrate("success");
      // Redirect handled by useEffect
    } catch (err) {
      vibrate("error");
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      // Parse Firebase error messages
      if (errorMessage.includes("auth/invalid-credential")) {
        setError("Invalid email or password");
      } else if (errorMessage.includes("auth/email-already-in-use")) {
        setError("Email already registered");
      } else if (errorMessage.includes("auth/weak-password")) {
        setError("Password must be at least 6 characters");
      } else if (errorMessage.includes("auth/invalid-email")) {
        setError("Invalid email address");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleMode = () => {
    vibrate("light");
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };
  
  const firebaseReady = isFirebaseConfigured();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-6 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black tracking-tight">IRON_AI</h1>
            <p className="text-xs font-mono text-gray-500 uppercase">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Terminal Header */}
          <div className="bg-black text-white p-4 font-mono text-sm">
            <span className="text-green-400">$</span>{" "}
            {mode === "login" ? "authenticate --returning-user" : "initialize --new-user"}
            <span className="animate-pulse ml-1">_</span>
          </div>
          
          {/* Auth Container */}
          <div className="border-2 border-black border-t-0 p-6 bg-gray-50">
            
            {!firebaseReady ? (
              // Firebase not configured message
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 border-2 border-yellow-500 mx-auto mb-4 flex items-center justify-center">
                  <Terminal className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="font-display font-bold text-lg mb-2">Setup Required</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Firebase is not configured. Add your Firebase config to .env file.
                </p>
                <pre className="text-left text-xs bg-gray-100 p-3 border overflow-x-auto">
{`VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`}
                </pre>
              </div>
            ) : !showEmailForm ? (
              // Primary Auth Options
              <div className="space-y-4">
                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-white text-black font-display font-bold text-base
                    border-2 border-black
                    hover:bg-gray-100 active:translate-x-1 active:translate-y-1
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all touch-manipulation
                    flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <GoogleIcon className="w-5 h-5" />
                      Continue with Google
                    </>
                  )}
                </button>
                
                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="text-xs font-mono text-gray-400 uppercase">or</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                
                {/* Email Option */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gray-100 text-gray-700 font-mono text-sm uppercase
                    border-2 border-gray-300
                    hover:bg-gray-200 hover:border-gray-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all touch-manipulation
                    flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Continue with Email
                </button>
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-500 p-3 font-mono text-sm text-red-600">
                    <span className="text-red-500">[ERROR]</span> {error}
                  </div>
                )}
              </div>
            ) : (
              // Email Form
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm(false);
                    setError("");
                  }}
                  className="text-sm font-mono text-gray-500 hover:text-black transition-colors"
                >
                  ← Back to options
                </button>
                
                {/* Email */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-black font-mono text-lg
                      focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                      bg-white"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Password */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 pr-12 border-2 border-black font-mono text-lg
                        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                        bg-white"
                      placeholder="••••••••"
                      required
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1
                        hover:bg-gray-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-500 p-3 font-mono text-sm text-red-600">
                    <span className="text-red-500">[ERROR]</span> {error}
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-black text-white font-display font-bold text-lg uppercase
                    border-2 border-black
                    hover:bg-gray-900 active:translate-x-1 active:translate-y-1
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all touch-manipulation
                    flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
                
                {/* Toggle Mode */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={isSubmitting}
                    className="font-mono text-sm text-gray-600 hover:text-black transition-colors
                      disabled:opacity-50"
                  >
                    {mode === "login" ? (
                      <>Need an account? <span className="underline">Register</span></>
                    ) : (
                      <>Have an account? <span className="underline">Sign In</span></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Footer Info */}
          <div className="mt-4 text-center font-mono text-xs text-gray-400 uppercase">
            Secure Connection via Firebase
          </div>
        </div>
      </main>
    </div>
  );
}
