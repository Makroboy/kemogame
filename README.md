# KemoGame

The original 2002 Kemopetrol J2ME platform game for Nokia 7650, playable in a browser. Developed by Sumea, with music by Kemopetrol and ringtone conversion by HMM Software.

The original game JAR runs unchanged inside a patched FreeJ2ME web runtime with CheerpJ. All five band members have their own playable character and level.

## Play

After GitHub Pages is enabled for this repository, the site is served at `https://makroboy.github.io/kemogame/`.

Click **Start game** and allow a moment for loading. When **Game ready** appears, click **Menu**, select **New game**, confirm with **Enter / OK**, choose a character and confirm again.

- Computers: left/right arrows to move, up or Space to jump, Enter to confirm, M for Menu, Backspace for Back.
- Phones and tablets: on-screen arrows, Jump, OK, Menu and Back; hold a direction and jump with a second finger. Play in portrait orientation.
- **Full screen** hides the phone frame and enlarges the game. The original screen proportions are preserved.

An internet connection is required for the external CheerpJ runtime. No Java installation is needed.

## GitHub Pages setup

This is a separate project repository. Its deployment workflow publishes only `site/`. It does not change other repositories or the account's main GitHub Pages site.

Under **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source, then run the **Deploy KemoGame** workflow or push a change to `main`.

## Files

- `site/`: deployable game, interface and required runtime assets.
- `original/KemoGame.jar`: unchanged original game.
- `source/`: runtime patch sources, MIDI regression test and full upstream source archive.
- `docs/TECHNICAL.md`: implementation notes, original file findings and test limits. Historical local-package notes are retained there; this public package excludes the old save database and obsolete installer metadata.

For a local preview, serve `site/` over HTTP using a server with byte-range support. Opening HTML directly from disk is insufficient.

## Credits and rights

KemoGame v1.0.1, Copyright 2002 Sumea. Music by Kemopetrol. Ring Tone Conversion by HMM Software. Original game assets retain their respective rights; no new blanket license is granted over them.

The user confirmed permission to use the supplied Nokia 7650 photograph in this public edition on 31 October 2026. The photograph is not offered under the runtime's software license.

FreeJ2ME and the Nokia OTT decoder retain their upstream licenses and notices. The full FreeJ2ME source archive and modified source files are included. See LICENSE-FreeJ2ME.txt and original file headers; several components use Apache 2.0, EPL or dependency-specific licenses.

CheerpJ is an external proprietary runtime loaded from its vendor. See https://cheerpj.com/ for its terms. No CheerpJ runtime binaries are redistributed here.

More about the band: https://kemopetrol.com/
