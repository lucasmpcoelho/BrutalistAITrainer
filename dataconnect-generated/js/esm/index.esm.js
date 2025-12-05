import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'iron-ai-db',
  location: 'us-central1'
};

export const createWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkout', inputVars);
}
createWorkoutRef.operationName = 'CreateWorkout';

export function createWorkout(dcOrVars, vars) {
  return executeMutation(createWorkoutRef(dcOrVars, vars));
}

export const updateWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkout', inputVars);
}
updateWorkoutRef.operationName = 'UpdateWorkout';

export function updateWorkout(dcOrVars, vars) {
  return executeMutation(updateWorkoutRef(dcOrVars, vars));
}

export const deleteWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorkout', inputVars);
}
deleteWorkoutRef.operationName = 'DeleteWorkout';

export function deleteWorkout(dcOrVars, vars) {
  return executeMutation(deleteWorkoutRef(dcOrVars, vars));
}

export const deleteUserWorkoutsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserWorkouts', inputVars);
}
deleteUserWorkoutsRef.operationName = 'DeleteUserWorkouts';

export function deleteUserWorkouts(dcOrVars, vars) {
  return executeMutation(deleteUserWorkoutsRef(dcOrVars, vars));
}

export const addWorkoutExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddWorkoutExercise', inputVars);
}
addWorkoutExerciseRef.operationName = 'AddWorkoutExercise';

export function addWorkoutExercise(dcOrVars, vars) {
  return executeMutation(addWorkoutExerciseRef(dcOrVars, vars));
}

export const updateWorkoutExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkoutExercise', inputVars);
}
updateWorkoutExerciseRef.operationName = 'UpdateWorkoutExercise';

export function updateWorkoutExercise(dcOrVars, vars) {
  return executeMutation(updateWorkoutExerciseRef(dcOrVars, vars));
}

export const removeWorkoutExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveWorkoutExercise', inputVars);
}
removeWorkoutExerciseRef.operationName = 'RemoveWorkoutExercise';

export function removeWorkoutExercise(dcOrVars, vars) {
  return executeMutation(removeWorkoutExerciseRef(dcOrVars, vars));
}

export const startSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'StartSession', inputVars);
}
startSessionRef.operationName = 'StartSession';

export function startSession(dcOrVars, vars) {
  return executeMutation(startSessionRef(dcOrVars, vars));
}

export const updateSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSession', inputVars);
}
updateSessionRef.operationName = 'UpdateSession';

export function updateSession(dcOrVars, vars) {
  return executeMutation(updateSessionRef(dcOrVars, vars));
}

export const logSetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogSet', inputVars);
}
logSetRef.operationName = 'LogSet';

export function logSet(dcOrVars, vars) {
  return executeMutation(logSetRef(dcOrVars, vars));
}

export const createPrRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePR', inputVars);
}
createPrRef.operationName = 'CreatePR';

export function createPr(dcOrVars, vars) {
  return executeMutation(createPrRef(dcOrVars, vars));
}

export const createStreakRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStreak', inputVars);
}
createStreakRef.operationName = 'CreateStreak';

export function createStreak(dcOrVars, vars) {
  return executeMutation(createStreakRef(dcOrVars, vars));
}

export const updateStreakRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStreak', inputVars);
}
updateStreakRef.operationName = 'UpdateStreak';

export function updateStreak(dcOrVars, vars) {
  return executeMutation(updateStreakRef(dcOrVars, vars));
}

export const createAchievementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAchievement', inputVars);
}
createAchievementRef.operationName = 'CreateAchievement';

export function createAchievement(dcOrVars, vars) {
  return executeMutation(createAchievementRef(dcOrVars, vars));
}

export const awardAchievementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AwardAchievement', inputVars);
}
awardAchievementRef.operationName = 'AwardAchievement';

export function awardAchievement(dcOrVars, vars) {
  return executeMutation(awardAchievementRef(dcOrVars, vars));
}

export const updateAchievementProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAchievementProgress', inputVars);
}
updateAchievementProgressRef.operationName = 'UpdateAchievementProgress';

export function updateAchievementProgress(dcOrVars, vars) {
  return executeMutation(updateAchievementProgressRef(dcOrVars, vars));
}

export const getUserWorkoutsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserWorkouts', inputVars);
}
getUserWorkoutsRef.operationName = 'GetUserWorkouts';

export function getUserWorkouts(dcOrVars, vars) {
  return executeQuery(getUserWorkoutsRef(dcOrVars, vars));
}

export const getWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkout', inputVars);
}
getWorkoutRef.operationName = 'GetWorkout';

export function getWorkout(dcOrVars, vars) {
  return executeQuery(getWorkoutRef(dcOrVars, vars));
}

export const getWorkoutByDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkoutByDay', inputVars);
}
getWorkoutByDayRef.operationName = 'GetWorkoutByDay';

export function getWorkoutByDay(dcOrVars, vars) {
  return executeQuery(getWorkoutByDayRef(dcOrVars, vars));
}

export const getWorkoutExercisesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkoutExercises', inputVars);
}
getWorkoutExercisesRef.operationName = 'GetWorkoutExercises';

export function getWorkoutExercises(dcOrVars, vars) {
  return executeQuery(getWorkoutExercisesRef(dcOrVars, vars));
}

export const getUserSessionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserSessions', inputVars);
}
getUserSessionsRef.operationName = 'GetUserSessions';

export function getUserSessions(dcOrVars, vars) {
  return executeQuery(getUserSessionsRef(dcOrVars, vars));
}

export const getSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSession', inputVars);
}
getSessionRef.operationName = 'GetSession';

export function getSession(dcOrVars, vars) {
  return executeQuery(getSessionRef(dcOrVars, vars));
}

export const getSessionSetsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSessionSets', inputVars);
}
getSessionSetsRef.operationName = 'GetSessionSets';

export function getSessionSets(dcOrVars, vars) {
  return executeQuery(getSessionSetsRef(dcOrVars, vars));
}

export const getUserPRsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPRs', inputVars);
}
getUserPRsRef.operationName = 'GetUserPRs';

export function getUserPRs(dcOrVars, vars) {
  return executeQuery(getUserPRsRef(dcOrVars, vars));
}

export const getExercisePRsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetExercisePRs', inputVars);
}
getExercisePRsRef.operationName = 'GetExercisePRs';

export function getExercisePRs(dcOrVars, vars) {
  return executeQuery(getExercisePRsRef(dcOrVars, vars));
}

export const getUserStreakRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserStreak', inputVars);
}
getUserStreakRef.operationName = 'GetUserStreak';

export function getUserStreak(dcOrVars, vars) {
  return executeQuery(getUserStreakRef(dcOrVars, vars));
}

export const getAllAchievementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllAchievements');
}
getAllAchievementsRef.operationName = 'GetAllAchievements';

export function getAllAchievements(dc) {
  return executeQuery(getAllAchievementsRef(dc));
}

export const getUserAchievementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserAchievements', inputVars);
}
getUserAchievementsRef.operationName = 'GetUserAchievements';

export function getUserAchievements(dcOrVars, vars) {
  return executeQuery(getUserAchievementsRef(dcOrVars, vars));
}

