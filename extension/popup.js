import {
  createActiveSessionState,
  createStoppedSessionState,
  calculateElapsedMinutes,
  createSessionHistoryRecord,
  appendSessionHistory
} from "@doom-scroll/core";
import * as storage from "@doom-scroll/core/storage/chrome";

console.log("Popup script loaded.");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusText = document.getElementById("statusText");

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
  await storage.set(createActiveSessionState());
  statusText.textContent = "Session is active.";
  alert("Session Started");
});

stopButton.addEventListener("click", async () => {
  const data = await storage.get([
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

    await storage.set({
      ...createStoppedSessionState(),
      sessionHistory
    });
  } else {
    await storage.set(createStoppedSessionState());
  }

  statusText.textContent = "No session active.";
  alert("Session Stopped");
});

storage.get(["isSessionActive", "isBlocked"]).then(updateStatusText);
