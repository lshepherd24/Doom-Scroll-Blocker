/*
popup.js

Controls extension popup behavior 
*/

console.log("Popup script loaded.");

//finds HTML element with id="startButton"
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

//gets status of session 
const statusText = document.getElementById("statusText");

//when button clicked start session 
startButton.addEventListener("click", () => 
{
    //start saving data in Chrome for extension to work
    chrome.storage.local.set(
        {
            isSessionActive: true, isBlocked:false, sessionStartTime: Date.now()
        }
    )

    statusText.textContent = "Session is active.";

    alert("Session Started");
});

//when button clicked stop session 
stopButton.addEventListener("click", () => 
{
    chrome.storage.local.set(
        {
            isSessionActive: false, isBlocked:false, sessionStartTime: null
        }
    )

    statusText.textContent = "No session active.";

    alert("Session Stopped");
});

chrome.storage.local.get(["isSessionActive", "isBlocked"], (data) => 
{
    if (data.isBlocked === true)
    {
        statusText.textContent = "Session limit reached.";
    }
    else if (data.isSessionActive == true)
    {
        statusText.textContent = "Session is active.";
    }
    else
    {
        statusText.textContent = "No session active";
    }
});