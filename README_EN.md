# Script to Remove Anti-Cheat Protection

> STILL UNTESTED!!

[RU](./README.md) | [LV](./README_LV.md) | EN

## What is this?
This is a script that removes the [anti-cheat protection](https://www.youtube.com/watch?v=liw9UnEltU0) on online tests in [Uzdevumi.lv](https://uzdevumi.lv), which blocks the page when you switch tabs.


## How does this protection work?

1. Visibility State Spoofing (`visibilityState` and `hidden`)
The browser constantly sends events to the site when you switch to another tab or minimize the window (the `document.hidden` property becomes `true`, and `visibilityState` changes to `hidden`).
    - The script forcibly overrides these properties via `Object.defineProperty`, strictly forcing the browser to always return `false` and `'visible'`. For the site, you are "permanently glued" to the tab.
    - Additionally, the script mutes the event listeners for `visibilitychange`, `blur`, and `focus` so the site won't even attempt to detect focus loss.

2. Nullifying Network Requests (`reportAway` / `reportReturn`)
The protection engine has a built-in object `Yk.tabSwitchGuard` responsible for sending "snitch" reports to the server:
   - The `init` function is intercepted on the fly.
   - When the engine tries to initialize URLs for sending reports (`reportAway` — left, `reportReturn` — returned), the script replaces them with `null` and sets the `trackingEnabled` parameter to `false`.
   - As a result, even if the page tries to send data to the server, the requests simply won't go anywhere — the server remains completely in the dark.

3. Automatic UI Cleaner (`MutationObserver`)
If some local script on the page still triggers and tries to pop up a warning banner or block the screen (`#antiCheatTabSwitchWarning` or `#antiCheatTabSwitchLock`):

    - A `MutationObserver` kicks in — this is a guardian that monitors changes in the page's HTML tree in real time.
    - As soon as the anti-cheat tries to insert a blocker or warning into the DOM, the script instantly deletes it before you even have time to see it.

## How to run?

1. Open the required test or assessment on [Uzdevumi.lv](https://uzdevumi.lv).
2. Press the **`F12`** key (or right-click anywhere on the page -> **Inspect**) to open developer tools.
3. Go to the **Console** tab.
4. Type **allow pasting** and press **`Enter`**.
5. Then copy the contents of the [`bypass.js`](./bypass.js) file from this repository, paste it into the console, and press **`Enter`**:
> After completing each task, the script needs to be run again.
