import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Achievement_Key {
  id: string;
  __typename?: 'Achievement_Key';
}

export interface AddWorkoutExerciseData {
  workoutExercise_insert: WorkoutExercise_Key;
}

export interface AddWorkoutExerciseVariables {
  workoutId: UUIDString;
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  targetSets: number;
  targetReps: string;
  targetRpe?: number | null;
  restSeconds?: number | null;
  notes?: string | null;
}

export interface AwardAchievementData {
  userAchievement_insert: UserAchievement_Key;
}

export interface AwardAchievementVariables {
  userId: string;
  achievementId: string;
  progress?: number | null;
}

export interface CreateAchievementData {
  achievement_insert: Achievement_Key;
}

export interface CreateAchievementVariables {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string | null;
  requirementType: string;
  requirementTarget: number;
  requirementExerciseId?: string | null;
  xpReward?: number | null;
  isSecret?: boolean | null;
}

export interface CreatePrData {
  personalRecord_insert: PersonalRecord_Key;
}

export interface CreatePrVariables {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  recordType: string;
  value: number;
  weight?: number | null;
  reps?: number | null;
  setId?: UUIDString | null;
  previousValue?: number | null;
}

export interface CreateStreakData {
  streak_insert: Streak_Key;
}

export interface CreateStreakVariables {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: TimestampString | null;
  streakStartDate?: TimestampString | null;
}

export interface CreateWorkoutData {
  workout_insert: Workout_Key;
}

export interface CreateWorkoutVariables {
  userId: string;
  name: string;
  type: string;
  dayOfWeek?: number | null;
  estimatedDurationMin?: number | null;
  targetMuscles?: string[] | null;
}

export interface DeleteUserWorkoutsData {
  workout_deleteMany: number;
}

export interface DeleteUserWorkoutsVariables {
  userId: string;
}

export interface DeleteWorkoutData {
  workout_delete?: Workout_Key | null;
}

export interface DeleteWorkoutVariables {
  id: UUIDString;
}

export interface GetAllAchievementsData {
  achievements: ({
    id: string;
    name: string;
    description: string;
    category: string;
    icon?: string | null;
    requirementType: string;
    requirementTarget: number;
    xpReward?: number | null;
    isSecret?: boolean | null;
  } & Achievement_Key)[];
}

export interface GetExercisePRsData {
  personalRecords: ({
    id: UUIDString;
    recordType: string;
    value: number;
    weight?: number | null;
    reps?: number | null;
    achievedAt: TimestampString;
    previousValue?: number | null;
  } & PersonalRecord_Key)[];
}

export interface GetExercisePRsVariables {
  userId: string;
  exerciseId: string;
}

export interface GetSessionData {
  session?: {
    id: UUIDString;
    userId: string;
    workoutName: string;
    status: string;
    startedAt: TimestampString;
    completedAt?: TimestampString | null;
    durationSeconds?: number | null;
    totalVolume?: number | null;
    exerciseCount?: number | null;
    setCount?: number | null;
    notes?: string | null;
    workout?: {
      id: UUIDString;
      name: string;
      type: string;
    } & Workout_Key;
      sets_on_session: ({
        id: UUIDString;
        exerciseId: string;
        exerciseName: string;
        setNumber: number;
        weight: number;
        reps: number;
        rpe?: number | null;
        isWarmup?: boolean | null;
        isPR?: boolean | null;
        notes?: string | null;
        completedAt: TimestampString;
      } & Set_Key)[];
  } & Session_Key;
}

export interface GetSessionSetsData {
  sets: ({
    id: UUIDString;
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    weight: number;
    reps: number;
    rpe?: number | null;
    isWarmup?: boolean | null;
    isPR?: boolean | null;
    notes?: string | null;
    completedAt: TimestampString;
  } & Set_Key)[];
}

export interface GetSessionSetsVariables {
  sessionId: UUIDString;
}

export interface GetSessionVariables {
  id: UUIDString;
}

export interface GetUserAchievementsData {
  userAchievements: ({
    id: UUIDString;
    userId: string;
    earnedAt: TimestampString;
    progress?: number | null;
    achievement: {
      id: string;
      name: string;
      description: string;
      category: string;
      icon?: string | null;
      xpReward?: number | null;
    } & Achievement_Key;
  } & UserAchievement_Key)[];
}

