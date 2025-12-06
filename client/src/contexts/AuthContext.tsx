import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthChange,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  firebaseSignOut,
  getUserProfile,
  isFirebaseConfigured,
  type FirebaseUser,
  type UserProfile,
} from "@/lib/firebase";
import { queryClient } from "@/lib/queryClient";

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  // Firebase user (auth state)
  firebaseUser: FirebaseUser | null;
  // Firestore user profile (with preferences)
  userProfile: UserProfile | null;
  // Loading states
  isLoading: boolean;
  isProfileLoading: boolean;
  // Computed states
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  isReady: boolean; // True when both auth AND profile are loaded
  // Auth methods
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Profile methods
  refetchProfile: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      console.warn("[AuthContext] Firebase not configured - auth disabled");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (user) => {
      console.log("[AuthContext] Auth state changed:", user?.email || "signed out");
      setFirebaseUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        setIsProfileLoading(true);
        try {
          const profile = await getUserProfile(user.uid);
          console.log("[AuthContext] Profile loaded:", profile?.onboardingCompleted);
          setUserProfile(profile);
        } catch (error) {
          console.error("[AuthContext] Failed to fetch profile:", error);
          setUserProfile(null);
        }
        setIsProfileLoading(false);
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refetch profile (used after onboarding)
  const refetchProfile = async () => {
    if (!firebaseUser) return;
    
    setIsProfileLoading(true);
    try {
      const profile = await getUserProfile(firebaseUser.uid);
      console.log("[AuthContext] Profile refetched:", profile?.onboardingCompleted);
      setUserProfile(profile);
    } catch (error) {
      console.error("[AuthContext] Failed to refetch profile:", error);
    }
    setIsProfileLoading(false);
  };

  // Auth methods
  const loginWithGoogle = async () => {
    // Clear cached data from previous user before login
    queryClient.clear();
    setIsProfileLoading(true); // Set loading before auth completes
    await signInWithGoogle();
    // Profile will be fetched by onAuthChange listener
  };

  const loginWithEmail = async (email: string, password: string) => {
    // Clear cached data from previous user before login
    queryClient.clear();
    setIsProfileLoading(true);
    await signInWithEmail(email, password);
    // Profile will be fetched by onAuthChange listener
  };

  const registerWithEmailPassword = async (email: string, password: string) => {
    // Clear cached data from previous user before registration
    queryClient.clear();
    setIsProfileLoading(true);
    await registerWithEmail(email, password);
    // Profile will be created and fetched by onAuthChange listener
  };

  const logout = async () => {
    await firebaseSignOut();
    setUserProfile(null);
    // Clear all cached queries to ensure data isolation between users
    queryClient.clear();
  };

  // Computed states
  const isAuthenticated = !!firebaseUser;
  
  // isReady = auth check complete AND (not authenticated OR profile loaded)
  const isReady = !isLoading && (!isAuthenticated || (!isProfileLoading && userProfile !== undefined));
  
  // needsOnboarding: user is authenticated AND has a profile AND hasn't completed onboarding
  // If profile is null but user exists, they're a new user who needs onboarding
  const needsOnboarding = isAuthenticated && (
    userProfile === null || // New user, profile not created yet or failed to load
    (userProfile && !userProfile.onboardingCompleted) // Profile exists but not onboarded
  );

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isLoading,
        isProfileLoading,
        isAuthenticated,
        needsOnboarding,
        isReady,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailPassword,
        logout,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================================================
// LEGACY COMPATIBILITY (for components still using old API)
// ============================================================================

// Re-export UserProfile type for components
export type { UserProfile };

// Legacy User type alias for backwards compatibility
export interface User {
  id: string;
  username: string;
  email: string | null;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  goal: string | null;
  heightCm: number | null;
  weightKg: number | null;
  frequency: number | null;
  equipment: string | null;
  experience: string | null;
  injuries: string | null;
  sessionLengthMin: number | null;
  onboardingCompleted: boolean | null;
}

// Helper to convert Firebase profile to legacy User format
export function profileToLegacyUser(profile: UserProfile | null): User | null {
  if (!profile) return null;
  
  return {
    id: profile.uid,
    username: profile.email || profile.displayName || "Unknown",
    email: profile.email,
    name: profile.displayName,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    goal: profile.preferences?.goal || null,
    heightCm: profile.preferences?.heightCm || null,
    weightKg: profile.preferences?.weightKg || null,
    frequency: profile.preferences?.frequency || null,
    equipment: profile.preferences?.equipment || null,
    experience: profile.preferences?.experience || null,
    injuries: profile.preferences?.injuries || null,
    sessionLengthMin: profile.preferences?.sessionLengthMin || null,
    onboardingCompleted: profile.onboardingCompleted,
  };
}
