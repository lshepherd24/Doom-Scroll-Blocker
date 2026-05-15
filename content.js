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

    const blockScreen = document.createElement("div");
    blockScreen.id = "doomScrollBlockScreen";

    blockScreen.textContent = "Session limit reached.";

    //blocker dimensions 
    blockScreen.style.position = "fixed";
    blockScreen.style.top = "0";
    blockScreen.style.top = "0";
    blockScreen.style.left = "0";
    blockScreen.style.width = "100%";
    blockScreen.style.height = "100%";
    blockScreen.style.zIndex = "999999"

    //blocker and text colors 
    blockScreen.style.backgroundColor = "black";
    blockScreen.style.color = "white";

    //text location and size
    blockScreen.style.display = "flex";
    blockScreen.style.justifyContent = "center";
    blockScreen.style.alignItems = "center";
    blockScreen.style.fontSize = "40px";

    document.body.appendChild(blockScreen);

}