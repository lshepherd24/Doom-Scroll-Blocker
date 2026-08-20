//Takes name of task and reduces it to lowercase, with trim, to ensure all tasks have same naming style
export function normalizeTaskName(name) {
  return name.trim().toLowerCase();
}

//Ensures a given task duration time is valid for use
export function validateTaskDuration(duration) {
  const value = Number(duration);

  //Checks if the number is greater than 0 and finite, if not then valid is false and gives error message
  if (!Number.isFinite(value) || value <= 0) {
    return {
      valid: false,
      error: "Enter a task duration greater than 0 minutes."
    };
  }

  return { valid: true, value };
}

//Calculates the duration of a task in minutes that must pass before unlocking is available 
export function calculateUnlockMinutes(taskDuration, unlockRatio = 0.5) {
  return taskDuration * unlockRatio;
}

//Calculates the exact time that unlocking becomes available 
export function calculateUnlockTime(taskStartTime, unlockMinutes) {
  return taskStartTime + unlockMinutes * 60 * 1000;
}

//Adds saved tasks to an array of previous tasks, uses task name & duration
//A saved task will have a name and an array of durations
export function upsertSavedTask(savedTasks, taskName, taskDuration) {
  //Creates array with all previously saved tasks 
  const tasks = [...savedTasks];

  //Search through current array and check if task already exists 
  const existingTask = tasks.find(function(task)
  {
    return task.name === taskName;
  });

  //If task does not exist then push new task to array with name and duration
  if (!existingTask) {
    tasks.push({
      name: taskName,
      durations: [taskDuration]
    });
    return tasks;
  }

  //If array contains a specific task but not a specific duration then add the duration to the task's duration array 
  if (!existingTask.durations.includes(taskDuration)) {
    existingTask.durations.push(taskDuration);
  }

  return tasks;
}

//Creates and retursn one object with everything about the task state: name, duration, unlock minutes, start time, unlock time
export function createTaskState(taskName, taskDuration, unlockRatio, taskStartTime = Date.now()) {
  const unlockMinutes = calculateUnlockMinutes(taskDuration, unlockRatio);
  const unlockTime = calculateUnlockTime(taskStartTime, unlockMinutes);

  return {
    currentTaskName: taskName,
    currentTaskDuration: taskDuration,
    unlockMinutes,
    taskStartTime,
    unlockTime
  };
}

//Calculates the number of seconds left for unlock, but does not check if unlock is possible 
export function getUnlockCountdownSeconds(unlockTime, now = Date.now()) {
  return Math.ceil((unlockTime - now) / 1000);
}

//Checks if unlock time has been hit yet 
export function isUnlockAvailable(unlockTime, now = Date.now()) {
  return now >= unlockTime;
}
