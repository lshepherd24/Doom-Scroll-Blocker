import {
  normalizeTaskName,
  validateTaskDuration,
  upsertSavedTask,
  createTaskState,
  createTaskHistoryRecord,
  appendTaskHistory,
  createBlockedSessionState,
  createUnlockedSessionState,
  getUnlockCountdownSeconds,
  isUnlockAvailable
} from "@doom-scroll/core";
import * as storage from "@doom-scroll/core/storage/chrome";

console.log("Content script loaded.");

let countdownIntervalId = null;

function clearCountdownInterval() {
  if (countdownIntervalId !== null) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
}

async function initBlockScreen() {
  const data = await storage.get(["isBlocked"]);

  if (data.isBlocked === true) {
    showBlockScreen();
  }
}

storage.onChange((changes, areaName) => {
  if (areaName === "local" && changes.isBlocked?.newValue === true) {
    showBlockScreen();
  }
});

function showBlockScreen() {
  if (document.getElementById("doomScrollBlockScreen") != null) {
    return;
  }

  clearCountdownInterval();

  const blockScreen = document.createElement("div");
  blockScreen.id = "doomScrollBlockScreen";

  const message = document.createElement("h1");
  message.textContent = "Session limit reached.";

  const taskInput = document.createElement("input");
  taskInput.placeholder = "Enter task";

  const durationInput = document.createElement("input");
  durationInput.placeholder = "Task duration (minutes)";
  durationInput.type = "number";

  const beginTaskButton = document.createElement("button");
  beginTaskButton.textContent = "Begin Task";

  const unlockButton = document.createElement("button");
  unlockButton.textContent = "Unlock";
  unlockButton.style.display = "none";

  const suggestionContainer = document.createElement("div");

  blockScreen.style.position = "fixed";
  blockScreen.style.top = "0";
  blockScreen.style.left = "0";
  blockScreen.style.width = "100%";
  blockScreen.style.height = "100%";
  blockScreen.style.zIndex = "999999";
  blockScreen.style.backgroundColor = "black";
  blockScreen.style.color = "white";
  blockScreen.style.display = "flex";
  blockScreen.style.justifyContent = "center";
  blockScreen.style.alignItems = "center";
  blockScreen.style.fontSize = "40px";
  blockScreen.style.flexDirection = "column";

  taskInput.style.marginTop = "20px";
  taskInput.style.padding = "10px";
  durationInput.style.marginTop = "10px";
  durationInput.style.padding = "10px";
  beginTaskButton.style.marginTop = "20px";
  beginTaskButton.style.padding = "10px";
  beginTaskButton.style.fontSize = "20px";
  unlockButton.style.marginTop = "20px";
  unlockButton.style.padding = "10px";
  unlockButton.style.fontSize = "20px";
  suggestionContainer.style.display = "flex";
  suggestionContainer.style.flexWrap = "wrap";
  suggestionContainer.style.justifyContent = "center";
  suggestionContainer.style.marginTop = "20px";
  suggestionContainer.style.gap = "10px";

  storage.get(["savedTasks"]).then((data) => {
    const savedTasks = data.savedTasks || [];

    for (const task of savedTasks) {
      for (const duration of task.durations) {
        const suggestionButton = document.createElement("button");
        suggestionButton.textContent = `${task.name} (${duration})`;

        suggestionButton.addEventListener("click", () => {
          taskInput.value = task.name;
          durationInput.value = duration;
        });

        suggestionContainer.appendChild(suggestionButton);
      }
    }
  });

  beginTaskButton.addEventListener("click", async () => {
    const taskName = normalizeTaskName(taskInput.value);

    if (!taskName) {
      message.textContent = "Enter a task name before starting.";
      return;
    }

    const durationResult = validateTaskDuration(durationInput.value);

    if (!durationResult.valid) {
      message.textContent = durationResult.error;
      return;
    }

    const taskDuration = durationResult.value;
    const storedData = await storage.get([
      "savedTasks",
      "taskHistory",
      "unlockRatio"
    ]);
    const unlockRatio = storedData.unlockRatio ?? 0.5;
    const savedTasks = upsertSavedTask(
      storedData.savedTasks || [],
      taskName,
      taskDuration
    );
    const taskState = createTaskState(
      taskName,
      taskDuration,
      unlockRatio
    );
    const taskHistory = appendTaskHistory(
      storedData.taskHistory,
      createTaskHistoryRecord({
        taskName,
        taskDuration,
        taskStartTime: taskState.taskStartTime,
        unlockMinutes: taskState.unlockMinutes,
        unlockTime: taskState.unlockTime
      })
    );

    await storage.set({
      savedTasks,
      taskHistory,
      ...createBlockedSessionState(),
      ...taskState
    });

    message.textContent = `Task started: ${taskName}\nUnlock available in ${taskState.unlockMinutes} minutes`;
    taskInput.remove();
    durationInput.remove();
    beginTaskButton.remove();
    unlockButton.style.display = "block";

    clearCountdownInterval();
    countdownIntervalId = setInterval(() => {
      const timeLeftSeconds = getUnlockCountdownSeconds(taskState.unlockTime);

      if (timeLeftSeconds > 0) {
        message.textContent = `Task started: ${taskName}\nUnlock available in ${timeLeftSeconds} seconds`;
      } else {
        message.textContent = "Task mostly complete. Unlock available";
      }
    }, 1000);
  });

  unlockButton.addEventListener("click", async () => {
    const data = await storage.get(["unlockTime"]);

    if (isUnlockAvailable(data.unlockTime)) {
      await storage.set(createUnlockedSessionState());
      clearCountdownInterval();
      blockScreen.remove();
      return;
    }

    const timeLeftSeconds = getUnlockCountdownSeconds(data.unlockTime);
    message.textContent = `Task timer still running\nTry again in ${timeLeftSeconds} seconds`;
  });

  blockScreen.appendChild(message);
  blockScreen.appendChild(taskInput);
  blockScreen.appendChild(durationInput);
  blockScreen.appendChild(beginTaskButton);
  blockScreen.appendChild(unlockButton);
  blockScreen.appendChild(suggestionContainer);

  document.body.appendChild(blockScreen);
}

initBlockScreen();