export interface GetUserAchievementsVariables {
  userId: string;
}

export interface GetUserPRsData {
  personalRecords: ({
    id: UUIDString;
    userId: string;
    exerciseId: string;
    exerciseName: string;
    recordType: string;
    value: number;
    weight?: number | null;
    reps?: number | null;
    setId?: UUIDString | null;
    achievedAt: TimestampString;
    previousValue?: number | null;
  } & PersonalRecord_Key)[];
}

export interface GetUserPRsVariables {
  userId: string;
}

export interface GetUserSessionsData {
  sessions: ({
    id: UUIDString;
    userId: string;
    workoutName: string;
    status: string;
    startedAt: TimestampString;
    completedAt?: TimestampString | null;
    durationSeconds?: number | null;
    totalVolume?: number | null;
    exerciseCount?: number | null;
    setCount?: number | null;
    notes?: string | null;
    workout?: {
      id: UUIDString;
      type: string;
    } & Workout_Key;
  } & Session_Key)[];
}

export interface GetUserSessionsVariables {
  userId: string;
  limit?: number | null;
}

export interface GetUserStreakData {
  streaks: ({
    id: UUIDString;
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastWorkoutDate?: TimestampString | null;
    streakStartDate?: TimestampString | null;
    updatedAt: TimestampString;
  } & Streak_Key)[];
}

export interface GetUserStreakVariables {
  userId: string;
}

export interface GetUserWorkoutsData {
  workouts: ({
    id: UUIDString;
    userId: string;
    name: string;
    type: string;
    dayOfWeek?: number | null;
    estimatedDurationMin?: number | null;
    targetMuscles?: string[] | null;
    isActive?: boolean | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    workoutExercises_on_workout: ({
      id: UUIDString;
      exerciseId: string;
      exerciseName: string;
      orderIndex: number;
      targetSets: number;
      targetReps: string;
      targetRpe?: number | null;
      restSeconds?: number | null;
      notes?: string | null;
    } & WorkoutExercise_Key)[];
  } & Workout_Key)[];
}

export interface GetUserWorkoutsVariables {
  userId: string;
}

export interface GetWorkoutByDayData {
  workouts: ({
    id: UUIDString;
    userId: string;
    name: string;
    type: string;
    dayOfWeek?: number | null;
    estimatedDurationMin?: number | null;
    targetMuscles?: string[] | null;
    isActive?: boolean | null;
    workoutExercises_on_workout: ({
      id: UUIDString;
      exerciseId: string;
      exerciseName: string;
      orderIndex: number;
      targetSets: number;
      targetReps: string;
      targetRpe?: number | null;
      restSeconds?: number | null;
      notes?: string | null;
    } & WorkoutExercise_Key)[];
  } & Workout_Key)[];
}

export interface GetWorkoutByDayVariables {
  userId: string;
  dayOfWeek: number;
}

export interface GetWorkoutData {
  workout?: {
    id: UUIDString;
    userId: string;
    name: string;
    type: string;
    dayOfWeek?: number | null;
    estimatedDurationMin?: number | null;
    targetMuscles?: string[] | null;
    isActive?: boolean | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    workoutExercises_on_workout: ({
      id: UUIDString;
      exerciseId: string;
      exerciseName: string;
      orderIndex: number;
      targetSets: number;
      targetReps: string;
      targetRpe?: number | null;
      restSeconds?: number | null;
      notes?: string | null;
    } & WorkoutExercise_Key)[];
  } & Workout_Key;
}

export interface GetWorkoutExercisesData {
  workoutExercises: ({
    id: UUIDString;
    exerciseId: string;
    exerciseName: string;
    orderIndex: number;
    targetSets: number;
    targetReps: string;
    targetRpe?: number | null;
    restSeconds?: number | null;
    notes?: string | null;
    createdAt: TimestampString;
  } & WorkoutExercise_Key)[];
}

export interface GetWorkoutExercisesVariables {
  workoutId: UUIDString;
}

export interface GetWorkoutVariables {
  id: UUIDString;
}

export interface LogSetData {
  set_insert: Set_Key;
}

