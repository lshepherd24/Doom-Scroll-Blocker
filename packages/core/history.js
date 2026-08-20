//Creates and returns a session history object 
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

//Takes existing session history and adds the new record to the end of the array and returns, 
//if no sessionHistory exists then create new array and add new record
export function appendSessionHistory(sessionHistory, newRecord) {
  return [...(sessionHistory || []), newRecord];
}

//Creates one history record
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

//Adds record object to array of all task records
//if no task history exists then creates new array and adds the new record
export function appendTaskHistory(taskHistory, record) {
  return [...(taskHistory || []), record];
}
