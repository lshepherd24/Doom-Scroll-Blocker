Current Project Progress (Doom Scroll Blocker)

Overview
This is a chrome extension designed to reduce excessive scrolling (doom-scrolling) on short form media platforms like TikTok, YouTube, Instagram
Rather than use broad daily limits, the extension focuses on individual scrolling sessions that incorporate enforced waiting periods with task based unlocking. 
The main goal is to encourage productivity through activites to decrease doom scroll time

Core Flow 
1) user starts a scroll session and timer tracks it
2) once a session limit is reached the website becomes blocked
3) user can select/enter a task with duration period where unlock timer then begins
4) once at least half of the given task's duration is complete the website becomes unblocked  
    (if user input "studying" for 60 minutes, then unlock is available at 30 minutes)

Technologies 
    Frontend
        - JavaScript
        - HTML
        - Chrome Extension Manifest V3
        - Chrome Extension APIs 
            - chrome.storage.local
            - chrome.runtime
            - chrome.storage.onChanged

    Development Tools
        - VS Code
        - Git and GitHub
        - Chrome Developer Mode

Current Features Implemented (In order of completion)
1) Chrome Extension Setup: establishes extension arch and connects extension component together
    - manifest V3 setup
    - background service worker
    - content script injection
    - popup UI

2) Session Tracking System: background script runs independently from webpage script
    - start and stop session buttons 
    - session state and timer tracking
    - Data Stored: session start time, active state, limit duration

3) Website Blocker Overlay: content script manipulates webpage document object model (DOM) directly
    - full screen blocker: blocks selected websites, prevents scrolling interactions, displays task system 
    - live webpage manipulation (content.js)
    - dynamic DOM creation (JavaScript)

4) Task Based Unlock System 
    - user task input, task duration input, unlock wait calculation
        (unlock time = task duration / 2)

5) Live Countdown Timer: setInterval in JavaScript
    - live countdown that updates every second on display

6) Reusable Saved Tasks
    - reusable task storage with duplicate prevention and multiple durations per task support
        (a task can have several durations)

7) Task History and Scroll Session Tracking: productivity and behavioral tracking 
    - stores all started tasks: task name, task duration, reusable saved tasks, task history
    - stores completed scrolling sessions: session active state, session start time, session duration limit, unlock time, session start/end time, total scroll dur

8) Suggested Tasks 
    - suggestion buttons that autofill task inputs when clicked 


Planned Future Work 
    - move storage system to IndexedDB
    - imporve UI styling now that logic is working
    - add settings page 
    - add user customization for blocked websites (potential other website: streaming services, games?)
    - add data/analytics dashboard specific to user

    - exapnd to desktop (from chrome extension)
        - Electron desktop application
        - SQLite database 
        - website dashboard
        - productivity statistics and visuals 
        - streak tracking / scoring system? 