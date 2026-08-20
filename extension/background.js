//Initializes the extension and checks whether scrolling session has reached its limit
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

//Makes extension check session every 1 second (1000ms)
const SESSION_CHECK_INTERVAL_MS = 1000;

//Registers a function that Chrome calls when extension is installed/updated
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Doom Scroll Blocker installed or reloaded.");

  //Creates default storage object and saves object in chrome.storage.local
  await storage.set(getDefaultInstallState());
});

//Runs once per second (1000ms)
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

  //Creates session history entry and appends it to existing history and returns updated array 
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

  //Blocking the session, returns object containing state representing blocked session 
  await storage.set({
    ...createBlockedSessionState(),
    sessionHistory
  });

  console.log("Session limit reached");
}, SESSION_CHECK_INTERVAL_MS);