export interface LogSetVariables {
  sessionId: UUIDString;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number | null;
  isWarmup?: boolean | null;
  isPR?: boolean | null;
  notes?: string | null;
}

export interface PersonalRecord_Key {
  id: UUIDString;
  __typename?: 'PersonalRecord_Key';
}

export interface RemoveWorkoutExerciseData {
  workoutExercise_delete?: WorkoutExercise_Key | null;
}

export interface RemoveWorkoutExerciseVariables {
  id: UUIDString;
}

export interface Session_Key {
  id: UUIDString;
  __typename?: 'Session_Key';
}

export interface Set_Key {
  id: UUIDString;
  __typename?: 'Set_Key';
}

export interface StartSessionData {
  session_insert: Session_Key;
}

export interface StartSessionVariables {
  userId: string;
  workoutId?: UUIDString | null;
  workoutName: string;
}

export interface Streak_Key {
  id: UUIDString;
  __typename?: 'Streak_Key';
}

export interface UpdateAchievementProgressData {
  userAchievement_update?: UserAchievement_Key | null;
}

export interface UpdateAchievementProgressVariables {
  id: UUIDString;
  progress: number;
}

export interface UpdateSessionData {
  session_update?: Session_Key | null;
}

export interface UpdateSessionVariables {
  id: UUIDString;
  status?: string | null;
  completedAt?: TimestampString | null;
  durationSeconds?: number | null;
  totalVolume?: number | null;
  exerciseCount?: number | null;
  setCount?: number | null;
  notes?: string | null;
}

export interface UpdateStreakData {
  streak_update?: Streak_Key | null;
}

export interface UpdateStreakVariables {
  id: UUIDString;
  currentStreak?: number | null;
  longestStreak?: number | null;
  lastWorkoutDate?: TimestampString | null;
  streakStartDate?: TimestampString | null;
}

export interface UpdateWorkoutData {
  workout_update?: Workout_Key | null;
}

export interface UpdateWorkoutExerciseData {
  workoutExercise_update?: WorkoutExercise_Key | null;
}

export interface UpdateWorkoutExerciseVariables {
  id: UUIDString;
  orderIndex?: number | null;
  targetSets?: number | null;
  targetReps?: string | null;
  targetRpe?: number | null;
  restSeconds?: number | null;
  notes?: string | null;
}

export interface UpdateWorkoutVariables {
  id: UUIDString;
  name?: string | null;
  type?: string | null;
  dayOfWeek?: number | null;
  estimatedDurationMin?: number | null;
  targetMuscles?: string[] | null;
  isActive?: boolean | null;
}

export interface UserAchievement_Key {
  id: UUIDString;
  __typename?: 'UserAchievement_Key';
}

export interface WorkoutExercise_Key {
  id: UUIDString;
  __typename?: 'WorkoutExercise_Key';
}

export interface Workout_Key {
  id: UUIDString;
  __typename?: 'Workout_Key';
}

interface CreateWorkoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
  operationName: string;
}
export const createWorkoutRef: CreateWorkoutRef;

export function createWorkout(vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;
export function createWorkout(dc: DataConnect, vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;

interface UpdateWorkoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkoutVariables): MutationRef<UpdateWorkoutData, UpdateWorkoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorkoutVariables): MutationRef<UpdateWorkoutData, UpdateWorkoutVariables>;
  operationName: string;
}
export const updateWorkoutRef: UpdateWorkoutRef;

export function updateWorkout(vars: UpdateWorkoutVariables): MutationPromise<UpdateWorkoutData, UpdateWorkoutVariables>;
export function updateWorkout(dc: DataConnect, vars: UpdateWorkoutVariables): MutationPromise<UpdateWorkoutData, UpdateWorkoutVariables>;

interface DeleteWorkoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkoutVariables): MutationRef<DeleteWorkoutData, DeleteWorkoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteWorkoutVariables): MutationRef<DeleteWorkoutData, DeleteWorkoutVariables>;
  operationName: string;
}
export const deleteWorkoutRef: DeleteWorkoutRef;

