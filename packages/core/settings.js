//Test value, used rather than hard coding value on install 
export const DEFAULT_SESSION_LIMIT_MINUTES = 0.1;

//Half the task duration before unlock
export const DEFAULT_UNLOCK_RATIO = 0.5;


export const DEFAULT_BLOCKED_SITES = [
  "youtube.com",
  "instagram.com",
  "tiktok.com"
];

//Bundles above vars as the defualt settings
export const DEFAULT_SETTINGS = {
  sessionLimitMinutes: DEFAULT_SESSION_LIMIT_MINUTES,
  unlockRatio: DEFAULT_UNLOCK_RATIO,
  blockedSites: DEFAULT_BLOCKED_SITES
};

//Initial storage state upon installation 
export function getDefaultInstallState() {
  return {
    //Take bundle and use for defualt settings
    ...DEFAULT_SETTINGS,
    isSessionActive: false,
    isBlocked: false,
    sessionStartTime: null,
    savedTasks: [],
    sessionHistory: [],
    taskHistory: []
  };
}
