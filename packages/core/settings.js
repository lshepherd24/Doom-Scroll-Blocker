// Configurable via settings; kept at 0.1 for quick local testing.
export const DEFAULT_SESSION_LIMIT_MINUTES = 0.1;
export const DEFAULT_UNLOCK_RATIO = 0.5;

export const DEFAULT_BLOCKED_SITES = [
  "youtube.com",
  "instagram.com",
  "tiktok.com"
];

export const DEFAULT_SETTINGS = {
  sessionLimitMinutes: DEFAULT_SESSION_LIMIT_MINUTES,
  unlockRatio: DEFAULT_UNLOCK_RATIO,
  blockedSites: DEFAULT_BLOCKED_SITES
};

export function getDefaultInstallState() {
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
