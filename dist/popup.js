(() => {
  // packages/core/session.js
  function calculateElapsedMinutes(sessionStartTime, now = Date.now()) {
    if (!sessionStartTime) {
      return 0;
    }
    return (now - sessionStartTime) / 1e3 / 60;
  }
  function createActiveSessionState(sessionStartTime = Date.now()) {
    return {
      isSessionActive: true,
      isBlocked: false,
      sessionStartTime
    };
  }
  function createStoppedSessionState() {
    return {
      isSessionActive: false,
      isBlocked: false,
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
  function appendSessionHistory(sessionHistory, newRecord) {
    return [...sessionHistory || [], newRecord];
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

  // extension/popup.js
  console.log("Popup script loaded.");
  var startButton = document.getElementById("startButton");
  var stopButton = document.getElementById("stopButton");
  var statusText = document.getElementById("statusText");
  function updateStatusText(data) {
    if (data.isBlocked === true) {
      statusText.textContent = "Session limit reached.";
    } else if (data.isSessionActive === true) {
      statusText.textContent = "Session is active.";
    } else {
      statusText.textContent = "No session active.";
    }
  }
  startButton.addEventListener("click", async () => {
    await set(createActiveSessionState());
    statusText.textContent = "Session is active.";
    alert("Session Started");
  });
  stopButton.addEventListener("click", async () => {
    const data = await get([
      "isSessionActive",
      "sessionStartTime",
      "sessionLimitMinutes",
      "sessionHistory"
    ]);
    if (data.isSessionActive === true && data.sessionStartTime) {
      const elapsedTimeMinutes = calculateElapsedMinutes(data.sessionStartTime);
      const sessionHistory = appendSessionHistory(
        data.sessionHistory,
        createSessionHistoryRecord({
          sessionStartTime: data.sessionStartTime,
          sessionEndTime: Date.now(),
          sessionLimitMinutes: data.sessionLimitMinutes,
          actualDurationMinutes: elapsedTimeMinutes,
          endedBy: "manual"
        })
      );
      await set({
        ...createStoppedSessionState(),
        sessionHistory
      });
    } else {
      await set(createStoppedSessionState());
    }
    statusText.textContent = "No session active.";
    alert("Session Stopped");
  });
  get(["isSessionActive", "isBlocked"]).then(updateStatusText);
})();
