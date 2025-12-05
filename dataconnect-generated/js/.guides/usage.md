# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createWorkout, updateWorkout, deleteWorkout, deleteUserWorkouts, addWorkoutExercise, updateWorkoutExercise, removeWorkoutExercise, startSession, updateSession, logSet } from '@iron-ai/dataconnect';


// Operation CreateWorkout:  For variables, look at type CreateWorkoutVars in ../index.d.ts
const { data } = await CreateWorkout(dataConnect, createWorkoutVars);

// Operation UpdateWorkout:  For variables, look at type UpdateWorkoutVars in ../index.d.ts
const { data } = await UpdateWorkout(dataConnect, updateWorkoutVars);

// Operation DeleteWorkout:  For variables, look at type DeleteWorkoutVars in ../index.d.ts
const { data } = await DeleteWorkout(dataConnect, deleteWorkoutVars);

// Operation DeleteUserWorkouts:  For variables, look at type DeleteUserWorkoutsVars in ../index.d.ts
const { data } = await DeleteUserWorkouts(dataConnect, deleteUserWorkoutsVars);

// Operation AddWorkoutExercise:  For variables, look at type AddWorkoutExerciseVars in ../index.d.ts
const { data } = await AddWorkoutExercise(dataConnect, addWorkoutExerciseVars);

// Operation UpdateWorkoutExercise:  For variables, look at type UpdateWorkoutExerciseVars in ../index.d.ts
const { data } = await UpdateWorkoutExercise(dataConnect, updateWorkoutExerciseVars);

// Operation RemoveWorkoutExercise:  For variables, look at type RemoveWorkoutExerciseVars in ../index.d.ts
const { data } = await RemoveWorkoutExercise(dataConnect, removeWorkoutExerciseVars);

// Operation StartSession:  For variables, look at type StartSessionVars in ../index.d.ts
const { data } = await StartSession(dataConnect, startSessionVars);

// Operation UpdateSession:  For variables, look at type UpdateSessionVars in ../index.d.ts
const { data } = await UpdateSession(dataConnect, updateSessionVars);

// Operation LogSet:  For variables, look at type LogSetVars in ../index.d.ts
const { data } = await LogSet(dataConnect, logSetVars);


```