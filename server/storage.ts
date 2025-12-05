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
  users,
  workouts,
  workoutExercises,
  sessions,
  sets,
  personalRecords,
  achievements,
  userAchievements,
  streaks,
} from "../shared/schema";
import { randomUUID } from "crypto";
import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// ============================================================================
// STORAGE INTERFACE
// ============================================================================

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User | undefined>;
  
  // Workout template methods
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: string): Promise<boolean>;
  
  // Workout exercises methods
  getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]>;
  addWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise>;
  updateWorkoutExercise(id: string, exercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined>;
  removeWorkoutExercise(id: string): Promise<boolean>;
  
  // Session methods
  getSessions(userId: string, limit?: number): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined>;
  
  // Set methods
  getSets(sessionId: string): Promise<Set[]>;
  createSet(set: InsertSet): Promise<Set>;
  
  // Personal records methods
  getPersonalRecords(userId: string, exerciseId?: string): Promise<PersonalRecord[]>;
  createPersonalRecord(record: InsertPersonalRecord): Promise<PersonalRecord>;
  
  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  
  // Streak methods
  getStreak(userId: string): Promise<Streak | undefined>;
  updateStreak(userId: string, updates: Partial<Streak>): Promise<Streak>;
}

// ============================================================================
// IN-MEMORY STORAGE (Development/Testing)
// ============================================================================

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private workoutsMap: Map<string, Workout> = new Map();
  private workoutExercisesMap: Map<string, WorkoutExercise> = new Map();
  private sessionsMap: Map<string, Session> = new Map();
  private setsMap: Map<string, Set> = new Map();
  private personalRecordsMap: Map<string, PersonalRecord> = new Map();
  private achievementsMap: Map<string, Achievement> = new Map();
  private userAchievementsMap: Map<string, UserAchievement> = new Map();
  private streaksMap: Map<string, Streak> = new Map();

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      name: insertUser.name || null,
      createdAt: now,
      updatedAt: now,
      goal: null,
      heightCm: null,
      weightKg: null,
      frequency: null,
      equipment: null,
      experience: null,
      injuries: null,
      sessionLengthMin: null,
      onboardingCompleted: false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...profile, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Workout methods
  async getWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workoutsMap.values()).filter(w => w.userId === userId);
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workoutsMap.get(id);
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const now = new Date();
    const newWorkout: Workout = {
      id,
      ...workout,
      targetMuscles: workout.targetMuscles || [],
      isActive: workout.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.workoutsMap.set(id, newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const existing = this.workoutsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...workout, updatedAt: new Date() };
    this.workoutsMap.set(id, updated);
    return updated;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    return this.workoutsMap.delete(id);
  }

  // Workout exercises methods
  async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    return Array.from(this.workoutExercisesMap.values())
      .filter(e => e.workoutId === workoutId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async addWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const id = randomUUID();
    const newExercise: WorkoutExercise = {
      id,
      ...exercise,
      targetRpe: exercise.targetRpe || null,
      restSeconds: exercise.restSeconds ?? 90,
      notes: exercise.notes || null,
      createdAt: new Date(),
    };
    this.workoutExercisesMap.set(id, newExercise);
    return newExercise;
  }

  async updateWorkoutExercise(id: string, exercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const existing = this.workoutExercisesMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...exercise };
    this.workoutExercisesMap.set(id, updated);
    return updated;
  }

  async removeWorkoutExercise(id: string): Promise<boolean> {
    return this.workoutExercisesMap.delete(id);
  }

  // Session methods
  async getSessions(userId: string, limit = 50): Promise<Session[]> {
    return Array.from(this.sessionsMap.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessionsMap.get(id);
  }

  async createSession(session: InsertSession): Promise<Session> {
    const id = randomUUID();
    const newSession: Session = {
      id,
      ...session,
      status: session.status || "in_progress",
      startedAt: new Date(),
      completedAt: session.completedAt || null,
      durationSeconds: session.durationSeconds || null,
      totalVolume: session.totalVolume || null,
      exerciseCount: session.exerciseCount || null,
      setCount: session.setCount || null,
      notes: session.notes || null,
    };
    this.sessionsMap.set(id, newSession);
    return newSession;
  }

  async updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined> {
    const existing = this.sessionsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...session };
    this.sessionsMap.set(id, updated);
    return updated;
  }

  // Set methods
  async getSets(sessionId: string): Promise<Set[]> {
    return Array.from(this.setsMap.values())
      .filter(s => s.sessionId === sessionId)
      .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
  }

  async createSet(set: InsertSet): Promise<Set> {
    const id = randomUUID();
    const newSet: Set = {
      id,
      ...set,
      rpe: set.rpe || null,
      isWarmup: set.isWarmup ?? false,
      isPR: set.isPR ?? false,
      notes: set.notes || null,
      completedAt: new Date(),
    };
    this.setsMap.set(id, newSet);
    return newSet;
  }

  // Personal records methods
  async getPersonalRecords(userId: string, exerciseId?: string): Promise<PersonalRecord[]> {
    return Array.from(this.personalRecordsMap.values())
      .filter(pr => pr.userId === userId && (!exerciseId || pr.exerciseId === exerciseId))
      .sort((a, b) => b.achievedAt.getTime() - a.achievedAt.getTime());
  }

  async createPersonalRecord(record: InsertPersonalRecord): Promise<PersonalRecord> {
    const id = randomUUID();
    const newRecord: PersonalRecord = {
      id,
      ...record,
      weight: record.weight || null,
      reps: record.reps || null,
      setId: record.setId || null,
      previousValue: record.previousValue || null,
      achievedAt: new Date(),
    };
    this.personalRecordsMap.set(id, newRecord);
    return newRecord;
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievementsMap.values());
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievementsMap.values())
      .filter(ua => ua.userId === userId);
    
    return userAchievements.map(ua => ({
      ...ua,
      achievement: this.achievementsMap.get(ua.achievementId)!,
    })).filter(ua => ua.achievement);
  }

  async awardAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const key = `${userId}-${achievementId}`;
    const existing = this.userAchievementsMap.get(key);
    if (existing) return existing;
    
    const newAward: UserAchievement = {
      userId,
      achievementId,
      earnedAt: new Date(),
      progress: 1,
    };
    this.userAchievementsMap.set(key, newAward);
    return newAward;
  }

  // Streak methods
  async getStreak(userId: string): Promise<Streak | undefined> {
    return Array.from(this.streaksMap.values()).find(s => s.userId === userId);
  }

  async updateStreak(userId: string, updates: Partial<Streak>): Promise<Streak> {
    let streak = await this.getStreak(userId);
    if (!streak) {
      const id = randomUUID();
      streak = {
        id,
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null,
        streakStartDate: null,
        updatedAt: new Date(),
      };
    }
    const updated = { ...streak, ...updates, updatedAt: new Date() };
    this.streaksMap.set(updated.id, updated);
    return updated;
  }
}