export function deleteWorkout(vars: DeleteWorkoutVariables): MutationPromise<DeleteWorkoutData, DeleteWorkoutVariables>;
export function deleteWorkout(dc: DataConnect, vars: DeleteWorkoutVariables): MutationPromise<DeleteWorkoutData, DeleteWorkoutVariables>;

interface DeleteUserWorkoutsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserWorkoutsVariables): MutationRef<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserWorkoutsVariables): MutationRef<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;
  operationName: string;
}
export const deleteUserWorkoutsRef: DeleteUserWorkoutsRef;

export function deleteUserWorkouts(vars: DeleteUserWorkoutsVariables): MutationPromise<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;
export function deleteUserWorkouts(dc: DataConnect, vars: DeleteUserWorkoutsVariables): MutationPromise<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;

interface AddWorkoutExerciseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddWorkoutExerciseVariables): MutationRef<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddWorkoutExerciseVariables): MutationRef<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;
  operationName: string;
}
export const addWorkoutExerciseRef: AddWorkoutExerciseRef;

export function addWorkoutExercise(vars: AddWorkoutExerciseVariables): MutationPromise<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;
export function addWorkoutExercise(dc: DataConnect, vars: AddWorkoutExerciseVariables): MutationPromise<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;

interface UpdateWorkoutExerciseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkoutExerciseVariables): MutationRef<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorkoutExerciseVariables): MutationRef<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;
  operationName: string;
}
export const updateWorkoutExerciseRef: UpdateWorkoutExerciseRef;

export function updateWorkoutExercise(vars: UpdateWorkoutExerciseVariables): MutationPromise<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;
export function updateWorkoutExercise(dc: DataConnect, vars: UpdateWorkoutExerciseVariables): MutationPromise<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;

interface RemoveWorkoutExerciseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveWorkoutExerciseVariables): MutationRef<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveWorkoutExerciseVariables): MutationRef<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;
  operationName: string;
}
export const removeWorkoutExerciseRef: RemoveWorkoutExerciseRef;

export function removeWorkoutExercise(vars: RemoveWorkoutExerciseVariables): MutationPromise<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;
export function removeWorkoutExercise(dc: DataConnect, vars: RemoveWorkoutExerciseVariables): MutationPromise<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;

interface StartSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: StartSessionVariables): MutationRef<StartSessionData, StartSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: StartSessionVariables): MutationRef<StartSessionData, StartSessionVariables>;
  operationName: string;
}
export const startSessionRef: StartSessionRef;

export function startSession(vars: StartSessionVariables): MutationPromise<StartSessionData, StartSessionVariables>;
export function startSession(dc: DataConnect, vars: StartSessionVariables): MutationPromise<StartSessionData, StartSessionVariables>;

interface UpdateSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSessionVariables): MutationRef<UpdateSessionData, UpdateSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSessionVariables): MutationRef<UpdateSessionData, UpdateSessionVariables>;
  operationName: string;
}
export const updateSessionRef: UpdateSessionRef;

export function updateSession(vars: UpdateSessionVariables): MutationPromise<UpdateSessionData, UpdateSessionVariables>;
export function updateSession(dc: DataConnect, vars: UpdateSessionVariables): MutationPromise<UpdateSessionData, UpdateSessionVariables>;

interface LogSetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogSetVariables): MutationRef<LogSetData, LogSetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogSetVariables): MutationRef<LogSetData, LogSetVariables>;
  operationName: string;
}
export const logSetRef: LogSetRef;

export function logSet(vars: LogSetVariables): MutationPromise<LogSetData, LogSetVariables>;
export function logSet(dc: DataConnect, vars: LogSetVariables): MutationPromise<LogSetData, LogSetVariables>;

interface CreatePrRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePrVariables): MutationRef<CreatePrData, CreatePrVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePrVariables): MutationRef<CreatePrData, CreatePrVariables>;
  operationName: string;
}
export const createPrRef: CreatePrRef;

export function createPr(vars: CreatePrVariables): MutationPromise<CreatePrData, CreatePrVariables>;
export function createPr(dc: DataConnect, vars: CreatePrVariables): MutationPromise<CreatePrData, CreatePrVariables>;

interface CreateStreakRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStreakVariables): MutationRef<CreateStreakData, CreateStreakVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStreakVariables): MutationRef<CreateStreakData, CreateStreakVariables>;
  operationName: string;
}
export const createStreakRef: CreateStreakRef;

