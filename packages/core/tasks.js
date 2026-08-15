export function normalizeTaskName(name) {
  return name.trim().toLowerCase();
}

export function validateTaskDuration(duration) {
  const value = Number(duration);

  if (!Number.isFinite(value) || value <= 0) {
    return {
      valid: false,
      error: "Enter a task duration greater than 0 minutes."
    };
  }

  return { valid: true, value };
}

export function calculateUnlockMinutes(taskDuration, unlockRatio = 0.5) {
  return taskDuration * unlockRatio;
}

export function calculateUnlockTime(taskStartTime, unlockMinutes) {
  return taskStartTime + unlockMinutes * 60 * 1000;
}

export function upsertSavedTask(savedTasks, taskName, taskDuration) {
  const tasks = [...savedTasks];
  const existingTask = tasks.find((task) => task.name === taskName);

  if (!existingTask) {
    tasks.push({
      name: taskName,
      durations: [taskDuration]
    });
    return tasks;
  }

  if (!existingTask.durations.includes(taskDuration)) {
    existingTask.durations.push(taskDuration);
  }

  return tasks;
}

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

export function getUnlockCountdownSeconds(unlockTime, now = Date.now()) {
  return Math.ceil((unlockTime - now) / 1000);
}

export function isUnlockAvailable(unlockTime, now = Date.now()) {
  return now >= unlockTime;
}