// ============================================================================
// DATABASE STORAGE (Production)
// ============================================================================

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Workout methods
  async getWorkouts(userId: string): Promise<Workout[]> {
    return this.db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(asc(workouts.dayOfWeek));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const result = await this.db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
    return result[0];
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const result = await this.db.insert(workouts).values(workout).returning();
    return result[0];
  }

  async updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const result = await this.db
      .update(workouts)
      .set({ ...workout, updatedAt: new Date() })
      .where(eq(workouts.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const result = await this.db.delete(workouts).where(eq(workouts.id, id)).returning();
    return result.length > 0;
  }

  // Workout exercises methods
  async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    return this.db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
      .orderBy(asc(workoutExercises.orderIndex));
  }

  async addWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const result = await this.db.insert(workoutExercises).values(exercise).returning();
    return result[0];
  }

  async updateWorkoutExercise(id: string, exercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const result = await this.db
      .update(workoutExercises)
      .set(exercise)
      .where(eq(workoutExercises.id, id))
      .returning();
    return result[0];
  }

  async removeWorkoutExercise(id: string): Promise<boolean> {
    const result = await this.db.delete(workoutExercises).where(eq(workoutExercises.id, id)).returning();
    return result.length > 0;
  }

  // Session methods
  async getSessions(userId: string, limit = 50): Promise<Session[]> {
    return this.db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.startedAt))
      .limit(limit);
  }

  async getSession(id: string): Promise<Session | undefined> {
    const result = await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return result[0];
  }

  async createSession(session: InsertSession): Promise<Session> {
    const result = await this.db.insert(sessions).values(session).returning();
    return result[0];
  }

  async updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined> {
    const result = await this.db
      .update(sessions)
      .set(session)
      .where(eq(sessions.id, id))
      .returning();
    return result[0];
  }

  // Set methods
  async getSets(sessionId: string): Promise<Set[]> {
    return this.db
      .select()
      .from(sets)
      .where(eq(sets.sessionId, sessionId))
      .orderBy(asc(sets.completedAt));
  }

  async createSet(set: InsertSet): Promise<Set> {
    const result = await this.db.insert(sets).values(set).returning();
    return result[0];
  }

  // Personal records methods
  async getPersonalRecords(userId: string, exerciseId?: string): Promise<PersonalRecord[]> {
    if (exerciseId) {
      return this.db
        .select()
        .from(personalRecords)
        .where(and(eq(personalRecords.userId, userId), eq(personalRecords.exerciseId, exerciseId)))
        .orderBy(desc(personalRecords.achievedAt));
    }
    return this.db
      .select()
      .from(personalRecords)
      .where(eq(personalRecords.userId, userId))
      .orderBy(desc(personalRecords.achievedAt));
  }

  async createPersonalRecord(record: InsertPersonalRecord): Promise<PersonalRecord> {
    const result = await this.db.insert(personalRecords).values(record).returning();
    return result[0];
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return this.db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const results = await this.db
      .select()
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
    
    return results.map(r => ({
      ...r.user_achievements,
      achievement: r.achievements,
    }));
  }

  async awardAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const result = await this.db
      .insert(userAchievements)
      .values({ userId, achievementId, progress: 1 })
      .onConflictDoNothing()
      .returning();
    
    if (result.length === 0) {
      // Already awarded
      const existing = await this.db
        .select()
        .from(userAchievements)
        .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, achievementId)))
        .limit(1);
      return existing[0];
    }
    return result[0];
  }

  // Streak methods
  async getStreak(userId: string): Promise<Streak | undefined> {
    const result = await this.db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);
    return result[0];
  }

  async updateStreak(userId: string, updates: Partial<Streak>): Promise<Streak> {
    const existing = await this.getStreak(userId);
    
    if (existing) {
      const result = await this.db
        .update(streaks)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(streaks.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await this.db
        .insert(streaks)
        .values({
          userId,
          currentStreak: updates.currentStreak ?? 0,
          longestStreak: updates.longestStreak ?? 0,
          lastWorkoutDate: updates.lastWorkoutDate,
          streakStartDate: updates.streakStartDate,
        })
        .returning();
      return result[0];
    }
  }
}

// ============================================================================
// STORAGE FACTORY
// ============================================================================

import { DataConnectStorage } from "./storage-dataconnect";

function createStorage(): IStorage {
  // Priority 1: Firebase Data Connect (Cloud SQL)
  const useDataConnect = process.env.USE_DATA_CONNECT === "true" || 
                         process.env.DATA_CONNECT_EMULATOR_HOST;
  
  if (useDataConnect && process.env.FIREBASE_PROJECT_ID) {
    console.log("[storage] Using DataConnectStorage (Firebase Data Connect)");
    return new DataConnectStorage();
  }
  
  // Priority 2: Direct PostgreSQL connection (Neon/Drizzle)
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    console.log("[storage] Using DatabaseStorage (PostgreSQL)");
    return new DatabaseStorage(databaseUrl);
  }
  
  // Priority 3: In-memory storage (development fallback)
  console.log("[storage] Using MemStorage (in-memory) - data will not persist!");
  return new MemStorage();
}

export const storage = createStorage();