export function createStreak(vars: CreateStreakVariables): MutationPromise<CreateStreakData, CreateStreakVariables>;
export function createStreak(dc: DataConnect, vars: CreateStreakVariables): MutationPromise<CreateStreakData, CreateStreakVariables>;

interface UpdateStreakRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStreakVariables): MutationRef<UpdateStreakData, UpdateStreakVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStreakVariables): MutationRef<UpdateStreakData, UpdateStreakVariables>;
  operationName: string;
}
export const updateStreakRef: UpdateStreakRef;

export function updateStreak(vars: UpdateStreakVariables): MutationPromise<UpdateStreakData, UpdateStreakVariables>;
export function updateStreak(dc: DataConnect, vars: UpdateStreakVariables): MutationPromise<UpdateStreakData, UpdateStreakVariables>;

interface CreateAchievementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
  operationName: string;
}
export const createAchievementRef: CreateAchievementRef;

export function createAchievement(vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;
export function createAchievement(dc: DataConnect, vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;

interface AwardAchievementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AwardAchievementVariables): MutationRef<AwardAchievementData, AwardAchievementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AwardAchievementVariables): MutationRef<AwardAchievementData, AwardAchievementVariables>;
  operationName: string;
}
export const awardAchievementRef: AwardAchievementRef;

export function awardAchievement(vars: AwardAchievementVariables): MutationPromise<AwardAchievementData, AwardAchievementVariables>;
export function awardAchievement(dc: DataConnect, vars: AwardAchievementVariables): MutationPromise<AwardAchievementData, AwardAchievementVariables>;

interface UpdateAchievementProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAchievementProgressVariables): MutationRef<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAchievementProgressVariables): MutationRef<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;
  operationName: string;
}
export const updateAchievementProgressRef: UpdateAchievementProgressRef;

export function updateAchievementProgress(vars: UpdateAchievementProgressVariables): MutationPromise<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;
export function updateAchievementProgress(dc: DataConnect, vars: UpdateAchievementProgressVariables): MutationPromise<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;

interface GetUserWorkoutsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserWorkoutsVariables): QueryRef<GetUserWorkoutsData, GetUserWorkoutsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserWorkoutsVariables): QueryRef<GetUserWorkoutsData, GetUserWorkoutsVariables>;
  operationName: string;
}
export const getUserWorkoutsRef: GetUserWorkoutsRef;

export function getUserWorkouts(vars: GetUserWorkoutsVariables): QueryPromise<GetUserWorkoutsData, GetUserWorkoutsVariables>;
export function getUserWorkouts(dc: DataConnect, vars: GetUserWorkoutsVariables): QueryPromise<GetUserWorkoutsData, GetUserWorkoutsVariables>;

interface GetWorkoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
  operationName: string;
}
export const getWorkoutRef: GetWorkoutRef;

export function getWorkout(vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;
export function getWorkout(dc: DataConnect, vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;

interface GetWorkoutByDayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutByDayVariables): QueryRef<GetWorkoutByDayData, GetWorkoutByDayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkoutByDayVariables): QueryRef<GetWorkoutByDayData, GetWorkoutByDayVariables>;
  operationName: string;
}
export const getWorkoutByDayRef: GetWorkoutByDayRef;

export function getWorkoutByDay(vars: GetWorkoutByDayVariables): QueryPromise<GetWorkoutByDayData, GetWorkoutByDayVariables>;
export function getWorkoutByDay(dc: DataConnect, vars: GetWorkoutByDayVariables): QueryPromise<GetWorkoutByDayData, GetWorkoutByDayVariables>;

interface GetWorkoutExercisesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutExercisesVariables): QueryRef<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkoutExercisesVariables): QueryRef<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;
  operationName: string;
}
export const getWorkoutExercisesRef: GetWorkoutExercisesRef;

export function getWorkoutExercises(vars: GetWorkoutExercisesVariables): QueryPromise<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;
export function getWorkoutExercises(dc: DataConnect, vars: GetWorkoutExercisesVariables): QueryPromise<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;

