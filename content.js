/*
content.js 

Runs inside selected websites and handles the blocking 
*/
console.log("Content script loaded.");

chrome.storage.local.get(
    [
        "isBlocked"
    ],

    (data) => 
    {
        if (data.isBlocked === true)
        {
            showBlockScreen();
        }
    }
);

chrome.storage.onChanged.addListener( (changes, areaName) => 
{
    if (areaName === "local" && changes.isBlocked)
    {
        if (changes.isBlocked.newValue === true)
        {
            showBlockScreen();
        }
    }
});

//Blocks the website with an overlay 
function showBlockScreen()
{
    if (document.getElementById("doomScrollBlockScreen") != null)
    {
        return;
    }

    //--------------------const--------------------------------------------

    const blockScreen = document.createElement("div");
    blockScreen.id = "doomScrollBlockScreen";

   //Message that shows when website becomes blocked 
    const message = document.createElement("h1");
    message.textContent = "Session limit reached.";

    
    //input sections for start task and finish task with name + duration
    const taskInput = document.createElement("input");
    taskInput.placeholder = "Enter task";

    const durationInput = document.createElement("input");
    durationInput.placeholder = "Task duration (minutes)";
    durationInput.type = "number";

    const beginTaskButton = document.createElement("button");
    beginTaskButton.textContent = "Begin Task";

    //unlock button
    const unlockButton = document.createElement("button");
    unlockButton.textContent = "Unlock";
    unlockButton.style.display = "none";

    //--------------------------visuals----------------------------------------
    //blocker dimensions 
    blockScreen.style.position = "fixed";
    blockScreen.style.top = "0";
    blockScreen.style.left = "0";
    blockScreen.style.width = "100%";
    blockScreen.style.height = "100%";
    blockScreen.style.zIndex = "999999"

    //blocker and text colors 
    blockScreen.style.backgroundColor = "black";
    blockScreen.style.color = "white";

    //text location and font
    blockScreen.style.display = "flex";
    blockScreen.style.justifyContent = "center";
    blockScreen.style.alignItems = "center";
    blockScreen.style.fontSize = "40px";

    blockScreen.style.flexDirection = "column";

    //styling for beginTask 
    taskInput.style.marginTop = "20px";
    taskInput.style.padding = "10px";

    durationInput.style.marginTop = "10px";
    durationInput.style.padding = "10px";

    beginTaskButton.style.marginTop = "20px";
    beginTaskButton.style.padding = "10px";
    beginTaskButton.style.fontSize = "20px";

    //styling for unlockButton
    unlockButton.style.marginTop = "20px";
    unlockButton.style.padding = "10px";
    unlockButton.style.fontSize = "20px";

//------------------event listeners----------------------------------------------

    beginTaskButton.addEventListener("click", () =>
    {
        const taskName = taskInput.value;
        const taskDuration = Number(durationInput.value);

        //at least half that time of a specific duration must pass before unlock elegible (if task = 1hr then at least 30 mins pass before unlock)
        const unlockMinutes = taskDuration / 2;
        const unlockTime = Date.now() + unlockMinutes * 60 * 1000
        
        chrome.storage.local.set(
            {
                isBlocked:true, isSessionActive:false, sessionStartTime:null, currentTaskName:taskName, 
                    currentTaskDuration:taskDuration, unlockMinutes:unlockMinutes, taskStartTime:Date.now(), unlockTime:unlockTime
            }
        );

        message.textContent = "Task started: " + taskName + "\nUnlock available in " + unlockMinutes + " minutes";
        taskInput.remove(); 
        durationInput.remove();
        beginTaskButton.remove();

        unlockButton.style.display = "block";
    });

    unlockButton.addEventListener("click", () => 
    {
        chrome.storage.local.get(["unlockTime"], (data) => 
        {
            if (Date.now() >= data.unlockTime)
            {
                chrome.storage.local.set(
                    {
                        isBlocked:false, isSessionActive:false, sessionStartTime:null
                    }
                );
                
                blockScreen.remove();
            }
            else
            {
                const timeLeftSeconds = Math.ceil((data.unlockTime - Date.now()) / 1000);
                message.textContent = "Task timer still running" + "\nTry again in " + timeLeftSeconds + " seconds";
            }
        });
    });

//-----------------------appends-------------------------------------------
    blockScreen.appendChild(message);
    blockScreen.appendChild(taskInput);
    blockScreen.appendChild(durationInput);
    blockScreen.appendChild(beginTaskButton);
    blockScreen.appendChild(unlockButton);

    document.body.appendChild(blockScreen);
}