(() => {
  // packages/core/settings.js
  var DEFAULT_SESSION_LIMIT_MINUTES = 0.1;
  var DEFAULT_UNLOCK_RATIO = 0.5;
  var DEFAULT_BLOCKED_SITES = [
    "youtube.com",
    "instagram.com",
    "tiktok.com"
  ];
  var DEFAULT_SETTINGS = {
    sessionLimitMinutes: DEFAULT_SESSION_LIMIT_MINUTES,
    unlockRatio: DEFAULT_UNLOCK_RATIO,
    blockedSites: DEFAULT_BLOCKED_SITES
  };
  function getDefaultInstallState() {
    return {
      ...DEFAULT_SETTINGS,
      isSessionActive: false,
      isBlocked: false,
      sessionStartTime: null,
      savedTasks: [],
      sessionHistory: [],
      taskHistory: []
    };
  }

  // packages/core/session.js
  function calculateElapsedMinutes(sessionStartTime, now = Date.now()) {
    if (!sessionStartTime) {
      return 0;
    }
    return (now - sessionStartTime) / 1e3 / 60;
  }
  function isSessionLimitReached(elapsedMinutes, sessionLimitMinutes) {
    return elapsedMinutes >= sessionLimitMinutes;
  }
  function createBlockedSessionState() {
    return {
      isBlocked: true,
      isSessionActive: false,
      sessionStartTime: null
    };
  }

  // packages/core/history.js
  function createSessionHistoryRecord({
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
  function appendSessionHistory(sessionHistory, record) {
    return [...sessionHistory || [], record];
  }

  // packages/core/storage/chrome.js
  function get(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  }
  function set(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
    });
  }

  // extension/background.js
  console.log("Doom Scroll Blocker background is running.");
  var SESSION_CHECK_INTERVAL_MS = 1e3;
  chrome.runtime.onInstalled.addListener(async () => {
    console.log("Doom Scroll Blocker installed or reloaded.");
    await set(getDefaultInstallState());
  });
  setInterval(async () => {
    const data = await get([
      "isSessionActive",
      "sessionStartTime",
      "sessionLimitMinutes",
      "isBlocked",
      "sessionHistory"
    ]);
    if (data.isSessionActive !== true || data.isBlocked === true) {
      return;
    }
    const elapsedTimeMinutes = calculateElapsedMinutes(data.sessionStartTime);
    if (!isSessionLimitReached(elapsedTimeMinutes, data.sessionLimitMinutes)) {
      return;
    }
    const sessionHistory = appendSessionHistory(
      data.sessionHistory,
      createSessionHistoryRecord({
        sessionStartTime: data.sessionStartTime,
        sessionEndTime: Date.now(),
        sessionLimitMinutes: data.sessionLimitMinutes,
        actualDurationMinutes: elapsedTimeMinutes,
        endedBy: "limit"
      })
    );
    await set({
      ...createBlockedSessionState(),
      sessionHistory
    });
    console.log("Session limit reached");
  }, SESSION_CHECK_INTERVAL_MS);
})();
