export function createSessionHistoryRecord({
  sessionStartTime,
  sessionEndTime,
  sessionLimitMinutes,
  actualDurationMinutes,
  endedBy = "limit"
}) {
  return {
    sessionStartTime,
    sessionEndTime,
    sessionLimitMinutes,
    actualDurationMinutes,
    endedBy
  };
}

export function appendSessionHistory(sessionHistory, record) {
  return [...(sessionHistory || []), record];
}

export function createTaskHistoryRecord({
  taskName,
  taskDuration,
  taskStartTime,
  unlockMinutes,
  unlockTime
}) {
  return {
    taskName,
    taskDuration,
    taskStartTime,
    unlockMinutes,
    unlockTime
  };
}

export function appendTaskHistory(taskHistory, record) {
  return [...(taskHistory || []), record];
}
