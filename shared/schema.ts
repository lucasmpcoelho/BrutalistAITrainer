import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  real,
  jsonb,
  primaryKey
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ============================================================================
// USERS TABLE (Extended with onboarding preferences)
// ============================================================================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Onboarding preferences
  goal: text("goal"), // "hypertrophy" | "strength" | "fat_loss" | "general"
  heightCm: integer("height_cm"),
  weightKg: real("weight_kg"),
  frequency: integer("frequency"), // days per week (3-6)
  equipment: text("equipment"), // "full_gym" | "home_gym" | "bodyweight"
  experience: text("experience"), // "beginner" | "intermediate" | "advanced"
  injuries: text("injuries"), // "none" | "upper" | "lower" | "back"
  sessionLengthMin: integer("session_length_min"), // minutes per session
  onboardingCompleted: boolean("onboarding_completed").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  sessions: many(sessions),
  personalRecords: many(personalRecords),
  userAchievements: many(userAchievements),
  streaks: many(streaks),
  conversations: many(conversations),
}));

// ============================================================================
// WORKOUTS TABLE (User's workout templates/plans)
// ============================================================================

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Push Day", "Leg Day"
  type: text("type").notNull(), // "PUSH" | "PULL" | "LEGS" | "UPPER" | "LOWER" | "FULL" | "REST"
  dayOfWeek: integer("day_of_week"), // 0 = Sunday, 1 = Monday, etc.
  estimatedDurationMin: integer("estimated_duration_min"),
  targetMuscles: jsonb("target_muscles").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  exercises: many(workoutExercises),
  sessions: many(sessions),
}));

// ============================================================================
// WORKOUT_EXERCISES TABLE (Exercises within a workout template)
// ============================================================================

export const workoutExercises = pgTable("workout_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull(), // References Firestore exercise ID
  exerciseName: text("exercise_name").notNull(), // Denormalized for display
  orderIndex: integer("order_index").notNull(), // Order within the workout
  targetSets: integer("target_sets").notNull().default(3),
  targetReps: text("target_reps").notNull().default("8-12"), // Can be range like "8-12" or single "5"
  targetRpe: real("target_rpe"), // Rate of Perceived Exertion (1-10)
  restSeconds: integer("rest_seconds").default(90),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
}));

// ============================================================================
// SESSIONS TABLE (Completed workout instances)
// ============================================================================

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutId: varchar("workout_id").references(() => workouts.id, { onDelete: "set null" }),
  workoutName: text("workout_name").notNull(), // Denormalized
  status: text("status").notNull().default("in_progress"), // "in_progress" | "completed" | "abandoned"
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  durationSeconds: integer("duration_seconds"),
  totalVolume: real("total_volume"), // Total weight × reps
  exerciseCount: integer("exercise_count"),
  setCount: integer("set_count"),
  notes: text("notes"),
});

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [sessions.workoutId],
    references: [workouts.id],
  }),
  sets: many(sets),
}));

// ============================================================================
// SETS TABLE (Individual logged sets)
// ============================================================================

export const sets = pgTable("sets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull(), // References Firestore exercise ID
  exerciseName: text("exercise_name").notNull(), // Denormalized
  setNumber: integer("set_number").notNull(), // 1, 2, 3, etc.
  weight: real("weight").notNull(), // In kg
  reps: integer("reps").notNull(),
  rpe: real("rpe"), // Rate of Perceived Exertion (1-10)
  isWarmup: boolean("is_warmup").default(false),
  isPR: boolean("is_pr").default(false), // Personal Record flag
  notes: text("notes"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const setsRelations = relations(sets, ({ one }) => ({
  session: one(sessions, {
    fields: [sets.sessionId],
    references: [sessions.id],
  }),
}));

// ============================================================================
// PERSONAL_RECORDS TABLE (PRs per exercise)
// ============================================================================

export const personalRecords = pgTable("personal_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull(), // References Firestore exercise ID
  exerciseName: text("exercise_name").notNull(), // Denormalized
  recordType: text("record_type").notNull(), // "1rm" | "max_weight" | "max_reps" | "max_volume"
  value: real("value").notNull(), // The PR value
  weight: real("weight"), // Weight used (for max_reps)
  reps: integer("reps"), // Reps performed (for max_weight)
  setId: varchar("set_id").references(() => sets.id, { onDelete: "set null" }),
  achievedAt: timestamp("achieved_at").defaultNow().notNull(),
  previousValue: real("previous_value"), // For tracking improvement
});

export const personalRecordsRelations = relations(personalRecords, ({ one }) => ({
  user: one(users, {
    fields: [personalRecords.userId],
    references: [users.id],
  }),
  set: one(sets, {
    fields: [personalRecords.setId],
    references: [sets.id],
  }),
}));

// ============================================================================
// ACHIEVEMENTS TABLE (Achievement definitions)
// ============================================================================

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "consistency" | "strength" | "volume" | "milestone"
  icon: text("icon"), // Icon name or emoji
  requirement: jsonb("requirement").$type<{
    type: string;
    target: number;
    exerciseId?: string;
  }>().notNull(),
  xpReward: integer("xp_reward").default(100),
  isSecret: boolean("is_secret").default(false),
});

// ============================================================================
// USER_ACHIEVEMENTS TABLE (Earned achievements)
// ============================================================================

export const userAchievements = pgTable("user_achievements", {
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  progress: real("progress").default(0), // 0-1 for partial progress
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.achievementId] }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// ============================================================================
// STREAKS TABLE (Consecutive workout days tracking)
// ============================================================================

export const streaks = pgTable("streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastWorkoutDate: timestamp("last_workout_date"),
  streakStartDate: timestamp("streak_start_date"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const streaksRelations = relations(streaks, ({ one }) => ({
  user: one(users, {
    fields: [streaks.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// CONVERSATIONS TABLE (AI Coach chat sessions)
// ============================================================================

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"), // Auto-generated from first message or null
  status: text("status").notNull().default("active"), // "active" | "archived"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

// ============================================================================
// MESSAGES TABLE (Individual chat messages within conversations)
// ============================================================================

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" | "assistant" | "system"
  content: text("content").notNull(),
  toolCalls: jsonb("tool_calls").$type<{
    name: string;
    arguments: Record<string, unknown>;
    result?: unknown;
  }[]>(), // For Gemini function calling results
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// ============================================================================
// ZOD SCHEMAS & TYPES
// ============================================================================

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const updateUserProfileSchema = createInsertSchema(users).pick({
  name: true,
  goal: true,
  heightCm: true,
  weightKg: true,
  frequency: true,
  equipment: true,
  experience: true,
  injuries: true,
  sessionLengthMin: true,
  onboardingCompleted: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type User = typeof users.$inferSelect;

// Workout schemas
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;

// Session schemas
export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startedAt: true,
});

export const insertSetSchema = createInsertSchema(sets).omit({
  id: true,
  completedAt: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertSet = z.infer<typeof insertSetSchema>;
export type Session = typeof sessions.$inferSelect;
export type Set = typeof sets.$inferSelect;

// Personal Record schemas
export const insertPersonalRecordSchema = createInsertSchema(personalRecords).omit({
  id: true,
  achievedAt: true,
});

export type InsertPersonalRecord = z.infer<typeof insertPersonalRecordSchema>;
export type PersonalRecord = typeof personalRecords.$inferSelect;

// Achievement schemas
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

// Streak schemas
export type Streak = typeof streaks.$inferSelect;

// Conversation schemas
export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
