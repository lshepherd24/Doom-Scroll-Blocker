export function calculateElapsedMinutes(sessionStartTime, now = Date.now()) {
  if (!sessionStartTime) {
    return 0;
  }

  return (now - sessionStartTime) / 1000 / 60;
}

export function isSessionLimitReached(elapsedMinutes, sessionLimitMinutes) {
  return elapsedMinutes >= sessionLimitMinutes;
}

export function createActiveSessionState(sessionStartTime = Date.now()) {
  return {
    isSessionActive: true,
    isBlocked: false,
    sessionStartTime
  };
}

export function createStoppedSessionState() {
  return {
    isSessionActive: false,
    isBlocked: false,
    sessionStartTime: null
  };
}

export function createBlockedSessionState() {
  return {
    isBlocked: true,
    isSessionActive: false,
    sessionStartTime: null
  };
}

export function createUnlockedSessionState() {
  return {
    isBlocked: false,
    isSessionActive: false,
    sessionStartTime: null
  };
}
