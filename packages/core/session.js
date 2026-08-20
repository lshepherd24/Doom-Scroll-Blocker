//Calculates the elapsed time in minutes for session
export function calculateElapsedMinutes(sessionStartTime, now = Date.now()) {
  if (!sessionStartTime) {
    return 0;
  }
  //Take current time - sessionStartTime to get difference, then turn to minutes
  return (now - sessionStartTime) / 1000 / 60;
}

//Determines if session limit has been hit if elapsed minutes of session is greater/equal to session limit
export function isSessionLimitReached(elapsedMinutes, sessionLimitMinutes) {
  return elapsedMinutes >= sessionLimitMinutes;
}

//Creates an active session state (session starts) and begins tracking activity, time, and if blocked
export function createActiveSessionState(sessionStartTime = Date.now()) {
  return {
    isSessionActive: true,
    isBlocked: false,
    sessionStartTime
  };
}

//Creates inactive session state (session ends) and resets activity, blocked, and start time values to baseline stats for next session tracking
//Does this without blocking sites, so new scroll session can begin with unblocked access
export function createStoppedSessionState() {
  return {
    isSessionActive: false,
    isBlocked: false,
    sessionStartTime: null
  };
}

//Creates blocked session state (session limit reached and blocks sites) and sets blocked, activity, and start time values to blocked values
//Does this with blocking sites, so current scroll session ends and user can start completing tasks to unlock new session
export function createBlockedSessionState() {
  return {
    isBlocked: true,
    isSessionActive: false,
    sessionStartTime: null
  };
}

//Creates unlocked session state (unblocks sites) so user can begin scrolling again on a new session 
//Unblocks websites
export function createUnlockedSessionState() {
  return {
    isBlocked: false,
    isSessionActive: false,
    sessionStartTime: null
  };
}