interface GetUserSessionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSessionsVariables): QueryRef<GetUserSessionsData, GetUserSessionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserSessionsVariables): QueryRef<GetUserSessionsData, GetUserSessionsVariables>;
  operationName: string;
}
export const getUserSessionsRef: GetUserSessionsRef;

export function getUserSessions(vars: GetUserSessionsVariables): QueryPromise<GetUserSessionsData, GetUserSessionsVariables>;
export function getUserSessions(dc: DataConnect, vars: GetUserSessionsVariables): QueryPromise<GetUserSessionsData, GetUserSessionsVariables>;

interface GetSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
  operationName: string;
}
export const getSessionRef: GetSessionRef;

export function getSession(vars: GetSessionVariables): QueryPromise<GetSessionData, GetSessionVariables>;
export function getSession(dc: DataConnect, vars: GetSessionVariables): QueryPromise<GetSessionData, GetSessionVariables>;

interface GetSessionSetsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSessionSetsVariables): QueryRef<GetSessionSetsData, GetSessionSetsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSessionSetsVariables): QueryRef<GetSessionSetsData, GetSessionSetsVariables>;
  operationName: string;
}
export const getSessionSetsRef: GetSessionSetsRef;

export function getSessionSets(vars: GetSessionSetsVariables): QueryPromise<GetSessionSetsData, GetSessionSetsVariables>;
export function getSessionSets(dc: DataConnect, vars: GetSessionSetsVariables): QueryPromise<GetSessionSetsData, GetSessionSetsVariables>;

interface GetUserPRsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPRsVariables): QueryRef<GetUserPRsData, GetUserPRsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPRsVariables): QueryRef<GetUserPRsData, GetUserPRsVariables>;
  operationName: string;
}
export const getUserPRsRef: GetUserPRsRef;

export function getUserPRs(vars: GetUserPRsVariables): QueryPromise<GetUserPRsData, GetUserPRsVariables>;
export function getUserPRs(dc: DataConnect, vars: GetUserPRsVariables): QueryPromise<GetUserPRsData, GetUserPRsVariables>;

interface GetExercisePRsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetExercisePRsVariables): QueryRef<GetExercisePRsData, GetExercisePRsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetExercisePRsVariables): QueryRef<GetExercisePRsData, GetExercisePRsVariables>;
  operationName: string;
}
export const getExercisePRsRef: GetExercisePRsRef;

export function getExercisePRs(vars: GetExercisePRsVariables): QueryPromise<GetExercisePRsData, GetExercisePRsVariables>;
export function getExercisePRs(dc: DataConnect, vars: GetExercisePRsVariables): QueryPromise<GetExercisePRsData, GetExercisePRsVariables>;

interface GetUserStreakRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserStreakVariables): QueryRef<GetUserStreakData, GetUserStreakVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserStreakVariables): QueryRef<GetUserStreakData, GetUserStreakVariables>;
  operationName: string;
}
export const getUserStreakRef: GetUserStreakRef;

export function getUserStreak(vars: GetUserStreakVariables): QueryPromise<GetUserStreakData, GetUserStreakVariables>;
export function getUserStreak(dc: DataConnect, vars: GetUserStreakVariables): QueryPromise<GetUserStreakData, GetUserStreakVariables>;

interface GetAllAchievementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllAchievementsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAllAchievementsData, undefined>;
  operationName: string;
}
export const getAllAchievementsRef: GetAllAchievementsRef;

export function getAllAchievements(): QueryPromise<GetAllAchievementsData, undefined>;
export function getAllAchievements(dc: DataConnect): QueryPromise<GetAllAchievementsData, undefined>;

interface GetUserAchievementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserAchievementsVariables): QueryRef<GetUserAchievementsData, GetUserAchievementsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserAchievementsVariables): QueryRef<GetUserAchievementsData, GetUserAchievementsVariables>;
  operationName: string;
}
export const getUserAchievementsRef: GetUserAchievementsRef;

export function getUserAchievements(vars: GetUserAchievementsVariables): QueryPromise<GetUserAchievementsData, GetUserAchievementsVariables>;
export function getUserAchievements(dc: DataConnect, vars: GetUserAchievementsVariables): QueryPromise<GetUserAchievementsData, GetUserAchievementsVariables>;

