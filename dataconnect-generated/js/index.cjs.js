const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'iron-ai-db',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkout', inputVars);
}
createWorkoutRef.operationName = 'CreateWorkout';
exports.createWorkoutRef = createWorkoutRef;

exports.createWorkout = function createWorkout(dcOrVars, vars) {
  return executeMutation(createWorkoutRef(dcOrVars, vars));
};

const updateWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkout', inputVars);
}
updateWorkoutRef.operationName = 'UpdateWorkout';
exports.updateWorkoutRef = updateWorkoutRef;

exports.updateWorkout = function updateWorkout(dcOrVars, vars) {
  return executeMutation(updateWorkoutRef(dcOrVars, vars));
};

const deleteWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteWorkout', inputVars);
}
deleteWorkoutRef.operationName = 'DeleteWorkout';
exports.deleteWorkoutRef = deleteWorkoutRef;

exports.deleteWorkout = function deleteWorkout(dcOrVars, vars) {
  return executeMutation(deleteWorkoutRef(dcOrVars, vars));
};

const deleteUserWorkoutsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserWorkouts', inputVars);
}
deleteUserWorkoutsRef.operationName = 'DeleteUserWorkouts';
exports.deleteUserWorkoutsRef = deleteUserWorkoutsRef;

exports.deleteUserWorkouts = function deleteUserWorkouts(dcOrVars, vars) {
  return executeMutation(deleteUserWorkoutsRef(dcOrVars, vars));
};

const addWorkoutExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddWorkoutExercise', inputVars);
}
addWorkoutExerciseRef.operationName = 'AddWorkoutExercise';
exports.addWorkoutExerciseRef = addWorkoutExerciseRef;

exports.addWorkoutExercise = function addWorkoutExercise(dcOrVars, vars) {
  return executeMutation(addWorkoutExerciseRef(dcOrVars, vars));
};

const updateWorkoutExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkoutExercise', inputVars);
}
updateWorkoutExerciseRef.operationName = 'UpdateWorkoutExercise';
exports.updateWorkoutExerciseRef = updateWorkoutExerciseRef;

exports.updateWorkoutExercise = function updateWorkoutExercise(dcOrVars, vars) {
  return executeMutation(updateWorkoutExerciseRef(dcOrVars, vars));
};

const removeWorkoutExerciseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveWorkoutExercise', inputVars);
}
removeWorkoutExerciseRef.operationName = 'RemoveWorkoutExercise';
exports.removeWorkoutExerciseRef = removeWorkoutExerciseRef;

exports.removeWorkoutExercise = function removeWorkoutExercise(dcOrVars, vars) {
  return executeMutation(removeWorkoutExerciseRef(dcOrVars, vars));
};

const startSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'StartSession', inputVars);
}
startSessionRef.operationName = 'StartSession';
exports.startSessionRef = startSessionRef;

exports.startSession = function startSession(dcOrVars, vars) {
  return executeMutation(startSessionRef(dcOrVars, vars));
};

const updateSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSession', inputVars);
}
updateSessionRef.operationName = 'UpdateSession';
exports.updateSessionRef = updateSessionRef;

exports.updateSession = function updateSession(dcOrVars, vars) {
  return executeMutation(updateSessionRef(dcOrVars, vars));
};

const logSetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogSet', inputVars);
}
logSetRef.operationName = 'LogSet';
exports.logSetRef = logSetRef;

exports.logSet = function logSet(dcOrVars, vars) {
  return executeMutation(logSetRef(dcOrVars, vars));
};

const createPrRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePR', inputVars);
}
createPrRef.operationName = 'CreatePR';
exports.createPrRef = createPrRef;

exports.createPr = function createPr(dcOrVars, vars) {
  return executeMutation(createPrRef(dcOrVars, vars));
};

const createStreakRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStreak', inputVars);
}
createStreakRef.operationName = 'CreateStreak';
exports.createStreakRef = createStreakRef;

exports.createStreak = function createStreak(dcOrVars, vars) {
  return executeMutation(createStreakRef(dcOrVars, vars));
};

const updateStreakRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStreak', inputVars);
}
updateStreakRef.operationName = 'UpdateStreak';
exports.updateStreakRef = updateStreakRef;

exports.updateStreak = function updateStreak(dcOrVars, vars) {
  return executeMutation(updateStreakRef(dcOrVars, vars));
};

const createAchievementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAchievement', inputVars);
}
createAchievementRef.operationName = 'CreateAchievement';
exports.createAchievementRef = createAchievementRef;

exports.createAchievement = function createAchievement(dcOrVars, vars) {
  return executeMutation(createAchievementRef(dcOrVars, vars));
};

const awardAchievementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AwardAchievement', inputVars);
}
awardAchievementRef.operationName = 'AwardAchievement';
exports.awardAchievementRef = awardAchievementRef;

exports.awardAchievement = function awardAchievement(dcOrVars, vars) {
  return executeMutation(awardAchievementRef(dcOrVars, vars));
};

const updateAchievementProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAchievementProgress', inputVars);
}
updateAchievementProgressRef.operationName = 'UpdateAchievementProgress';
exports.updateAchievementProgressRef = updateAchievementProgressRef;

exports.updateAchievementProgress = function updateAchievementProgress(dcOrVars, vars) {
  return executeMutation(updateAchievementProgressRef(dcOrVars, vars));
};

const getUserWorkoutsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserWorkouts', inputVars);
}
getUserWorkoutsRef.operationName = 'GetUserWorkouts';
exports.getUserWorkoutsRef = getUserWorkoutsRef;

exports.getUserWorkouts = function getUserWorkouts(dcOrVars, vars) {
  return executeQuery(getUserWorkoutsRef(dcOrVars, vars));
};

const getWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkout', inputVars);
}
getWorkoutRef.operationName = 'GetWorkout';
exports.getWorkoutRef = getWorkoutRef;

exports.getWorkout = function getWorkout(dcOrVars, vars) {
  return executeQuery(getWorkoutRef(dcOrVars, vars));
};

const getWorkoutByDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkoutByDay', inputVars);
}
getWorkoutByDayRef.operationName = 'GetWorkoutByDay';
exports.getWorkoutByDayRef = getWorkoutByDayRef;

exports.getWorkoutByDay = function getWorkoutByDay(dcOrVars, vars) {
  return executeQuery(getWorkoutByDayRef(dcOrVars, vars));
};

const getWorkoutExercisesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkoutExercises', inputVars);
}
getWorkoutExercisesRef.operationName = 'GetWorkoutExercises';
exports.getWorkoutExercisesRef = getWorkoutExercisesRef;

exports.getWorkoutExercises = function getWorkoutExercises(dcOrVars, vars) {
  return executeQuery(getWorkoutExercisesRef(dcOrVars, vars));
};

const getUserSessionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserSessions', inputVars);
}
getUserSessionsRef.operationName = 'GetUserSessions';
exports.getUserSessionsRef = getUserSessionsRef;

exports.getUserSessions = function getUserSessions(dcOrVars, vars) {
  return executeQuery(getUserSessionsRef(dcOrVars, vars));
};

const getSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSession', inputVars);
}
getSessionRef.operationName = 'GetSession';
exports.getSessionRef = getSessionRef;

exports.getSession = function getSession(dcOrVars, vars) {
  return executeQuery(getSessionRef(dcOrVars, vars));
};

const getSessionSetsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSessionSets', inputVars);
}
getSessionSetsRef.operationName = 'GetSessionSets';
exports.getSessionSetsRef = getSessionSetsRef;

exports.getSessionSets = function getSessionSets(dcOrVars, vars) {
  return executeQuery(getSessionSetsRef(dcOrVars, vars));
};

const getUserPRsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPRs', inputVars);
}
getUserPRsRef.operationName = 'GetUserPRs';
exports.getUserPRsRef = getUserPRsRef;

exports.getUserPRs = function getUserPRs(dcOrVars, vars) {
  return executeQuery(getUserPRsRef(dcOrVars, vars));
};

const getExercisePRsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetExercisePRs', inputVars);
}
getExercisePRsRef.operationName = 'GetExercisePRs';
exports.getExercisePRsRef = getExercisePRsRef;

exports.getExercisePRs = function getExercisePRs(dcOrVars, vars) {
  return executeQuery(getExercisePRsRef(dcOrVars, vars));
};

const getUserStreakRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserStreak', inputVars);
}
getUserStreakRef.operationName = 'GetUserStreak';
exports.getUserStreakRef = getUserStreakRef;

exports.getUserStreak = function getUserStreak(dcOrVars, vars) {
  return executeQuery(getUserStreakRef(dcOrVars, vars));
};

const getAllAchievementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllAchievements');
}
getAllAchievementsRef.operationName = 'GetAllAchievements';
exports.getAllAchievementsRef = getAllAchievementsRef;

exports.getAllAchievements = function getAllAchievements(dc) {
  return executeQuery(getAllAchievementsRef(dc));
};

const getUserAchievementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserAchievements', inputVars);
}
getUserAchievementsRef.operationName = 'GetUserAchievements';
exports.getUserAchievementsRef = getUserAchievementsRef;

exports.getUserAchievements = function getUserAchievements(dcOrVars, vars) {
  return executeQuery(getUserAchievementsRef(dcOrVars, vars));
};
