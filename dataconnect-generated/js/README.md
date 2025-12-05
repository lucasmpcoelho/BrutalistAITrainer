# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserWorkouts*](#getuserworkouts)
  - [*GetWorkout*](#getworkout)
  - [*GetWorkoutByDay*](#getworkoutbyday)
  - [*GetWorkoutExercises*](#getworkoutexercises)
  - [*GetUserSessions*](#getusersessions)
  - [*GetSession*](#getsession)
  - [*GetSessionSets*](#getsessionsets)
  - [*GetUserPRs*](#getuserprs)
  - [*GetExercisePRs*](#getexerciseprs)
  - [*GetUserStreak*](#getuserstreak)
  - [*GetAllAchievements*](#getallachievements)
  - [*GetUserAchievements*](#getuserachievements)
- [**Mutations**](#mutations)
  - [*CreateWorkout*](#createworkout)
  - [*UpdateWorkout*](#updateworkout)
  - [*DeleteWorkout*](#deleteworkout)
  - [*DeleteUserWorkouts*](#deleteuserworkouts)
  - [*AddWorkoutExercise*](#addworkoutexercise)
  - [*UpdateWorkoutExercise*](#updateworkoutexercise)
  - [*RemoveWorkoutExercise*](#removeworkoutexercise)
  - [*StartSession*](#startsession)
  - [*UpdateSession*](#updatesession)
  - [*LogSet*](#logset)
  - [*CreatePR*](#createpr)
  - [*CreateStreak*](#createstreak)
  - [*UpdateStreak*](#updatestreak)
  - [*CreateAchievement*](#createachievement)
  - [*AwardAchievement*](#awardachievement)
  - [*UpdateAchievementProgress*](#updateachievementprogress)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@iron-ai/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@iron-ai/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@iron-ai/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserWorkouts
You can execute the `GetUserWorkouts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getUserWorkouts(vars: GetUserWorkoutsVariables): QueryPromise<GetUserWorkoutsData, GetUserWorkoutsVariables>;

interface GetUserWorkoutsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserWorkoutsVariables): QueryRef<GetUserWorkoutsData, GetUserWorkoutsVariables>;
}
export const getUserWorkoutsRef: GetUserWorkoutsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserWorkouts(dc: DataConnect, vars: GetUserWorkoutsVariables): QueryPromise<GetUserWorkoutsData, GetUserWorkoutsVariables>;

interface GetUserWorkoutsRef {
  ...
  (dc: DataConnect, vars: GetUserWorkoutsVariables): QueryRef<GetUserWorkoutsData, GetUserWorkoutsVariables>;
}
export const getUserWorkoutsRef: GetUserWorkoutsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserWorkoutsRef:
```typescript
const name = getUserWorkoutsRef.operationName;
console.log(name);
```

### Variables
The `GetUserWorkouts` query requires an argument of type `GetUserWorkoutsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserWorkoutsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserWorkouts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserWorkoutsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserWorkouts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserWorkouts, GetUserWorkoutsVariables } from '@iron-ai/dataconnect';

// The `GetUserWorkouts` query requires an argument of type `GetUserWorkoutsVariables`:
const getUserWorkoutsVars: GetUserWorkoutsVariables = {
  userId: ..., 
};

// Call the `getUserWorkouts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserWorkouts(getUserWorkoutsVars);
// Variables can be defined inline as well.
const { data } = await getUserWorkouts({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserWorkouts(dataConnect, getUserWorkoutsVars);

console.log(data.workouts);

// Or, you can use the `Promise` API.
getUserWorkouts(getUserWorkoutsVars).then((response) => {
  const data = response.data;
  console.log(data.workouts);
});
```

### Using `GetUserWorkouts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserWorkoutsRef, GetUserWorkoutsVariables } from '@iron-ai/dataconnect';

// The `GetUserWorkouts` query requires an argument of type `GetUserWorkoutsVariables`:
const getUserWorkoutsVars: GetUserWorkoutsVariables = {
  userId: ..., 
};

// Call the `getUserWorkoutsRef()` function to get a reference to the query.
const ref = getUserWorkoutsRef(getUserWorkoutsVars);
// Variables can be defined inline as well.
const ref = getUserWorkoutsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserWorkoutsRef(dataConnect, getUserWorkoutsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workouts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workouts);
});
```

## GetWorkout
You can execute the `GetWorkout` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getWorkout(vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;

interface GetWorkoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
}
export const getWorkoutRef: GetWorkoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkout(dc: DataConnect, vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;

interface GetWorkoutRef {
  ...
  (dc: DataConnect, vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
}
export const getWorkoutRef: GetWorkoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorkoutRef:
```typescript
const name = getWorkoutRef.operationName;
console.log(name);
```

### Variables
The `GetWorkout` query requires an argument of type `GetWorkoutVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorkoutVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetWorkout` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorkoutData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetWorkout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorkout, GetWorkoutVariables } from '@iron-ai/dataconnect';

// The `GetWorkout` query requires an argument of type `GetWorkoutVariables`:
const getWorkoutVars: GetWorkoutVariables = {
  id: ..., 
};

// Call the `getWorkout()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorkout(getWorkoutVars);
// Variables can be defined inline as well.
const { data } = await getWorkout({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorkout(dataConnect, getWorkoutVars);

console.log(data.workout);

// Or, you can use the `Promise` API.
getWorkout(getWorkoutVars).then((response) => {
  const data = response.data;
  console.log(data.workout);
});
```

### Using `GetWorkout`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorkoutRef, GetWorkoutVariables } from '@iron-ai/dataconnect';

// The `GetWorkout` query requires an argument of type `GetWorkoutVariables`:
const getWorkoutVars: GetWorkoutVariables = {
  id: ..., 
};

// Call the `getWorkoutRef()` function to get a reference to the query.
const ref = getWorkoutRef(getWorkoutVars);
// Variables can be defined inline as well.
const ref = getWorkoutRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorkoutRef(dataConnect, getWorkoutVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workout);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workout);
});
```

## GetWorkoutByDay
You can execute the `GetWorkoutByDay` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getWorkoutByDay(vars: GetWorkoutByDayVariables): QueryPromise<GetWorkoutByDayData, GetWorkoutByDayVariables>;

interface GetWorkoutByDayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutByDayVariables): QueryRef<GetWorkoutByDayData, GetWorkoutByDayVariables>;
}
export const getWorkoutByDayRef: GetWorkoutByDayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkoutByDay(dc: DataConnect, vars: GetWorkoutByDayVariables): QueryPromise<GetWorkoutByDayData, GetWorkoutByDayVariables>;

interface GetWorkoutByDayRef {
  ...
  (dc: DataConnect, vars: GetWorkoutByDayVariables): QueryRef<GetWorkoutByDayData, GetWorkoutByDayVariables>;
}
export const getWorkoutByDayRef: GetWorkoutByDayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorkoutByDayRef:
```typescript
const name = getWorkoutByDayRef.operationName;
console.log(name);
```

### Variables
The `GetWorkoutByDay` query requires an argument of type `GetWorkoutByDayVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorkoutByDayVariables {
  userId: string;
  dayOfWeek: number;
}
```
### Return Type
Recall that executing the `GetWorkoutByDay` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorkoutByDayData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetWorkoutByDay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorkoutByDay, GetWorkoutByDayVariables } from '@iron-ai/dataconnect';

// The `GetWorkoutByDay` query requires an argument of type `GetWorkoutByDayVariables`:
const getWorkoutByDayVars: GetWorkoutByDayVariables = {
  userId: ..., 
  dayOfWeek: ..., 
};

// Call the `getWorkoutByDay()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorkoutByDay(getWorkoutByDayVars);
// Variables can be defined inline as well.
const { data } = await getWorkoutByDay({ userId: ..., dayOfWeek: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorkoutByDay(dataConnect, getWorkoutByDayVars);

console.log(data.workouts);

// Or, you can use the `Promise` API.
getWorkoutByDay(getWorkoutByDayVars).then((response) => {
  const data = response.data;
  console.log(data.workouts);
});
```

### Using `GetWorkoutByDay`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorkoutByDayRef, GetWorkoutByDayVariables } from '@iron-ai/dataconnect';

// The `GetWorkoutByDay` query requires an argument of type `GetWorkoutByDayVariables`:
const getWorkoutByDayVars: GetWorkoutByDayVariables = {
  userId: ..., 
  dayOfWeek: ..., 
};

// Call the `getWorkoutByDayRef()` function to get a reference to the query.
const ref = getWorkoutByDayRef(getWorkoutByDayVars);
// Variables can be defined inline as well.
const ref = getWorkoutByDayRef({ userId: ..., dayOfWeek: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorkoutByDayRef(dataConnect, getWorkoutByDayVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workouts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workouts);
});
```

## GetWorkoutExercises
You can execute the `GetWorkoutExercises` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getWorkoutExercises(vars: GetWorkoutExercisesVariables): QueryPromise<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;

interface GetWorkoutExercisesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutExercisesVariables): QueryRef<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;
}
export const getWorkoutExercisesRef: GetWorkoutExercisesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkoutExercises(dc: DataConnect, vars: GetWorkoutExercisesVariables): QueryPromise<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;

interface GetWorkoutExercisesRef {
  ...
  (dc: DataConnect, vars: GetWorkoutExercisesVariables): QueryRef<GetWorkoutExercisesData, GetWorkoutExercisesVariables>;
}
export const getWorkoutExercisesRef: GetWorkoutExercisesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorkoutExercisesRef:
```typescript
const name = getWorkoutExercisesRef.operationName;
console.log(name);
```

### Variables
The `GetWorkoutExercises` query requires an argument of type `GetWorkoutExercisesVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorkoutExercisesVariables {
  workoutId: UUIDString;
}
```
### Return Type
Recall that executing the `GetWorkoutExercises` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorkoutExercisesData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetWorkoutExercises`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorkoutExercises, GetWorkoutExercisesVariables } from '@iron-ai/dataconnect';

// The `GetWorkoutExercises` query requires an argument of type `GetWorkoutExercisesVariables`:
const getWorkoutExercisesVars: GetWorkoutExercisesVariables = {
  workoutId: ..., 
};

// Call the `getWorkoutExercises()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorkoutExercises(getWorkoutExercisesVars);
// Variables can be defined inline as well.
const { data } = await getWorkoutExercises({ workoutId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorkoutExercises(dataConnect, getWorkoutExercisesVars);

console.log(data.workoutExercises);

// Or, you can use the `Promise` API.
getWorkoutExercises(getWorkoutExercisesVars).then((response) => {
  const data = response.data;
  console.log(data.workoutExercises);
});
```

### Using `GetWorkoutExercises`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorkoutExercisesRef, GetWorkoutExercisesVariables } from '@iron-ai/dataconnect';

// The `GetWorkoutExercises` query requires an argument of type `GetWorkoutExercisesVariables`:
const getWorkoutExercisesVars: GetWorkoutExercisesVariables = {
  workoutId: ..., 
};

// Call the `getWorkoutExercisesRef()` function to get a reference to the query.
const ref = getWorkoutExercisesRef(getWorkoutExercisesVars);
// Variables can be defined inline as well.
const ref = getWorkoutExercisesRef({ workoutId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorkoutExercisesRef(dataConnect, getWorkoutExercisesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workoutExercises);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workoutExercises);
});
```

## GetUserSessions
You can execute the `GetUserSessions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getUserSessions(vars: GetUserSessionsVariables): QueryPromise<GetUserSessionsData, GetUserSessionsVariables>;

interface GetUserSessionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSessionsVariables): QueryRef<GetUserSessionsData, GetUserSessionsVariables>;
}
export const getUserSessionsRef: GetUserSessionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserSessions(dc: DataConnect, vars: GetUserSessionsVariables): QueryPromise<GetUserSessionsData, GetUserSessionsVariables>;

interface GetUserSessionsRef {
  ...
  (dc: DataConnect, vars: GetUserSessionsVariables): QueryRef<GetUserSessionsData, GetUserSessionsVariables>;
}
export const getUserSessionsRef: GetUserSessionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserSessionsRef:
```typescript
const name = getUserSessionsRef.operationName;
console.log(name);
```

### Variables
The `GetUserSessions` query requires an argument of type `GetUserSessionsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserSessionsVariables {
  userId: string;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `GetUserSessions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserSessionsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserSessions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserSessions, GetUserSessionsVariables } from '@iron-ai/dataconnect';

// The `GetUserSessions` query requires an argument of type `GetUserSessionsVariables`:
const getUserSessionsVars: GetUserSessionsVariables = {
  userId: ..., 
  limit: ..., // optional
};

// Call the `getUserSessions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserSessions(getUserSessionsVars);
// Variables can be defined inline as well.
const { data } = await getUserSessions({ userId: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserSessions(dataConnect, getUserSessionsVars);

console.log(data.sessions);

// Or, you can use the `Promise` API.
getUserSessions(getUserSessionsVars).then((response) => {
  const data = response.data;
  console.log(data.sessions);
});
```

### Using `GetUserSessions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserSessionsRef, GetUserSessionsVariables } from '@iron-ai/dataconnect';

// The `GetUserSessions` query requires an argument of type `GetUserSessionsVariables`:
const getUserSessionsVars: GetUserSessionsVariables = {
  userId: ..., 
  limit: ..., // optional
};

// Call the `getUserSessionsRef()` function to get a reference to the query.
const ref = getUserSessionsRef(getUserSessionsVars);
// Variables can be defined inline as well.
const ref = getUserSessionsRef({ userId: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserSessionsRef(dataConnect, getUserSessionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sessions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sessions);
});
```

## GetSession
You can execute the `GetSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getSession(vars: GetSessionVariables): QueryPromise<GetSessionData, GetSessionVariables>;

interface GetSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
}
export const getSessionRef: GetSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSession(dc: DataConnect, vars: GetSessionVariables): QueryPromise<GetSessionData, GetSessionVariables>;

interface GetSessionRef {
  ...
  (dc: DataConnect, vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
}
export const getSessionRef: GetSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSessionRef:
```typescript
const name = getSessionRef.operationName;
console.log(name);
```

### Variables
The `GetSession` query requires an argument of type `GetSessionVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSessionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSessionData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSession, GetSessionVariables } from '@iron-ai/dataconnect';

// The `GetSession` query requires an argument of type `GetSessionVariables`:
const getSessionVars: GetSessionVariables = {
  id: ..., 
};

// Call the `getSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSession(getSessionVars);
// Variables can be defined inline as well.
const { data } = await getSession({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSession(dataConnect, getSessionVars);

console.log(data.session);

// Or, you can use the `Promise` API.
getSession(getSessionVars).then((response) => {
  const data = response.data;
  console.log(data.session);
});
```

### Using `GetSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSessionRef, GetSessionVariables } from '@iron-ai/dataconnect';

// The `GetSession` query requires an argument of type `GetSessionVariables`:
const getSessionVars: GetSessionVariables = {
  id: ..., 
};

// Call the `getSessionRef()` function to get a reference to the query.
const ref = getSessionRef(getSessionVars);
// Variables can be defined inline as well.
const ref = getSessionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSessionRef(dataConnect, getSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.session);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.session);
});
```

## GetSessionSets
You can execute the `GetSessionSets` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getSessionSets(vars: GetSessionSetsVariables): QueryPromise<GetSessionSetsData, GetSessionSetsVariables>;

interface GetSessionSetsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSessionSetsVariables): QueryRef<GetSessionSetsData, GetSessionSetsVariables>;
}
export const getSessionSetsRef: GetSessionSetsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSessionSets(dc: DataConnect, vars: GetSessionSetsVariables): QueryPromise<GetSessionSetsData, GetSessionSetsVariables>;

interface GetSessionSetsRef {
  ...
  (dc: DataConnect, vars: GetSessionSetsVariables): QueryRef<GetSessionSetsData, GetSessionSetsVariables>;
}
export const getSessionSetsRef: GetSessionSetsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSessionSetsRef:
```typescript
const name = getSessionSetsRef.operationName;
console.log(name);
```

### Variables
The `GetSessionSets` query requires an argument of type `GetSessionSetsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSessionSetsVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetSessionSets` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSessionSetsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetSessionSets`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSessionSets, GetSessionSetsVariables } from '@iron-ai/dataconnect';

// The `GetSessionSets` query requires an argument of type `GetSessionSetsVariables`:
const getSessionSetsVars: GetSessionSetsVariables = {
  sessionId: ..., 
};

// Call the `getSessionSets()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSessionSets(getSessionSetsVars);
// Variables can be defined inline as well.
const { data } = await getSessionSets({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSessionSets(dataConnect, getSessionSetsVars);

console.log(data.sets);

// Or, you can use the `Promise` API.
getSessionSets(getSessionSetsVars).then((response) => {
  const data = response.data;
  console.log(data.sets);
});
```

### Using `GetSessionSets`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSessionSetsRef, GetSessionSetsVariables } from '@iron-ai/dataconnect';

// The `GetSessionSets` query requires an argument of type `GetSessionSetsVariables`:
const getSessionSetsVars: GetSessionSetsVariables = {
  sessionId: ..., 
};

// Call the `getSessionSetsRef()` function to get a reference to the query.
const ref = getSessionSetsRef(getSessionSetsVars);
// Variables can be defined inline as well.
const ref = getSessionSetsRef({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSessionSetsRef(dataConnect, getSessionSetsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sets);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sets);
});
```

## GetUserPRs
You can execute the `GetUserPRs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getUserPRs(vars: GetUserPRsVariables): QueryPromise<GetUserPRsData, GetUserPRsVariables>;

interface GetUserPRsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPRsVariables): QueryRef<GetUserPRsData, GetUserPRsVariables>;
}
export const getUserPRsRef: GetUserPRsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserPRs(dc: DataConnect, vars: GetUserPRsVariables): QueryPromise<GetUserPRsData, GetUserPRsVariables>;

interface GetUserPRsRef {
  ...
  (dc: DataConnect, vars: GetUserPRsVariables): QueryRef<GetUserPRsData, GetUserPRsVariables>;
}
export const getUserPRsRef: GetUserPRsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserPRsRef:
```typescript
const name = getUserPRsRef.operationName;
console.log(name);
```

### Variables
The `GetUserPRs` query requires an argument of type `GetUserPRsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserPRsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserPRs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserPRsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserPRs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserPRs, GetUserPRsVariables } from '@iron-ai/dataconnect';

// The `GetUserPRs` query requires an argument of type `GetUserPRsVariables`:
const getUserPRsVars: GetUserPRsVariables = {
  userId: ..., 
};

// Call the `getUserPRs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserPRs(getUserPRsVars);
// Variables can be defined inline as well.
const { data } = await getUserPRs({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserPRs(dataConnect, getUserPRsVars);

console.log(data.personalRecords);

// Or, you can use the `Promise` API.
getUserPRs(getUserPRsVars).then((response) => {
  const data = response.data;
  console.log(data.personalRecords);
});
```

### Using `GetUserPRs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserPRsRef, GetUserPRsVariables } from '@iron-ai/dataconnect';

// The `GetUserPRs` query requires an argument of type `GetUserPRsVariables`:
const getUserPRsVars: GetUserPRsVariables = {
  userId: ..., 
};

// Call the `getUserPRsRef()` function to get a reference to the query.
const ref = getUserPRsRef(getUserPRsVars);
// Variables can be defined inline as well.
const ref = getUserPRsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserPRsRef(dataConnect, getUserPRsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.personalRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.personalRecords);
});
```

## GetExercisePRs
You can execute the `GetExercisePRs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getExercisePRs(vars: GetExercisePRsVariables): QueryPromise<GetExercisePRsData, GetExercisePRsVariables>;

interface GetExercisePRsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetExercisePRsVariables): QueryRef<GetExercisePRsData, GetExercisePRsVariables>;
}
export const getExercisePRsRef: GetExercisePRsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getExercisePRs(dc: DataConnect, vars: GetExercisePRsVariables): QueryPromise<GetExercisePRsData, GetExercisePRsVariables>;

interface GetExercisePRsRef {
  ...
  (dc: DataConnect, vars: GetExercisePRsVariables): QueryRef<GetExercisePRsData, GetExercisePRsVariables>;
}
export const getExercisePRsRef: GetExercisePRsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getExercisePRsRef:
```typescript
const name = getExercisePRsRef.operationName;
console.log(name);
```

### Variables
The `GetExercisePRs` query requires an argument of type `GetExercisePRsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetExercisePRsVariables {
  userId: string;
  exerciseId: string;
}
```
### Return Type
Recall that executing the `GetExercisePRs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetExercisePRsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetExercisePRs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getExercisePRs, GetExercisePRsVariables } from '@iron-ai/dataconnect';

// The `GetExercisePRs` query requires an argument of type `GetExercisePRsVariables`:
const getExercisePRsVars: GetExercisePRsVariables = {
  userId: ..., 
  exerciseId: ..., 
};

// Call the `getExercisePRs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getExercisePRs(getExercisePRsVars);
// Variables can be defined inline as well.
const { data } = await getExercisePRs({ userId: ..., exerciseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getExercisePRs(dataConnect, getExercisePRsVars);

console.log(data.personalRecords);

// Or, you can use the `Promise` API.
getExercisePRs(getExercisePRsVars).then((response) => {
  const data = response.data;
  console.log(data.personalRecords);
});
```

### Using `GetExercisePRs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getExercisePRsRef, GetExercisePRsVariables } from '@iron-ai/dataconnect';

// The `GetExercisePRs` query requires an argument of type `GetExercisePRsVariables`:
const getExercisePRsVars: GetExercisePRsVariables = {
  userId: ..., 
  exerciseId: ..., 
};

// Call the `getExercisePRsRef()` function to get a reference to the query.
const ref = getExercisePRsRef(getExercisePRsVars);
// Variables can be defined inline as well.
const ref = getExercisePRsRef({ userId: ..., exerciseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getExercisePRsRef(dataConnect, getExercisePRsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.personalRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.personalRecords);
});
```

## GetUserStreak
You can execute the `GetUserStreak` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getUserStreak(vars: GetUserStreakVariables): QueryPromise<GetUserStreakData, GetUserStreakVariables>;

interface GetUserStreakRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserStreakVariables): QueryRef<GetUserStreakData, GetUserStreakVariables>;
}
export const getUserStreakRef: GetUserStreakRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserStreak(dc: DataConnect, vars: GetUserStreakVariables): QueryPromise<GetUserStreakData, GetUserStreakVariables>;

interface GetUserStreakRef {
  ...
  (dc: DataConnect, vars: GetUserStreakVariables): QueryRef<GetUserStreakData, GetUserStreakVariables>;
}
export const getUserStreakRef: GetUserStreakRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserStreakRef:
```typescript
const name = getUserStreakRef.operationName;
console.log(name);
```

### Variables
The `GetUserStreak` query requires an argument of type `GetUserStreakVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserStreakVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserStreak` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserStreakData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserStreak`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserStreak, GetUserStreakVariables } from '@iron-ai/dataconnect';

// The `GetUserStreak` query requires an argument of type `GetUserStreakVariables`:
const getUserStreakVars: GetUserStreakVariables = {
  userId: ..., 
};

// Call the `getUserStreak()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserStreak(getUserStreakVars);
// Variables can be defined inline as well.
const { data } = await getUserStreak({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserStreak(dataConnect, getUserStreakVars);

console.log(data.streaks);

// Or, you can use the `Promise` API.
getUserStreak(getUserStreakVars).then((response) => {
  const data = response.data;
  console.log(data.streaks);
});
```

### Using `GetUserStreak`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserStreakRef, GetUserStreakVariables } from '@iron-ai/dataconnect';

// The `GetUserStreak` query requires an argument of type `GetUserStreakVariables`:
const getUserStreakVars: GetUserStreakVariables = {
  userId: ..., 
};

// Call the `getUserStreakRef()` function to get a reference to the query.
const ref = getUserStreakRef(getUserStreakVars);
// Variables can be defined inline as well.
const ref = getUserStreakRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserStreakRef(dataConnect, getUserStreakVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.streaks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.streaks);
});
```

## GetAllAchievements
You can execute the `GetAllAchievements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getAllAchievements(): QueryPromise<GetAllAchievementsData, undefined>;

interface GetAllAchievementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllAchievementsData, undefined>;
}
export const getAllAchievementsRef: GetAllAchievementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllAchievements(dc: DataConnect): QueryPromise<GetAllAchievementsData, undefined>;

interface GetAllAchievementsRef {
  ...
  (dc: DataConnect): QueryRef<GetAllAchievementsData, undefined>;
}
export const getAllAchievementsRef: GetAllAchievementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllAchievementsRef:
```typescript
const name = getAllAchievementsRef.operationName;
console.log(name);
```

### Variables
The `GetAllAchievements` query has no variables.
### Return Type
Recall that executing the `GetAllAchievements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllAchievementsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAllAchievements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllAchievements } from '@iron-ai/dataconnect';


// Call the `getAllAchievements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllAchievements();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllAchievements(dataConnect);

console.log(data.achievements);

// Or, you can use the `Promise` API.
getAllAchievements().then((response) => {
  const data = response.data;
  console.log(data.achievements);
});
```

### Using `GetAllAchievements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllAchievementsRef } from '@iron-ai/dataconnect';


// Call the `getAllAchievementsRef()` function to get a reference to the query.
const ref = getAllAchievementsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllAchievementsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.achievements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.achievements);
});
```

## GetUserAchievements
You can execute the `GetUserAchievements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
getUserAchievements(vars: GetUserAchievementsVariables): QueryPromise<GetUserAchievementsData, GetUserAchievementsVariables>;

interface GetUserAchievementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserAchievementsVariables): QueryRef<GetUserAchievementsData, GetUserAchievementsVariables>;
}
export const getUserAchievementsRef: GetUserAchievementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserAchievements(dc: DataConnect, vars: GetUserAchievementsVariables): QueryPromise<GetUserAchievementsData, GetUserAchievementsVariables>;

interface GetUserAchievementsRef {
  ...
  (dc: DataConnect, vars: GetUserAchievementsVariables): QueryRef<GetUserAchievementsData, GetUserAchievementsVariables>;
}
export const getUserAchievementsRef: GetUserAchievementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserAchievementsRef:
```typescript
const name = getUserAchievementsRef.operationName;
console.log(name);
```

### Variables
The `GetUserAchievements` query requires an argument of type `GetUserAchievementsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserAchievementsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserAchievements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserAchievementsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserAchievements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserAchievements, GetUserAchievementsVariables } from '@iron-ai/dataconnect';

// The `GetUserAchievements` query requires an argument of type `GetUserAchievementsVariables`:
const getUserAchievementsVars: GetUserAchievementsVariables = {
  userId: ..., 
};

// Call the `getUserAchievements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserAchievements(getUserAchievementsVars);
// Variables can be defined inline as well.
const { data } = await getUserAchievements({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserAchievements(dataConnect, getUserAchievementsVars);

console.log(data.userAchievements);

// Or, you can use the `Promise` API.
getUserAchievements(getUserAchievementsVars).then((response) => {
  const data = response.data;
  console.log(data.userAchievements);
});
```

### Using `GetUserAchievements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserAchievementsRef, GetUserAchievementsVariables } from '@iron-ai/dataconnect';

// The `GetUserAchievements` query requires an argument of type `GetUserAchievementsVariables`:
const getUserAchievementsVars: GetUserAchievementsVariables = {
  userId: ..., 
};

// Call the `getUserAchievementsRef()` function to get a reference to the query.
const ref = getUserAchievementsRef(getUserAchievementsVars);
// Variables can be defined inline as well.
const ref = getUserAchievementsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserAchievementsRef(dataConnect, getUserAchievementsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userAchievements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userAchievements);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateWorkout
You can execute the `CreateWorkout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
createWorkout(vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;

interface CreateWorkoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
}
export const createWorkoutRef: CreateWorkoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorkout(dc: DataConnect, vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;

interface CreateWorkoutRef {
  ...
  (dc: DataConnect, vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
}
export const createWorkoutRef: CreateWorkoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorkoutRef:
```typescript
const name = createWorkoutRef.operationName;
console.log(name);
```

### Variables
The `CreateWorkout` mutation requires an argument of type `CreateWorkoutVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateWorkoutVariables {
  userId: string;
  name: string;
  type: string;
  dayOfWeek?: number | null;
  estimatedDurationMin?: number | null;
  targetMuscles?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateWorkout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorkoutData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorkoutData {
  workout_insert: Workout_Key;
}
```
### Using `CreateWorkout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorkout, CreateWorkoutVariables } from '@iron-ai/dataconnect';

// The `CreateWorkout` mutation requires an argument of type `CreateWorkoutVariables`:
const createWorkoutVars: CreateWorkoutVariables = {
  userId: ..., 
  name: ..., 
  type: ..., 
  dayOfWeek: ..., // optional
  estimatedDurationMin: ..., // optional
  targetMuscles: ..., // optional
};

// Call the `createWorkout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkout(createWorkoutVars);
// Variables can be defined inline as well.
const { data } = await createWorkout({ userId: ..., name: ..., type: ..., dayOfWeek: ..., estimatedDurationMin: ..., targetMuscles: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorkout(dataConnect, createWorkoutVars);

console.log(data.workout_insert);

// Or, you can use the `Promise` API.
createWorkout(createWorkoutVars).then((response) => {
  const data = response.data;
  console.log(data.workout_insert);
});
```

### Using `CreateWorkout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorkoutRef, CreateWorkoutVariables } from '@iron-ai/dataconnect';

// The `CreateWorkout` mutation requires an argument of type `CreateWorkoutVariables`:
const createWorkoutVars: CreateWorkoutVariables = {
  userId: ..., 
  name: ..., 
  type: ..., 
  dayOfWeek: ..., // optional
  estimatedDurationMin: ..., // optional
  targetMuscles: ..., // optional
};

// Call the `createWorkoutRef()` function to get a reference to the mutation.
const ref = createWorkoutRef(createWorkoutVars);
// Variables can be defined inline as well.
const ref = createWorkoutRef({ userId: ..., name: ..., type: ..., dayOfWeek: ..., estimatedDurationMin: ..., targetMuscles: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorkoutRef(dataConnect, createWorkoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workout_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workout_insert);
});
```

## UpdateWorkout
You can execute the `UpdateWorkout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
updateWorkout(vars: UpdateWorkoutVariables): MutationPromise<UpdateWorkoutData, UpdateWorkoutVariables>;

interface UpdateWorkoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkoutVariables): MutationRef<UpdateWorkoutData, UpdateWorkoutVariables>;
}
export const updateWorkoutRef: UpdateWorkoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWorkout(dc: DataConnect, vars: UpdateWorkoutVariables): MutationPromise<UpdateWorkoutData, UpdateWorkoutVariables>;

interface UpdateWorkoutRef {
  ...
  (dc: DataConnect, vars: UpdateWorkoutVariables): MutationRef<UpdateWorkoutData, UpdateWorkoutVariables>;
}
export const updateWorkoutRef: UpdateWorkoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWorkoutRef:
```typescript
const name = updateWorkoutRef.operationName;
console.log(name);
```

### Variables
The `UpdateWorkout` mutation requires an argument of type `UpdateWorkoutVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateWorkoutVariables {
  id: UUIDString;
  name?: string | null;
  type?: string | null;
  dayOfWeek?: number | null;
  estimatedDurationMin?: number | null;
  targetMuscles?: string[] | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateWorkout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWorkoutData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWorkoutData {
  workout_update?: Workout_Key | null;
}
```
### Using `UpdateWorkout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWorkout, UpdateWorkoutVariables } from '@iron-ai/dataconnect';

// The `UpdateWorkout` mutation requires an argument of type `UpdateWorkoutVariables`:
const updateWorkoutVars: UpdateWorkoutVariables = {
  id: ..., 
  name: ..., // optional
  type: ..., // optional
  dayOfWeek: ..., // optional
  estimatedDurationMin: ..., // optional
  targetMuscles: ..., // optional
  isActive: ..., // optional
};

// Call the `updateWorkout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorkout(updateWorkoutVars);
// Variables can be defined inline as well.
const { data } = await updateWorkout({ id: ..., name: ..., type: ..., dayOfWeek: ..., estimatedDurationMin: ..., targetMuscles: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWorkout(dataConnect, updateWorkoutVars);

console.log(data.workout_update);

// Or, you can use the `Promise` API.
updateWorkout(updateWorkoutVars).then((response) => {
  const data = response.data;
  console.log(data.workout_update);
});
```

### Using `UpdateWorkout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWorkoutRef, UpdateWorkoutVariables } from '@iron-ai/dataconnect';

// The `UpdateWorkout` mutation requires an argument of type `UpdateWorkoutVariables`:
const updateWorkoutVars: UpdateWorkoutVariables = {
  id: ..., 
  name: ..., // optional
  type: ..., // optional
  dayOfWeek: ..., // optional
  estimatedDurationMin: ..., // optional
  targetMuscles: ..., // optional
  isActive: ..., // optional
};

// Call the `updateWorkoutRef()` function to get a reference to the mutation.
const ref = updateWorkoutRef(updateWorkoutVars);
// Variables can be defined inline as well.
const ref = updateWorkoutRef({ id: ..., name: ..., type: ..., dayOfWeek: ..., estimatedDurationMin: ..., targetMuscles: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWorkoutRef(dataConnect, updateWorkoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workout_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workout_update);
});
```

## DeleteWorkout
You can execute the `DeleteWorkout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
deleteWorkout(vars: DeleteWorkoutVariables): MutationPromise<DeleteWorkoutData, DeleteWorkoutVariables>;

interface DeleteWorkoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkoutVariables): MutationRef<DeleteWorkoutData, DeleteWorkoutVariables>;
}
export const deleteWorkoutRef: DeleteWorkoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteWorkout(dc: DataConnect, vars: DeleteWorkoutVariables): MutationPromise<DeleteWorkoutData, DeleteWorkoutVariables>;

interface DeleteWorkoutRef {
  ...
  (dc: DataConnect, vars: DeleteWorkoutVariables): MutationRef<DeleteWorkoutData, DeleteWorkoutVariables>;
}
export const deleteWorkoutRef: DeleteWorkoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteWorkoutRef:
```typescript
const name = deleteWorkoutRef.operationName;
console.log(name);
```

### Variables
The `DeleteWorkout` mutation requires an argument of type `DeleteWorkoutVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteWorkoutVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteWorkout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteWorkoutData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteWorkoutData {
  workout_delete?: Workout_Key | null;
}
```
### Using `DeleteWorkout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteWorkout, DeleteWorkoutVariables } from '@iron-ai/dataconnect';

// The `DeleteWorkout` mutation requires an argument of type `DeleteWorkoutVariables`:
const deleteWorkoutVars: DeleteWorkoutVariables = {
  id: ..., 
};

// Call the `deleteWorkout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteWorkout(deleteWorkoutVars);
// Variables can be defined inline as well.
const { data } = await deleteWorkout({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteWorkout(dataConnect, deleteWorkoutVars);

console.log(data.workout_delete);

// Or, you can use the `Promise` API.
deleteWorkout(deleteWorkoutVars).then((response) => {
  const data = response.data;
  console.log(data.workout_delete);
});
```

### Using `DeleteWorkout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteWorkoutRef, DeleteWorkoutVariables } from '@iron-ai/dataconnect';

// The `DeleteWorkout` mutation requires an argument of type `DeleteWorkoutVariables`:
const deleteWorkoutVars: DeleteWorkoutVariables = {
  id: ..., 
};

// Call the `deleteWorkoutRef()` function to get a reference to the mutation.
const ref = deleteWorkoutRef(deleteWorkoutVars);
// Variables can be defined inline as well.
const ref = deleteWorkoutRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteWorkoutRef(dataConnect, deleteWorkoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workout_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workout_delete);
});
```

## DeleteUserWorkouts
You can execute the `DeleteUserWorkouts` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
deleteUserWorkouts(vars: DeleteUserWorkoutsVariables): MutationPromise<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;

interface DeleteUserWorkoutsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserWorkoutsVariables): MutationRef<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;
}
export const deleteUserWorkoutsRef: DeleteUserWorkoutsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserWorkouts(dc: DataConnect, vars: DeleteUserWorkoutsVariables): MutationPromise<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;

interface DeleteUserWorkoutsRef {
  ...
  (dc: DataConnect, vars: DeleteUserWorkoutsVariables): MutationRef<DeleteUserWorkoutsData, DeleteUserWorkoutsVariables>;
}
export const deleteUserWorkoutsRef: DeleteUserWorkoutsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserWorkoutsRef:
```typescript
const name = deleteUserWorkoutsRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserWorkouts` mutation requires an argument of type `DeleteUserWorkoutsVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserWorkoutsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `DeleteUserWorkouts` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserWorkoutsData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserWorkoutsData {
  workout_deleteMany: number;
}
```
### Using `DeleteUserWorkouts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserWorkouts, DeleteUserWorkoutsVariables } from '@iron-ai/dataconnect';

// The `DeleteUserWorkouts` mutation requires an argument of type `DeleteUserWorkoutsVariables`:
const deleteUserWorkoutsVars: DeleteUserWorkoutsVariables = {
  userId: ..., 
};

// Call the `deleteUserWorkouts()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserWorkouts(deleteUserWorkoutsVars);
// Variables can be defined inline as well.
const { data } = await deleteUserWorkouts({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserWorkouts(dataConnect, deleteUserWorkoutsVars);

console.log(data.workout_deleteMany);

// Or, you can use the `Promise` API.
deleteUserWorkouts(deleteUserWorkoutsVars).then((response) => {
  const data = response.data;
  console.log(data.workout_deleteMany);
});
```

### Using `DeleteUserWorkouts`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserWorkoutsRef, DeleteUserWorkoutsVariables } from '@iron-ai/dataconnect';

// The `DeleteUserWorkouts` mutation requires an argument of type `DeleteUserWorkoutsVariables`:
const deleteUserWorkoutsVars: DeleteUserWorkoutsVariables = {
  userId: ..., 
};

// Call the `deleteUserWorkoutsRef()` function to get a reference to the mutation.
const ref = deleteUserWorkoutsRef(deleteUserWorkoutsVars);
// Variables can be defined inline as well.
const ref = deleteUserWorkoutsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserWorkoutsRef(dataConnect, deleteUserWorkoutsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workout_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workout_deleteMany);
});
```

## AddWorkoutExercise
You can execute the `AddWorkoutExercise` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
addWorkoutExercise(vars: AddWorkoutExerciseVariables): MutationPromise<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;

interface AddWorkoutExerciseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddWorkoutExerciseVariables): MutationRef<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;
}
export const addWorkoutExerciseRef: AddWorkoutExerciseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addWorkoutExercise(dc: DataConnect, vars: AddWorkoutExerciseVariables): MutationPromise<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;

interface AddWorkoutExerciseRef {
  ...
  (dc: DataConnect, vars: AddWorkoutExerciseVariables): MutationRef<AddWorkoutExerciseData, AddWorkoutExerciseVariables>;
}
export const addWorkoutExerciseRef: AddWorkoutExerciseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addWorkoutExerciseRef:
```typescript
const name = addWorkoutExerciseRef.operationName;
console.log(name);
```

### Variables
The `AddWorkoutExercise` mutation requires an argument of type `AddWorkoutExerciseVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AddWorkoutExercise` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddWorkoutExerciseData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddWorkoutExerciseData {
  workoutExercise_insert: WorkoutExercise_Key;
}
```
### Using `AddWorkoutExercise`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addWorkoutExercise, AddWorkoutExerciseVariables } from '@iron-ai/dataconnect';

// The `AddWorkoutExercise` mutation requires an argument of type `AddWorkoutExerciseVariables`:
const addWorkoutExerciseVars: AddWorkoutExerciseVariables = {
  workoutId: ..., 
  exerciseId: ..., 
  exerciseName: ..., 
  orderIndex: ..., 
  targetSets: ..., 
  targetReps: ..., 
  targetRpe: ..., // optional
  restSeconds: ..., // optional
  notes: ..., // optional
};

// Call the `addWorkoutExercise()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addWorkoutExercise(addWorkoutExerciseVars);
// Variables can be defined inline as well.
const { data } = await addWorkoutExercise({ workoutId: ..., exerciseId: ..., exerciseName: ..., orderIndex: ..., targetSets: ..., targetReps: ..., targetRpe: ..., restSeconds: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addWorkoutExercise(dataConnect, addWorkoutExerciseVars);

console.log(data.workoutExercise_insert);

// Or, you can use the `Promise` API.
addWorkoutExercise(addWorkoutExerciseVars).then((response) => {
  const data = response.data;
  console.log(data.workoutExercise_insert);
});
```

### Using `AddWorkoutExercise`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addWorkoutExerciseRef, AddWorkoutExerciseVariables } from '@iron-ai/dataconnect';

// The `AddWorkoutExercise` mutation requires an argument of type `AddWorkoutExerciseVariables`:
const addWorkoutExerciseVars: AddWorkoutExerciseVariables = {
  workoutId: ..., 
  exerciseId: ..., 
  exerciseName: ..., 
  orderIndex: ..., 
  targetSets: ..., 
  targetReps: ..., 
  targetRpe: ..., // optional
  restSeconds: ..., // optional
  notes: ..., // optional
};

// Call the `addWorkoutExerciseRef()` function to get a reference to the mutation.
const ref = addWorkoutExerciseRef(addWorkoutExerciseVars);
// Variables can be defined inline as well.
const ref = addWorkoutExerciseRef({ workoutId: ..., exerciseId: ..., exerciseName: ..., orderIndex: ..., targetSets: ..., targetReps: ..., targetRpe: ..., restSeconds: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addWorkoutExerciseRef(dataConnect, addWorkoutExerciseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workoutExercise_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workoutExercise_insert);
});
```

## UpdateWorkoutExercise
You can execute the `UpdateWorkoutExercise` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
updateWorkoutExercise(vars: UpdateWorkoutExerciseVariables): MutationPromise<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;

interface UpdateWorkoutExerciseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkoutExerciseVariables): MutationRef<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;
}
export const updateWorkoutExerciseRef: UpdateWorkoutExerciseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWorkoutExercise(dc: DataConnect, vars: UpdateWorkoutExerciseVariables): MutationPromise<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;

interface UpdateWorkoutExerciseRef {
  ...
  (dc: DataConnect, vars: UpdateWorkoutExerciseVariables): MutationRef<UpdateWorkoutExerciseData, UpdateWorkoutExerciseVariables>;
}
export const updateWorkoutExerciseRef: UpdateWorkoutExerciseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWorkoutExerciseRef:
```typescript
const name = updateWorkoutExerciseRef.operationName;
console.log(name);
```

### Variables
The `UpdateWorkoutExercise` mutation requires an argument of type `UpdateWorkoutExerciseVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateWorkoutExerciseVariables {
  id: UUIDString;
  orderIndex?: number | null;
  targetSets?: number | null;
  targetReps?: string | null;
  targetRpe?: number | null;
  restSeconds?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateWorkoutExercise` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWorkoutExerciseData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWorkoutExerciseData {
  workoutExercise_update?: WorkoutExercise_Key | null;
}
```
### Using `UpdateWorkoutExercise`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWorkoutExercise, UpdateWorkoutExerciseVariables } from '@iron-ai/dataconnect';

// The `UpdateWorkoutExercise` mutation requires an argument of type `UpdateWorkoutExerciseVariables`:
const updateWorkoutExerciseVars: UpdateWorkoutExerciseVariables = {
  id: ..., 
  orderIndex: ..., // optional
  targetSets: ..., // optional
  targetReps: ..., // optional
  targetRpe: ..., // optional
  restSeconds: ..., // optional
  notes: ..., // optional
};

// Call the `updateWorkoutExercise()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorkoutExercise(updateWorkoutExerciseVars);
// Variables can be defined inline as well.
const { data } = await updateWorkoutExercise({ id: ..., orderIndex: ..., targetSets: ..., targetReps: ..., targetRpe: ..., restSeconds: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWorkoutExercise(dataConnect, updateWorkoutExerciseVars);

console.log(data.workoutExercise_update);

// Or, you can use the `Promise` API.
updateWorkoutExercise(updateWorkoutExerciseVars).then((response) => {
  const data = response.data;
  console.log(data.workoutExercise_update);
});
```

### Using `UpdateWorkoutExercise`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWorkoutExerciseRef, UpdateWorkoutExerciseVariables } from '@iron-ai/dataconnect';

// The `UpdateWorkoutExercise` mutation requires an argument of type `UpdateWorkoutExerciseVariables`:
const updateWorkoutExerciseVars: UpdateWorkoutExerciseVariables = {
  id: ..., 
  orderIndex: ..., // optional
  targetSets: ..., // optional
  targetReps: ..., // optional
  targetRpe: ..., // optional
  restSeconds: ..., // optional
  notes: ..., // optional
};

// Call the `updateWorkoutExerciseRef()` function to get a reference to the mutation.
const ref = updateWorkoutExerciseRef(updateWorkoutExerciseVars);
// Variables can be defined inline as well.
const ref = updateWorkoutExerciseRef({ id: ..., orderIndex: ..., targetSets: ..., targetReps: ..., targetRpe: ..., restSeconds: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWorkoutExerciseRef(dataConnect, updateWorkoutExerciseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workoutExercise_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workoutExercise_update);
});
```

## RemoveWorkoutExercise
You can execute the `RemoveWorkoutExercise` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
removeWorkoutExercise(vars: RemoveWorkoutExerciseVariables): MutationPromise<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;

interface RemoveWorkoutExerciseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveWorkoutExerciseVariables): MutationRef<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;
}
export const removeWorkoutExerciseRef: RemoveWorkoutExerciseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeWorkoutExercise(dc: DataConnect, vars: RemoveWorkoutExerciseVariables): MutationPromise<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;

interface RemoveWorkoutExerciseRef {
  ...
  (dc: DataConnect, vars: RemoveWorkoutExerciseVariables): MutationRef<RemoveWorkoutExerciseData, RemoveWorkoutExerciseVariables>;
}
export const removeWorkoutExerciseRef: RemoveWorkoutExerciseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeWorkoutExerciseRef:
```typescript
const name = removeWorkoutExerciseRef.operationName;
console.log(name);
```

### Variables
The `RemoveWorkoutExercise` mutation requires an argument of type `RemoveWorkoutExerciseVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveWorkoutExerciseVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveWorkoutExercise` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveWorkoutExerciseData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveWorkoutExerciseData {
  workoutExercise_delete?: WorkoutExercise_Key | null;
}
```
### Using `RemoveWorkoutExercise`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeWorkoutExercise, RemoveWorkoutExerciseVariables } from '@iron-ai/dataconnect';

// The `RemoveWorkoutExercise` mutation requires an argument of type `RemoveWorkoutExerciseVariables`:
const removeWorkoutExerciseVars: RemoveWorkoutExerciseVariables = {
  id: ..., 
};

// Call the `removeWorkoutExercise()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeWorkoutExercise(removeWorkoutExerciseVars);
// Variables can be defined inline as well.
const { data } = await removeWorkoutExercise({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeWorkoutExercise(dataConnect, removeWorkoutExerciseVars);

console.log(data.workoutExercise_delete);

// Or, you can use the `Promise` API.
removeWorkoutExercise(removeWorkoutExerciseVars).then((response) => {
  const data = response.data;
  console.log(data.workoutExercise_delete);
});
```

### Using `RemoveWorkoutExercise`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeWorkoutExerciseRef, RemoveWorkoutExerciseVariables } from '@iron-ai/dataconnect';

// The `RemoveWorkoutExercise` mutation requires an argument of type `RemoveWorkoutExerciseVariables`:
const removeWorkoutExerciseVars: RemoveWorkoutExerciseVariables = {
  id: ..., 
};

// Call the `removeWorkoutExerciseRef()` function to get a reference to the mutation.
const ref = removeWorkoutExerciseRef(removeWorkoutExerciseVars);
// Variables can be defined inline as well.
const ref = removeWorkoutExerciseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeWorkoutExerciseRef(dataConnect, removeWorkoutExerciseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workoutExercise_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workoutExercise_delete);
});
```

## StartSession
You can execute the `StartSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
startSession(vars: StartSessionVariables): MutationPromise<StartSessionData, StartSessionVariables>;

interface StartSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: StartSessionVariables): MutationRef<StartSessionData, StartSessionVariables>;
}
export const startSessionRef: StartSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
startSession(dc: DataConnect, vars: StartSessionVariables): MutationPromise<StartSessionData, StartSessionVariables>;

interface StartSessionRef {
  ...
  (dc: DataConnect, vars: StartSessionVariables): MutationRef<StartSessionData, StartSessionVariables>;
}
export const startSessionRef: StartSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the startSessionRef:
```typescript
const name = startSessionRef.operationName;
console.log(name);
```

### Variables
The `StartSession` mutation requires an argument of type `StartSessionVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface StartSessionVariables {
  userId: string;
  workoutId?: UUIDString | null;
  workoutName: string;
}
```
### Return Type
Recall that executing the `StartSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `StartSessionData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface StartSessionData {
  session_insert: Session_Key;
}
```
### Using `StartSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, startSession, StartSessionVariables } from '@iron-ai/dataconnect';

// The `StartSession` mutation requires an argument of type `StartSessionVariables`:
const startSessionVars: StartSessionVariables = {
  userId: ..., 
  workoutId: ..., // optional
  workoutName: ..., 
};

// Call the `startSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await startSession(startSessionVars);
// Variables can be defined inline as well.
const { data } = await startSession({ userId: ..., workoutId: ..., workoutName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await startSession(dataConnect, startSessionVars);

console.log(data.session_insert);

// Or, you can use the `Promise` API.
startSession(startSessionVars).then((response) => {
  const data = response.data;
  console.log(data.session_insert);
});
```

### Using `StartSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, startSessionRef, StartSessionVariables } from '@iron-ai/dataconnect';

// The `StartSession` mutation requires an argument of type `StartSessionVariables`:
const startSessionVars: StartSessionVariables = {
  userId: ..., 
  workoutId: ..., // optional
  workoutName: ..., 
};

// Call the `startSessionRef()` function to get a reference to the mutation.
const ref = startSessionRef(startSessionVars);
// Variables can be defined inline as well.
const ref = startSessionRef({ userId: ..., workoutId: ..., workoutName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = startSessionRef(dataConnect, startSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.session_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.session_insert);
});
```

## UpdateSession
You can execute the `UpdateSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
updateSession(vars: UpdateSessionVariables): MutationPromise<UpdateSessionData, UpdateSessionVariables>;

interface UpdateSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSessionVariables): MutationRef<UpdateSessionData, UpdateSessionVariables>;
}
export const updateSessionRef: UpdateSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSession(dc: DataConnect, vars: UpdateSessionVariables): MutationPromise<UpdateSessionData, UpdateSessionVariables>;

interface UpdateSessionRef {
  ...
  (dc: DataConnect, vars: UpdateSessionVariables): MutationRef<UpdateSessionData, UpdateSessionVariables>;
}
export const updateSessionRef: UpdateSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSessionRef:
```typescript
const name = updateSessionRef.operationName;
console.log(name);
```

### Variables
The `UpdateSession` mutation requires an argument of type `UpdateSessionVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSessionData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSessionData {
  session_update?: Session_Key | null;
}
```
### Using `UpdateSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSession, UpdateSessionVariables } from '@iron-ai/dataconnect';

// The `UpdateSession` mutation requires an argument of type `UpdateSessionVariables`:
const updateSessionVars: UpdateSessionVariables = {
  id: ..., 
  status: ..., // optional
  completedAt: ..., // optional
  durationSeconds: ..., // optional
  totalVolume: ..., // optional
  exerciseCount: ..., // optional
  setCount: ..., // optional
  notes: ..., // optional
};

// Call the `updateSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSession(updateSessionVars);
// Variables can be defined inline as well.
const { data } = await updateSession({ id: ..., status: ..., completedAt: ..., durationSeconds: ..., totalVolume: ..., exerciseCount: ..., setCount: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSession(dataConnect, updateSessionVars);

console.log(data.session_update);

// Or, you can use the `Promise` API.
updateSession(updateSessionVars).then((response) => {
  const data = response.data;
  console.log(data.session_update);
});
```

### Using `UpdateSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSessionRef, UpdateSessionVariables } from '@iron-ai/dataconnect';

// The `UpdateSession` mutation requires an argument of type `UpdateSessionVariables`:
const updateSessionVars: UpdateSessionVariables = {
  id: ..., 
  status: ..., // optional
  completedAt: ..., // optional
  durationSeconds: ..., // optional
  totalVolume: ..., // optional
  exerciseCount: ..., // optional
  setCount: ..., // optional
  notes: ..., // optional
};

// Call the `updateSessionRef()` function to get a reference to the mutation.
const ref = updateSessionRef(updateSessionVars);
// Variables can be defined inline as well.
const ref = updateSessionRef({ id: ..., status: ..., completedAt: ..., durationSeconds: ..., totalVolume: ..., exerciseCount: ..., setCount: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSessionRef(dataConnect, updateSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.session_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.session_update);
});
```

## LogSet
You can execute the `LogSet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
logSet(vars: LogSetVariables): MutationPromise<LogSetData, LogSetVariables>;

interface LogSetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogSetVariables): MutationRef<LogSetData, LogSetVariables>;
}
export const logSetRef: LogSetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logSet(dc: DataConnect, vars: LogSetVariables): MutationPromise<LogSetData, LogSetVariables>;

interface LogSetRef {
  ...
  (dc: DataConnect, vars: LogSetVariables): MutationRef<LogSetData, LogSetVariables>;
}
export const logSetRef: LogSetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logSetRef:
```typescript
const name = logSetRef.operationName;
console.log(name);
```

### Variables
The `LogSet` mutation requires an argument of type `LogSetVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `LogSet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogSetData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogSetData {
  set_insert: Set_Key;
}
```
### Using `LogSet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logSet, LogSetVariables } from '@iron-ai/dataconnect';

// The `LogSet` mutation requires an argument of type `LogSetVariables`:
const logSetVars: LogSetVariables = {
  sessionId: ..., 
  exerciseId: ..., 
  exerciseName: ..., 
  setNumber: ..., 
  weight: ..., 
  reps: ..., 
  rpe: ..., // optional
  isWarmup: ..., // optional
  isPR: ..., // optional
  notes: ..., // optional
};

// Call the `logSet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logSet(logSetVars);
// Variables can be defined inline as well.
const { data } = await logSet({ sessionId: ..., exerciseId: ..., exerciseName: ..., setNumber: ..., weight: ..., reps: ..., rpe: ..., isWarmup: ..., isPR: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logSet(dataConnect, logSetVars);

console.log(data.set_insert);

// Or, you can use the `Promise` API.
logSet(logSetVars).then((response) => {
  const data = response.data;
  console.log(data.set_insert);
});
```

### Using `LogSet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logSetRef, LogSetVariables } from '@iron-ai/dataconnect';

// The `LogSet` mutation requires an argument of type `LogSetVariables`:
const logSetVars: LogSetVariables = {
  sessionId: ..., 
  exerciseId: ..., 
  exerciseName: ..., 
  setNumber: ..., 
  weight: ..., 
  reps: ..., 
  rpe: ..., // optional
  isWarmup: ..., // optional
  isPR: ..., // optional
  notes: ..., // optional
};

// Call the `logSetRef()` function to get a reference to the mutation.
const ref = logSetRef(logSetVars);
// Variables can be defined inline as well.
const ref = logSetRef({ sessionId: ..., exerciseId: ..., exerciseName: ..., setNumber: ..., weight: ..., reps: ..., rpe: ..., isWarmup: ..., isPR: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logSetRef(dataConnect, logSetVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.set_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.set_insert);
});
```

## CreatePR
You can execute the `CreatePR` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
createPr(vars: CreatePrVariables): MutationPromise<CreatePrData, CreatePrVariables>;

interface CreatePrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePrVariables): MutationRef<CreatePrData, CreatePrVariables>;
}
export const createPrRef: CreatePrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPr(dc: DataConnect, vars: CreatePrVariables): MutationPromise<CreatePrData, CreatePrVariables>;

interface CreatePrRef {
  ...
  (dc: DataConnect, vars: CreatePrVariables): MutationRef<CreatePrData, CreatePrVariables>;
}
export const createPrRef: CreatePrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPrRef:
```typescript
const name = createPrRef.operationName;
console.log(name);
```

### Variables
The `CreatePR` mutation requires an argument of type `CreatePrVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreatePR` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePrData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePrData {
  personalRecord_insert: PersonalRecord_Key;
}
```
### Using `CreatePR`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPr, CreatePrVariables } from '@iron-ai/dataconnect';

// The `CreatePR` mutation requires an argument of type `CreatePrVariables`:
const createPrVars: CreatePrVariables = {
  userId: ..., 
  exerciseId: ..., 
  exerciseName: ..., 
  recordType: ..., 
  value: ..., 
  weight: ..., // optional
  reps: ..., // optional
  setId: ..., // optional
  previousValue: ..., // optional
};

// Call the `createPr()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPr(createPrVars);
// Variables can be defined inline as well.
const { data } = await createPr({ userId: ..., exerciseId: ..., exerciseName: ..., recordType: ..., value: ..., weight: ..., reps: ..., setId: ..., previousValue: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPr(dataConnect, createPrVars);

console.log(data.personalRecord_insert);

// Or, you can use the `Promise` API.
createPr(createPrVars).then((response) => {
  const data = response.data;
  console.log(data.personalRecord_insert);
});
```

### Using `CreatePR`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPrRef, CreatePrVariables } from '@iron-ai/dataconnect';

// The `CreatePR` mutation requires an argument of type `CreatePrVariables`:
const createPrVars: CreatePrVariables = {
  userId: ..., 
  exerciseId: ..., 
  exerciseName: ..., 
  recordType: ..., 
  value: ..., 
  weight: ..., // optional
  reps: ..., // optional
  setId: ..., // optional
  previousValue: ..., // optional
};

// Call the `createPrRef()` function to get a reference to the mutation.
const ref = createPrRef(createPrVars);
// Variables can be defined inline as well.
const ref = createPrRef({ userId: ..., exerciseId: ..., exerciseName: ..., recordType: ..., value: ..., weight: ..., reps: ..., setId: ..., previousValue: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPrRef(dataConnect, createPrVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.personalRecord_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.personalRecord_insert);
});
```

## CreateStreak
You can execute the `CreateStreak` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
createStreak(vars: CreateStreakVariables): MutationPromise<CreateStreakData, CreateStreakVariables>;

interface CreateStreakRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStreakVariables): MutationRef<CreateStreakData, CreateStreakVariables>;
}
export const createStreakRef: CreateStreakRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStreak(dc: DataConnect, vars: CreateStreakVariables): MutationPromise<CreateStreakData, CreateStreakVariables>;

interface CreateStreakRef {
  ...
  (dc: DataConnect, vars: CreateStreakVariables): MutationRef<CreateStreakData, CreateStreakVariables>;
}
export const createStreakRef: CreateStreakRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStreakRef:
```typescript
const name = createStreakRef.operationName;
console.log(name);
```

### Variables
The `CreateStreak` mutation requires an argument of type `CreateStreakVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStreakVariables {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: TimestampString | null;
  streakStartDate?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreateStreak` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStreakData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStreakData {
  streak_insert: Streak_Key;
}
```
### Using `CreateStreak`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStreak, CreateStreakVariables } from '@iron-ai/dataconnect';

// The `CreateStreak` mutation requires an argument of type `CreateStreakVariables`:
const createStreakVars: CreateStreakVariables = {
  userId: ..., 
  currentStreak: ..., 
  longestStreak: ..., 
  lastWorkoutDate: ..., // optional
  streakStartDate: ..., // optional
};

// Call the `createStreak()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStreak(createStreakVars);
// Variables can be defined inline as well.
const { data } = await createStreak({ userId: ..., currentStreak: ..., longestStreak: ..., lastWorkoutDate: ..., streakStartDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStreak(dataConnect, createStreakVars);

console.log(data.streak_insert);

// Or, you can use the `Promise` API.
createStreak(createStreakVars).then((response) => {
  const data = response.data;
  console.log(data.streak_insert);
});
```

### Using `CreateStreak`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStreakRef, CreateStreakVariables } from '@iron-ai/dataconnect';

// The `CreateStreak` mutation requires an argument of type `CreateStreakVariables`:
const createStreakVars: CreateStreakVariables = {
  userId: ..., 
  currentStreak: ..., 
  longestStreak: ..., 
  lastWorkoutDate: ..., // optional
  streakStartDate: ..., // optional
};

// Call the `createStreakRef()` function to get a reference to the mutation.
const ref = createStreakRef(createStreakVars);
// Variables can be defined inline as well.
const ref = createStreakRef({ userId: ..., currentStreak: ..., longestStreak: ..., lastWorkoutDate: ..., streakStartDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStreakRef(dataConnect, createStreakVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.streak_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.streak_insert);
});
```

## UpdateStreak
You can execute the `UpdateStreak` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
updateStreak(vars: UpdateStreakVariables): MutationPromise<UpdateStreakData, UpdateStreakVariables>;

interface UpdateStreakRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStreakVariables): MutationRef<UpdateStreakData, UpdateStreakVariables>;
}
export const updateStreakRef: UpdateStreakRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStreak(dc: DataConnect, vars: UpdateStreakVariables): MutationPromise<UpdateStreakData, UpdateStreakVariables>;

interface UpdateStreakRef {
  ...
  (dc: DataConnect, vars: UpdateStreakVariables): MutationRef<UpdateStreakData, UpdateStreakVariables>;
}
export const updateStreakRef: UpdateStreakRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStreakRef:
```typescript
const name = updateStreakRef.operationName;
console.log(name);
```

### Variables
The `UpdateStreak` mutation requires an argument of type `UpdateStreakVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStreakVariables {
  id: UUIDString;
  currentStreak?: number | null;
  longestStreak?: number | null;
  lastWorkoutDate?: TimestampString | null;
  streakStartDate?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateStreak` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStreakData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStreakData {
  streak_update?: Streak_Key | null;
}
```
### Using `UpdateStreak`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStreak, UpdateStreakVariables } from '@iron-ai/dataconnect';

// The `UpdateStreak` mutation requires an argument of type `UpdateStreakVariables`:
const updateStreakVars: UpdateStreakVariables = {
  id: ..., 
  currentStreak: ..., // optional
  longestStreak: ..., // optional
  lastWorkoutDate: ..., // optional
  streakStartDate: ..., // optional
};

// Call the `updateStreak()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStreak(updateStreakVars);
// Variables can be defined inline as well.
const { data } = await updateStreak({ id: ..., currentStreak: ..., longestStreak: ..., lastWorkoutDate: ..., streakStartDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStreak(dataConnect, updateStreakVars);

console.log(data.streak_update);

// Or, you can use the `Promise` API.
updateStreak(updateStreakVars).then((response) => {
  const data = response.data;
  console.log(data.streak_update);
});
```

### Using `UpdateStreak`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStreakRef, UpdateStreakVariables } from '@iron-ai/dataconnect';

// The `UpdateStreak` mutation requires an argument of type `UpdateStreakVariables`:
const updateStreakVars: UpdateStreakVariables = {
  id: ..., 
  currentStreak: ..., // optional
  longestStreak: ..., // optional
  lastWorkoutDate: ..., // optional
  streakStartDate: ..., // optional
};

// Call the `updateStreakRef()` function to get a reference to the mutation.
const ref = updateStreakRef(updateStreakVars);
// Variables can be defined inline as well.
const ref = updateStreakRef({ id: ..., currentStreak: ..., longestStreak: ..., lastWorkoutDate: ..., streakStartDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStreakRef(dataConnect, updateStreakVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.streak_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.streak_update);
});
```

## CreateAchievement
You can execute the `CreateAchievement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
createAchievement(vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;

interface CreateAchievementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
}
export const createAchievementRef: CreateAchievementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAchievement(dc: DataConnect, vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;

interface CreateAchievementRef {
  ...
  (dc: DataConnect, vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
}
export const createAchievementRef: CreateAchievementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAchievementRef:
```typescript
const name = createAchievementRef.operationName;
console.log(name);
```

### Variables
The `CreateAchievement` mutation requires an argument of type `CreateAchievementVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateAchievement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAchievementData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAchievementData {
  achievement_insert: Achievement_Key;
}
```
### Using `CreateAchievement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAchievement, CreateAchievementVariables } from '@iron-ai/dataconnect';

// The `CreateAchievement` mutation requires an argument of type `CreateAchievementVariables`:
const createAchievementVars: CreateAchievementVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  category: ..., 
  icon: ..., // optional
  requirementType: ..., 
  requirementTarget: ..., 
  requirementExerciseId: ..., // optional
  xpReward: ..., // optional
  isSecret: ..., // optional
};

// Call the `createAchievement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAchievement(createAchievementVars);
// Variables can be defined inline as well.
const { data } = await createAchievement({ id: ..., name: ..., description: ..., category: ..., icon: ..., requirementType: ..., requirementTarget: ..., requirementExerciseId: ..., xpReward: ..., isSecret: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAchievement(dataConnect, createAchievementVars);

console.log(data.achievement_insert);

// Or, you can use the `Promise` API.
createAchievement(createAchievementVars).then((response) => {
  const data = response.data;
  console.log(data.achievement_insert);
});
```

### Using `CreateAchievement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAchievementRef, CreateAchievementVariables } from '@iron-ai/dataconnect';

// The `CreateAchievement` mutation requires an argument of type `CreateAchievementVariables`:
const createAchievementVars: CreateAchievementVariables = {
  id: ..., 
  name: ..., 
  description: ..., 
  category: ..., 
  icon: ..., // optional
  requirementType: ..., 
  requirementTarget: ..., 
  requirementExerciseId: ..., // optional
  xpReward: ..., // optional
  isSecret: ..., // optional
};

// Call the `createAchievementRef()` function to get a reference to the mutation.
const ref = createAchievementRef(createAchievementVars);
// Variables can be defined inline as well.
const ref = createAchievementRef({ id: ..., name: ..., description: ..., category: ..., icon: ..., requirementType: ..., requirementTarget: ..., requirementExerciseId: ..., xpReward: ..., isSecret: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAchievementRef(dataConnect, createAchievementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.achievement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.achievement_insert);
});
```

## AwardAchievement
You can execute the `AwardAchievement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
awardAchievement(vars: AwardAchievementVariables): MutationPromise<AwardAchievementData, AwardAchievementVariables>;

interface AwardAchievementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AwardAchievementVariables): MutationRef<AwardAchievementData, AwardAchievementVariables>;
}
export const awardAchievementRef: AwardAchievementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
awardAchievement(dc: DataConnect, vars: AwardAchievementVariables): MutationPromise<AwardAchievementData, AwardAchievementVariables>;

interface AwardAchievementRef {
  ...
  (dc: DataConnect, vars: AwardAchievementVariables): MutationRef<AwardAchievementData, AwardAchievementVariables>;
}
export const awardAchievementRef: AwardAchievementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the awardAchievementRef:
```typescript
const name = awardAchievementRef.operationName;
console.log(name);
```

### Variables
The `AwardAchievement` mutation requires an argument of type `AwardAchievementVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AwardAchievementVariables {
  userId: string;
  achievementId: string;
  progress?: number | null;
}
```
### Return Type
Recall that executing the `AwardAchievement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AwardAchievementData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AwardAchievementData {
  userAchievement_insert: UserAchievement_Key;
}
```
### Using `AwardAchievement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, awardAchievement, AwardAchievementVariables } from '@iron-ai/dataconnect';

// The `AwardAchievement` mutation requires an argument of type `AwardAchievementVariables`:
const awardAchievementVars: AwardAchievementVariables = {
  userId: ..., 
  achievementId: ..., 
  progress: ..., // optional
};

// Call the `awardAchievement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await awardAchievement(awardAchievementVars);
// Variables can be defined inline as well.
const { data } = await awardAchievement({ userId: ..., achievementId: ..., progress: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await awardAchievement(dataConnect, awardAchievementVars);

console.log(data.userAchievement_insert);

// Or, you can use the `Promise` API.
awardAchievement(awardAchievementVars).then((response) => {
  const data = response.data;
  console.log(data.userAchievement_insert);
});
```

### Using `AwardAchievement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, awardAchievementRef, AwardAchievementVariables } from '@iron-ai/dataconnect';

// The `AwardAchievement` mutation requires an argument of type `AwardAchievementVariables`:
const awardAchievementVars: AwardAchievementVariables = {
  userId: ..., 
  achievementId: ..., 
  progress: ..., // optional
};

// Call the `awardAchievementRef()` function to get a reference to the mutation.
const ref = awardAchievementRef(awardAchievementVars);
// Variables can be defined inline as well.
const ref = awardAchievementRef({ userId: ..., achievementId: ..., progress: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = awardAchievementRef(dataConnect, awardAchievementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAchievement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAchievement_insert);
});
```

## UpdateAchievementProgress
You can execute the `UpdateAchievementProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [js/index.d.ts](./index.d.ts):
```typescript
updateAchievementProgress(vars: UpdateAchievementProgressVariables): MutationPromise<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;

interface UpdateAchievementProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAchievementProgressVariables): MutationRef<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;
}
export const updateAchievementProgressRef: UpdateAchievementProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAchievementProgress(dc: DataConnect, vars: UpdateAchievementProgressVariables): MutationPromise<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;

interface UpdateAchievementProgressRef {
  ...
  (dc: DataConnect, vars: UpdateAchievementProgressVariables): MutationRef<UpdateAchievementProgressData, UpdateAchievementProgressVariables>;
}
export const updateAchievementProgressRef: UpdateAchievementProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAchievementProgressRef:
```typescript
const name = updateAchievementProgressRef.operationName;
console.log(name);
```

### Variables
The `UpdateAchievementProgress` mutation requires an argument of type `UpdateAchievementProgressVariables`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAchievementProgressVariables {
  id: UUIDString;
  progress: number;
}
```
### Return Type
Recall that executing the `UpdateAchievementProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAchievementProgressData`, which is defined in [js/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAchievementProgressData {
  userAchievement_update?: UserAchievement_Key | null;
}
```
### Using `UpdateAchievementProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAchievementProgress, UpdateAchievementProgressVariables } from '@iron-ai/dataconnect';

// The `UpdateAchievementProgress` mutation requires an argument of type `UpdateAchievementProgressVariables`:
const updateAchievementProgressVars: UpdateAchievementProgressVariables = {
  id: ..., 
  progress: ..., 
};

// Call the `updateAchievementProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAchievementProgress(updateAchievementProgressVars);
// Variables can be defined inline as well.
const { data } = await updateAchievementProgress({ id: ..., progress: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAchievementProgress(dataConnect, updateAchievementProgressVars);

console.log(data.userAchievement_update);

// Or, you can use the `Promise` API.
updateAchievementProgress(updateAchievementProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userAchievement_update);
});
```

### Using `UpdateAchievementProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAchievementProgressRef, UpdateAchievementProgressVariables } from '@iron-ai/dataconnect';

// The `UpdateAchievementProgress` mutation requires an argument of type `UpdateAchievementProgressVariables`:
const updateAchievementProgressVars: UpdateAchievementProgressVariables = {
  id: ..., 
  progress: ..., 
};

// Call the `updateAchievementProgressRef()` function to get a reference to the mutation.
const ref = updateAchievementProgressRef(updateAchievementProgressVars);
// Variables can be defined inline as well.
const ref = updateAchievementProgressRef({ id: ..., progress: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAchievementProgressRef(dataConnect, updateAchievementProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAchievement_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAchievement_update);
});
```

