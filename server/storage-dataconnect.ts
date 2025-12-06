/**
 * Firebase Data Connect Storage Implementation
 * 
 * This module implements the IStorage interface using Firebase Data Connect
 * for persistent storage in Cloud SQL.
 * 
 * The implementation uses the Data Connect REST API to execute queries and mutations
 * defined in dataconnect/connector/*.gql files.
 */

import { 
  type User, 
  type InsertUser, 
  type UpdateUserProfile,
  type Workout,
  type InsertWorkout,
  type WorkoutExercise,
  type InsertWorkoutExercise,
  type Session,
  type InsertSession,
  type Set,
  type InsertSet,
  type PersonalRecord,
  type InsertPersonalRecord,
  type Achievement,
  type UserAchievement,
  type Streak,
} from "../shared/schema";
import type { IStorage } from "./storage";

// Data Connect configuration
const DATA_CONNECT_SERVICE = "iron-ai-db";
const DATA_CONNECT_LOCATION = "us-central1";
const DATA_CONNECT_CONNECTOR = "default";

// Startup diagnostic - check configuration
console.log(`[dataconnect] === STARTUP DIAGNOSTICS ===`);
console.log(`[dataconnect] FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID || 'NOT SET'}`);
console.log(`[dataconnect] FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? process.env.FIREBASE_CLIENT_EMAIL.substring(0, 30) + '...' : 'NOT SET'}`);
console.log(`[dataconnect] FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? 'SET (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'NOT SET'}`);
console.log(`[dataconnect] DATA_CONNECT_EMULATOR_HOST: ${process.env.DATA_CONNECT_EMULATOR_HOST || 'NOT SET (using production)'}`);
console.log(`[dataconnect] === END DIAGNOSTICS ===`);

// Get Data Connect endpoint URL
function getDataConnectUrl(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  // Use emulator in development
  if (process.env.DATA_CONNECT_EMULATOR_HOST) {
    const [host, port] = process.env.DATA_CONNECT_EMULATOR_HOST.split(":");
    const url = `http://${host}:${port}/v1alpha/projects/${projectId}/locations/${DATA_CONNECT_LOCATION}/services/${DATA_CONNECT_SERVICE}/connectors/${DATA_CONNECT_CONNECTOR}`;
    console.log(`[dataconnect] Using EMULATOR at: ${url}`);
    return url;
  }
  
  // Production endpoint
  const url = `https://firebasedataconnect.googleapis.com/v1alpha/projects/${projectId}/locations/${DATA_CONNECT_LOCATION}/services/${DATA_CONNECT_SERVICE}/connectors/${DATA_CONNECT_CONNECTOR}`;
  console.log(`[dataconnect] Using PRODUCTION endpoint: ${url}`);
  return url;
}

