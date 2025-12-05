/**
 * Firebase Client Configuration
 * 
 * Initializes Firebase for client-side authentication and Firestore.
 * 
 * Setup Instructions:
 * 1. Go to Firebase Console → Project Settings → General
 * 2. Scroll to "Your apps" and add a Web app if not already added
 * 3. Copy the firebaseConfig values to your .env file with VITE_ prefix
 * 
 * Required environment variables (in .env):
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  type Auth
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  type Firestore
} from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

if (isFirebaseConfigured()) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("[firebase] Client initialized");
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  console.warn("[firebase] Client not configured - missing environment variables");
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// ============================================================================
// USER PROFILE TYPES
// ============================================================================

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
  preferences?: {
    goal?: string;
    heightCm?: number;
    weightKg?: number;
    frequency?: number;
    equipment?: string;
    experience?: string;
    injuries?: string;
    sessionLengthMin?: number;
    workoutDays?: number[]; // Days user wants to train (0=Sun, 1=Mon, ..., 6=Sat)
  };
}

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

/**
 * Sign in with Google popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  const result = await signInWithPopup(auth, googleProvider);
  
  // Create/update user profile in Firestore
  await createOrUpdateUserProfile(result.user);
  
  return result.user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Register with email and password
 */
export async function registerWithEmail(email: string, password: string): Promise<FirebaseUser> {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile in Firestore
  await createOrUpdateUserProfile(result.user);
  
  return result.user;
}

/**
 * Sign out
 */
export async function firebaseSignOut(): Promise<void> {
  if (!auth) throw new Error("Firebase Auth not initialized");
  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) {
    console.warn("[firebase] Auth not initialized, returning no-op unsubscribe");
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth?.currentUser ?? null;
}

/**
 * Get current user's ID token for API requests
 */
export async function getIdToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;
  return user.getIdToken();
}

// ============================================================================
// FIRESTORE USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Create or update user profile in Firestore
 */
export async function createOrUpdateUserProfile(user: FirebaseUser): Promise<UserProfile> {
  if (!firestore) throw new Error("Firestore not initialized");
  
  const userRef = doc(firestore, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: serverTimestamp(),
    });
    return userSnap.data() as UserProfile;
  } else {
    // Create new user
    const newProfile: Omit<UserProfile, "createdAt" | "updatedAt"> & { createdAt: any; updatedAt: any } = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      onboardingCompleted: false,
    };
    await setDoc(userRef, newProfile);
    return {
      ...newProfile,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserProfile;
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!firestore) throw new Error("Firestore not initialized");
  
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;
  
  const data = userSnap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as UserProfile;
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  if (!firestore) throw new Error("Firestore not initialized");
  
  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Save onboarding preferences
 */
export async function saveOnboardingPreferences(
  uid: string,
  preferences: UserProfile["preferences"]
): Promise<void> {
  if (!firestore) throw new Error("Firestore not initialized");
  
  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, {
    preferences,
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  });
}

// Export instances
export { auth, firestore, app };
export type { FirebaseUser };

