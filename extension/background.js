import {
  calculateElapsedMinutes,
  isSessionLimitReached,
  createBlockedSessionState,
  createSessionHistoryRecord,
  appendSessionHistory,
  getDefaultInstallState
} from "@doom-scroll/core";
import * as storage from "@doom-scroll/core/storage/chrome";

console.log("Doom Scroll Blocker background is running.");

const SESSION_CHECK_INTERVAL_MS = 1000;

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Doom Scroll Blocker installed or reloaded.");
  await storage.set(getDefaultInstallState());
});

setInterval(async () => {
  const data = await storage.get([
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

  await storage.set({
    ...createBlockedSessionState(),
    sessionHistory
  });

  console.log("Session limit reached");
}, SESSION_CHECK_INTERVAL_MS);