// Execute a Data Connect operation
async function executeOperation<T>(
  operationName: string,
  variables: Record<string, unknown>,
  isQuery: boolean = true
): Promise<T> {
  const url = `${getDataConnectUrl()}:${isQuery ? "executeQuery" : "executeMutation"}`;
  
  const body = {
    name: `projects/${process.env.FIREBASE_PROJECT_ID}/locations/${DATA_CONNECT_LOCATION}/services/${DATA_CONNECT_SERVICE}/connectors/${DATA_CONNECT_CONNECTOR}`,
    operationName,
    variables,
  };

  // Get auth token for production
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Debug: Log environment variable status
  const hasEmulatorHost = !!process.env.DATA_CONNECT_EMULATOR_HOST;
  const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
  const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
  const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
  
  console.log(`[dataconnect] ENV CHECK: emulatorHost=${hasEmulatorHost}, privateKey=${hasPrivateKey}, clientEmail=${hasClientEmail}, projectId=${hasProjectId}`);

  // In production, we need to authenticate with Google Cloud
  if (!process.env.DATA_CONNECT_EMULATOR_HOST && process.env.FIREBASE_PRIVATE_KEY) {
    console.log(`[dataconnect] Attempting production authentication...`);
    console.log(`[dataconnect] Client email: ${process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 20)}...`);
    
    try {
      // For server-side requests, we use service account authentication
      const { GoogleAuth } = await import("google-auth-library");
      const auth = new GoogleAuth({
        credentials: {
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        // Use cloud-platform scope for broader API access
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      if (accessToken.token) {
        headers["Authorization"] = `Bearer ${accessToken.token}`;
        console.log(`[dataconnect] Got access token (${accessToken.token.substring(0, 20)}...)`);
      } else {
        console.error(`[dataconnect] WARNING: No access token returned from GoogleAuth`);
      }
    } catch (authError) {
      console.error(`[dataconnect] AUTH ERROR:`, authError);
      throw new Error(`Data Connect authentication failed: ${authError}`);
    }
  } else if (!process.env.DATA_CONNECT_EMULATOR_HOST) {
    console.error(`[dataconnect] WARNING: No emulator and no FIREBASE_PRIVATE_KEY - requests will be unauthenticated!`);
  }

  console.log(`[dataconnect] Executing ${isQuery ? "query" : "mutation"}: ${operationName}`);
  console.log(`[dataconnect] URL: ${url}`);
  
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  console.log(`[dataconnect] Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const error = await response.text();
    console.error(`[dataconnect] Error executing ${operationName}:`, error);
    throw new Error(`Data Connect error: ${error}`);
  }

  const result = await response.json();
  return result.data as T;
}

// ============================================================================
// DATA CONNECT STORAGE IMPLEMENTATION
// ============================================================================

export class DataConnectStorage implements IStorage {
  
  // ========================================================================
  // USER METHODS
  // Note: Users are stored in Firestore, not Data Connect
  // These methods are pass-through for compatibility
  // ========================================================================

  async getUser(id: string): Promise<User | undefined> {
    // Users are managed via Firestore in firebase.ts
    // This is a placeholder - real implementation uses Firestore
    console.warn("[dataconnect] getUser not implemented - users are in Firestore");
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.warn("[dataconnect] getUserByUsername not implemented - users are in Firestore");
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.warn("[dataconnect] getUserByEmail not implemented - users are in Firestore");
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    console.warn("[dataconnect] createUser not implemented - users are in Firestore");
    throw new Error("Users are managed via Firebase Auth and Firestore");
  }

  async updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User | undefined> {
    console.warn("[dataconnect] updateUserProfile not implemented - users are in Firestore");
    return undefined;
  }

  // ========================================================================
  // WORKOUT METHODS
  // ========================================================================

  async getWorkouts(userId: string): Promise<Workout[]> {
    interface WorkoutResult {
      workouts: Array<{
        id: string;
        userId: string;
        name: string;
        type: string;
        dayOfWeek: number | null;
        estimatedDurationMin: number | null;
        targetMuscles: string[] | null;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      }>;
    }
    
    const result = await executeOperation<WorkoutResult>(
      "GetUserWorkouts",
      { userId },
      true
    );
    
    return result.workouts.map(w => ({
      id: w.id,
      userId: w.userId,
      name: w.name,
      type: w.type,
      dayOfWeek: w.dayOfWeek,
      estimatedDurationMin: w.estimatedDurationMin,
      targetMuscles: w.targetMuscles || [],
      isActive: w.isActive,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
    }));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    interface WorkoutResult {
      workout: {
        id: string;
        userId: string;
        name: string;
        type: string;
        dayOfWeek: number | null;
        estimatedDurationMin: number | null;
        targetMuscles: string[] | null;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      } | null;
    }
    
    const result = await executeOperation<WorkoutResult>(
      "GetWorkout",
      { id },
      true
    );
    
    if (!result.workout) return undefined;
    
    const w = result.workout;
    return {
      id: w.id,
      userId: w.userId,
      name: w.name,
      type: w.type,
      dayOfWeek: w.dayOfWeek,
      estimatedDurationMin: w.estimatedDurationMin,
      targetMuscles: w.targetMuscles || [],
      isActive: w.isActive,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
    };
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    interface CreateWorkoutResult {
      workout_insert: {
        id: string;
      };
    }
    
    const result = await executeOperation<CreateWorkoutResult>(
      "CreateWorkout",
      {
        userId: workout.userId,
        name: workout.name,
        type: workout.type,
        dayOfWeek: workout.dayOfWeek,
        estimatedDurationMin: workout.estimatedDurationMin,
        targetMuscles: workout.targetMuscles,
      },
      false
    );
    
    // Return the created workout
    const created = await this.getWorkout(result.workout_insert.id);
    if (!created) throw new Error("Failed to create workout");
    return created;
  }

  async updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    await executeOperation(
      "UpdateWorkout",
      {
        id,
        ...workout,
      },
      false
    );
    
    return this.getWorkout(id);
  }

  async deleteWorkout(id: string): Promise<boolean> {
    try {
      await executeOperation("DeleteWorkout", { id }, false);
      return true;
    } catch {
      return false;
    }
  }

  // ========================================================================
  // WORKOUT EXERCISES METHODS
  // ========================================================================

  async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    interface ExercisesResult {
      workoutExercises: Array<{
        id: string;
        exerciseId: string;
        exerciseName: string;
        orderIndex: number;
        targetSets: number;
        targetReps: string;
        targetRpe: number | null;
        restSeconds: number | null;
        notes: string | null;
        createdAt: string;
      }>;
    }
    
    const result = await executeOperation<ExercisesResult>(
      "GetWorkoutExercises",
      { workoutId },
      true
    );
    
    return result.workoutExercises.map(e => ({
      id: e.id,
      workoutId,
      exerciseId: e.exerciseId,
      exerciseName: e.exerciseName,
      orderIndex: e.orderIndex,
      targetSets: e.targetSets,
      targetReps: e.targetReps,
      targetRpe: e.targetRpe,
      restSeconds: e.restSeconds,
      notes: e.notes,
      createdAt: new Date(e.createdAt),
    }));
  }

  async addWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    interface AddExerciseResult {
      workoutExercise_insert: {
        id: string;
      };
    }
    
    const result = await executeOperation<AddExerciseResult>(
      "AddWorkoutExercise",
      {
        workoutId: exercise.workoutId,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        orderIndex: exercise.orderIndex,
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
        targetRpe: exercise.targetRpe,
        restSeconds: exercise.restSeconds,
        notes: exercise.notes,
      },
      false
    );
    
    return {
      id: result.workoutExercise_insert.id,
      workoutId: exercise.workoutId,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      orderIndex: exercise.orderIndex,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      targetRpe: exercise.targetRpe ?? null,
      restSeconds: exercise.restSeconds ?? 90,
      notes: exercise.notes ?? null,
      createdAt: new Date(),
    };
  }

  async updateWorkoutExercise(id: string, exercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    console.log(`[storage] updateWorkoutExercise called for id=${id}`, exercise);
    
    if (exercise.exerciseId) {
      console.log(`[storage] Detected SWAP operation for exercise ${id} -> ${exercise.exerciseId}`);
      // Swap operation
      await executeOperation(
        "SwapWorkoutExercise",
        { 
          id, 
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName || "Unknown Exercise" 
        },
        false
      );
    } else {
      console.log(`[storage] Standard UPDATE operation for exercise ${id}`);
      // Standard update (sets, reps, etc.)
      await executeOperation(
        "UpdateWorkoutExercise",
        { 
          id, 
          ...exercise 
        },
        false
      );
    }
    
    // Return a constructed object to satisfy the interface
    // Ideally we would fetch the updated object, but for performance we'll just return what we have
    return {
      id,
      workoutId: exercise.workoutId || "", // This might be missing but is required by type
      exerciseId: exercise.exerciseId || "",
      exerciseName: exercise.exerciseName || "",
      orderIndex: exercise.orderIndex || 0,
      targetSets: exercise.targetSets || 0,
      targetReps: exercise.targetReps || "",
      targetRpe: exercise.targetRpe || null,
      restSeconds: exercise.restSeconds || null,
      notes: exercise.notes || null,
      createdAt: new Date(),
    } as WorkoutExercise;
  }

  async removeWorkoutExercise(id: string): Promise<boolean> {
    try {
      await executeOperation("RemoveWorkoutExercise", { id }, false);
      return true;
    } catch {
      return false;
    }
  }

  // ========================================================================
  // SESSION METHODS
  // ========================================================================

  async getSessions(userId: string, limit = 50): Promise<Session[]> {
    interface SessionsResult {
      sessions: Array<{
        id: string;
        userId: string;
        workoutName: string;
        status: string;
        startedAt: string;
        completedAt: string | null;
        durationSeconds: number | null;
        totalVolume: number | null;
        exerciseCount: number | null;
        setCount: number | null;
        notes: string | null;
        workout: { id: string } | null;
      }>;
    }
    
    const result = await executeOperation<SessionsResult>(
      "GetUserSessions",
      { userId, limit },
      true
    );
    
    return result.sessions.map(s => ({
      id: s.id,
      userId: s.userId,
      workoutId: s.workout?.id ?? null,
      workoutName: s.workoutName,
      status: s.status,
      startedAt: new Date(s.startedAt),
      completedAt: s.completedAt ? new Date(s.completedAt) : null,
      durationSeconds: s.durationSeconds,
      totalVolume: s.totalVolume,
      exerciseCount: s.exerciseCount,
      setCount: s.setCount,
      notes: s.notes,
    }));
  }

  async getSession(id: string): Promise<Session | undefined> {
    interface SessionResult {
      session: {
        id: string;
        userId: string;
        workoutName: string;
        status: string;
        startedAt: string;
        completedAt: string | null;
        durationSeconds: number | null;
        totalVolume: number | null;
        exerciseCount: number | null;
        setCount: number | null;
        notes: string | null;
        workout: { id: string } | null;
      } | null;
    }
    
    const result = await executeOperation<SessionResult>(
      "GetSession",
      { id },
      true
    );
    
    if (!result.session) return undefined;
    
    const s = result.session;
    return {
      id: s.id,
      userId: s.userId,
      workoutId: s.workout?.id ?? null,
      workoutName: s.workoutName,
      status: s.status,
      startedAt: new Date(s.startedAt),
      completedAt: s.completedAt ? new Date(s.completedAt) : null,
      durationSeconds: s.durationSeconds,
      totalVolume: s.totalVolume,
      exerciseCount: s.exerciseCount,
      setCount: s.setCount,
      notes: s.notes,
    };
  }

  async createSession(session: InsertSession): Promise<Session> {
    interface StartSessionResult {
      session_insert: {
        id: string;
      };
    }
    
    const result = await executeOperation<StartSessionResult>(
      "StartSession",
      {
        userId: session.userId,
        workoutId: session.workoutId,
        workoutName: session.workoutName,
      },
      false
    );
    
    return {
      id: result.session_insert.id,
      userId: session.userId,
      workoutId: session.workoutId ?? null,
      workoutName: session.workoutName,
      status: "in_progress",
      startedAt: new Date(),
      completedAt: null,
      durationSeconds: null,
      totalVolume: null,
      exerciseCount: null,
      setCount: null,
      notes: null,
    };
  }

  async updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined> {
    await executeOperation(
      "UpdateSession",
      {
        id,
        status: session.status,
        completedAt: session.completedAt,
        durationSeconds: session.durationSeconds,
        totalVolume: session.totalVolume,
        exerciseCount: session.exerciseCount,
        setCount: session.setCount,
        notes: session.notes,
      },
      false
    );
    
    return this.getSession(id);
  }

  // ========================================================================
  // SET METHODS
  // ========================================================================

  async getSets(sessionId: string): Promise<Set[]> {
    interface SetsResult {
      sets: Array<{
        id: string;
        exerciseId: string;
        exerciseName: string;
        setNumber: number;
        weight: number;
        reps: number;
        rpe: number | null;
        isWarmup: boolean;
        isPR: boolean;
        notes: string | null;
        completedAt: string;
      }>;
    }
    
    const result = await executeOperation<SetsResult>(
      "GetSessionSets",
      { sessionId },
      true
    );
    
    return result.sets.map(s => ({
      id: s.id,
      sessionId,
      exerciseId: s.exerciseId,
      exerciseName: s.exerciseName,
      setNumber: s.setNumber,
      weight: s.weight,
      reps: s.reps,
      rpe: s.rpe,
      isWarmup: s.isWarmup,
      isPR: s.isPR,
      notes: s.notes,
      completedAt: new Date(s.completedAt),
    }));
  }

  async createSet(set: InsertSet): Promise<Set> {
    interface LogSetResult {
      set_insert: {
        id: string;
      };
    }
    
    const result = await executeOperation<LogSetResult>(
      "LogSet",
      {
        sessionId: set.sessionId,
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName,
        setNumber: set.setNumber,
        weight: set.weight,
        reps: set.reps,
        rpe: set.rpe,
        isWarmup: set.isWarmup,
        isPR: set.isPR,
        notes: set.notes,
      },
      false
    );
    
    return {
      id: result.set_insert.id,
      sessionId: set.sessionId,
      exerciseId: set.exerciseId,
      exerciseName: set.exerciseName,
      setNumber: set.setNumber,
      weight: set.weight,
      reps: set.reps,
      rpe: set.rpe ?? null,
      isWarmup: set.isWarmup ?? false,
      isPR: set.isPR ?? false,
      notes: set.notes ?? null,
      completedAt: new Date(),
    };
  }

  // ========================================================================
  // PERSONAL RECORDS METHODS
  // ========================================================================

  async getPersonalRecords(userId: string, exerciseId?: string): Promise<PersonalRecord[]> {
    const operationName = exerciseId ? "GetExercisePRs" : "GetUserPRs";
    const variables = exerciseId ? { userId, exerciseId } : { userId };
    
    interface PRsResult {
      personalRecords: Array<{
        id: string;
        exerciseId: string;
        exerciseName: string;
        recordType: string;
        value: number;
        weight: number | null;
        reps: number | null;
        setId: string | null;
        achievedAt: string;
        previousValue: number | null;
      }>;
    }
    
    const result = await executeOperation<PRsResult>(operationName, variables, true);
    
    return result.personalRecords.map(pr => ({
      id: pr.id,
      userId,
      exerciseId: pr.exerciseId,
      exerciseName: pr.exerciseName,
      recordType: pr.recordType,
      value: pr.value,
      weight: pr.weight,
      reps: pr.reps,
      setId: pr.setId,
      achievedAt: new Date(pr.achievedAt),
      previousValue: pr.previousValue,
    }));
  }

  async createPersonalRecord(record: InsertPersonalRecord): Promise<PersonalRecord> {
    interface CreatePRResult {
      personalRecord_insert: {
        id: string;
      };
    }
    
    const result = await executeOperation<CreatePRResult>(
      "CreatePR",
      {
        userId: record.userId,
        exerciseId: record.exerciseId,
        exerciseName: record.exerciseName,
        recordType: record.recordType,
        value: record.value,
        weight: record.weight,
        reps: record.reps,
        setId: record.setId,
        previousValue: record.previousValue,
      },
      false
    );
    
    return {
      id: result.personalRecord_insert.id,
      userId: record.userId,
      exerciseId: record.exerciseId,
      exerciseName: record.exerciseName,
      recordType: record.recordType,
      value: record.value,
      weight: record.weight ?? null,
      reps: record.reps ?? null,
      setId: record.setId ?? null,
      achievedAt: new Date(),
      previousValue: record.previousValue ?? null,
    };
  }

  // ========================================================================
  // ACHIEVEMENT METHODS
  // ========================================================================

  async getAchievements(): Promise<Achievement[]> {
    interface AchievementsResult {
      achievements: Array<{
        id: string;
        name: string;
        description: string;
        category: string;
        icon: string | null;
        requirementType: string;
        requirementTarget: number;
        requirementExerciseId: string | null;
        xpReward: number;
        isSecret: boolean;
      }>;
    }
    
    const result = await executeOperation<AchievementsResult>(
      "GetAllAchievements",
      {},
      true
    );
    
    return result.achievements.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      category: a.category,
      icon: a.icon,
      requirement: {
        type: a.requirementType,
        target: a.requirementTarget,
        exerciseId: a.requirementExerciseId ?? undefined,
      },
      xpReward: a.xpReward,
      isSecret: a.isSecret,
    }));
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    interface UserAchievementsResult {
      userAchievements: Array<{
        id: string;
        earnedAt: string;
        progress: number;
        achievement: {
          id: string;
          name: string;
          description: string;
          category: string;
          icon: string | null;
          xpReward: number;
        };
      }>;
    }
    
    const result = await executeOperation<UserAchievementsResult>(
      "GetUserAchievements",
      { userId },
      true
    );
    
    return result.userAchievements.map(ua => ({
      userId,
      achievementId: ua.achievement.id,
      earnedAt: new Date(ua.earnedAt),
      progress: ua.progress,
      achievement: {
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        category: ua.achievement.category,
        icon: ua.achievement.icon,
        requirement: { type: "", target: 0 }, // Not returned by query
        xpReward: ua.achievement.xpReward,
        isSecret: false,
      },
    }));
  }

  async awardAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    interface AwardResult {
      userAchievement_insert: {
        id: string;
      };
    }
    
    try {
      await executeOperation<AwardResult>(
        "AwardAchievement",
        {
          userId,
          achievementId,
          progress: 1,
        },
        false
      );
    } catch {
      // Already awarded - ignore
    }
    
    return {
      userId,
      achievementId,
      earnedAt: new Date(),
      progress: 1,
    };
  }

  // ========================================================================
  // STREAK METHODS
  // ========================================================================

  async getStreak(userId: string): Promise<Streak | undefined> {
    interface StreakResult {
      streaks: Array<{
        id: string;
        currentStreak: number;
        longestStreak: number;
        lastWorkoutDate: string | null;
        streakStartDate: string | null;
        updatedAt: string;
      }>;
    }
    
    const result = await executeOperation<StreakResult>(
      "GetUserStreak",
      { userId },
      true
    );
    
    if (result.streaks.length === 0) return undefined;
    
    const s = result.streaks[0];
    return {
      id: s.id,
      userId,
      currentStreak: s.currentStreak,
      longestStreak: s.longestStreak,
      lastWorkoutDate: s.lastWorkoutDate ? new Date(s.lastWorkoutDate) : null,
      streakStartDate: s.streakStartDate ? new Date(s.streakStartDate) : null,
      updatedAt: new Date(s.updatedAt),
    };
  }

  async updateStreak(userId: string, updates: Partial<Streak>): Promise<Streak> {
    const existing = await this.getStreak(userId);
    
    if (existing) {
      // Update existing streak
      await executeOperation(
        "UpdateStreak",
        {
          id: existing.id,
          currentStreak: updates.currentStreak ?? existing.currentStreak,
          longestStreak: updates.longestStreak ?? existing.longestStreak,
          lastWorkoutDate: updates.lastWorkoutDate?.toISOString(),
          streakStartDate: updates.streakStartDate?.toISOString(),
        },
        false
      );
      
      return {
        ...existing,
        ...updates,
        updatedAt: new Date(),
      };
    } else {
      // Create new streak
      interface CreateStreakResult {
        streak_insert: {
          id: string;
        };
      }
      
      const result = await executeOperation<CreateStreakResult>(
        "CreateStreak",
        {
          userId,
          currentStreak: updates.currentStreak ?? 0,
          longestStreak: updates.longestStreak ?? 0,
          lastWorkoutDate: updates.lastWorkoutDate?.toISOString(),
          streakStartDate: updates.streakStartDate?.toISOString(),
        },
        false
      );
      
      return {
        id: result.streak_insert.id,
        userId,
        currentStreak: updates.currentStreak ?? 0,
        longestStreak: updates.longestStreak ?? 0,
        lastWorkoutDate: updates.lastWorkoutDate ?? null,
        streakStartDate: updates.streakStartDate ?? null,
        updatedAt: new Date(),
      };
    }
  }
}

// Export singleton instance
export const dataConnectStorage = new DataConnectStorage();

