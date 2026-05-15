/*
background.js 

File runs in background of Chrome extension 

File will control main session logic. 
- track is doom scroll session is active 
- track how much time has been used 
- detect when limit is reached
- tell content.js when to block specific website
- save session information with Chrome storage
*/

console.log("Doom Scroll Blocker background is running.");

chrome.runtime.onInstalled.addListener( () => 
{
    console.log("Doom Scroll Blocker installed or reloaded.");

    chrome.storage.local.set(
        {
            sessionLimitMinutes: 0.2, isSessionActive: false, isBlocked: false
        }
    );
});

setInterval( () =>
{
    chrome.storage.local.get(
        [
            "isSessionActive", "sessionStartTime", "sessionLimitMinutes", "isBlocked"
        ],

        (data) => 
        {
            if (data.isSessionActive === true && data.isBlocked === false)
            {
                const elapsedTimeMinutes = (Date.now() - data.sessionStartTime) / 1000 / 60;
                console.log(elapsedTimeMinutes);

                if (elapsedTimeMinutes >= data.sessionLimitMinutes)
                {
                    chrome.storage.local.set(
                        {
                            isBlocked: true
                        }  
                    );
                    console.log("Session limit reached.");
                }
            }
        }
    );
//run every 5000 milliseconds (5 sec)
}, 5000);

