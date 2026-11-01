# Exit and Start update

Exit now calls `window.parent.location.reload()` rather than navigating the game iframe to `./`. The host page returns to its idle state and waits for Start. The original game JAR is unchanged.

The idle phone screen now contains a high-contrast Start game button with a 44 px minimum touch height and a visible keyboard focus indicator. The page status explicitly asks the visitor to click or tap Start game. Both Start buttons share the existing launch handler.

Changed application files: `site/runtime/src/main.js`, `site/index.html`, `site/app.js`, `site/style.css`. Added: `tests/exit-regression.mjs` and this document.

Validation: `node tests/exit-regression.mjs` passes. JavaScript syntax checks pass. In-browser testing confirmed that the screen button creates the game iframe and displays the loading status; reloading restores the Start view. The complete CheerpJ game and its in-game Exit menu were not exercised end to end. Exit's real runtime callback was tested in an isolated JavaScript environment.

This package is a local update, not a deployment to GitHub Pages. The relevant runtime and app files were verified to match the current GitHub default branch before editing.

## Back command correction

`source/Displayable.java` now resolves the browser Back soft key to a BACK or CANCEL command, or a command labelled Back, regardless of its slot. This fixes single-command screens such as About, whose Back label is drawn on the left. Existing command-list dismissal stays unchanged. `source/Canvas.java` also accepts Back when there is only one command.

The compiled patch is in `site/runtime/freej2me-web-audio-v4-back-v1.jar`. `site/runtime/src/main.js` loads this new filename to avoid the prior cached runtime. `site/runtime/run.html` uses the back-v1 module version. `source/rebuild.py` targets the new runtime.

`source/tests/BackCommandTest.java` passed 16 routing cases across Displayable and Canvas with native graphics initialization bypassed for the test. Exit/Start regression also passes. The actual game screens were not retested in the browser: browser control was unavailable during this update. Reload the local test page and press Start game to load the corrected runtime.
