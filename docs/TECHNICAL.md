# KemoGame browser edition

This edition runs the original KemoGame 1.0.1 J2ME program in a browser. The game JAR is unchanged. It is not a recreation with substitute sprites or rewritten levels.

## Start locally

1. Extract the entire package into one folder.
2. Open a terminal in that folder and run `python3 serve.py`.
3. Open http://localhost:8765 in a modern browser.
4. Click **Start game**. The initial launch downloads the CheerpJ runtime and can take a moment.
5. Once the title screen appears, press **O** or **Options** to open **Options**. Select **New game**, confirm with **5**, choose a character with **4 / 6**, then press **5** to play.

On macOS, `Kaynnista.command` provides the same startup using Python 3. If macOS does not allow opening the command file, use the terminal instructions above. Keep the terminal running while playing. Stop the server with Ctrl+C. Files must be served over HTTP; opening index.html directly is insufficient.

Python 3 and an internet connection are required for this bundled launcher. A Java installation is not required to play. The server listens only on this computer, not on the local network. To play on an iPhone, serve this folder from an HTTPS static web host with byte-range support. The game runtime and browser storage run on the device. This package has not been published.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Run left / right | Left / Right arrows or 4 / 6 | Hold 4 / 6 |
| Jump | Up, Space or original keys 1 / 2 / 3 | 1 / 2 / 3 |
| Start / confirm | Enter or 5 | 5 OK |
| Left soft key / Options | O | Options |
| Right soft key / Back | Backspace | Back |
| Navigate down | Down or 8 | 8 |
| Emulator settings | Esc | Keyboard only |

Computer keyboard top-row digits and a separate numeric keypad both send the corresponding original phone numbers. The numeric buttons retain the original phone layout. Direction and jump can be held simultaneously with separate fingers. Releasing, cancelling a pointer, losing focus or rotating the device releases held touch controls. The original in-game soft key labels indicate what each soft key does in the current menu. The title screen uses Options to start a new game.

## Display and full screen

The supplied closed Nokia 7650 photograph is the default frame. **Nokia 7650 photo frame** switches between the photograph and a plain frame. The screen is aligned over the photograph's display. An SVG clipping outline removes the photograph's white surround without altering the phone pixels.

**Full screen** removes the phone and enlarges the game, retaining touch controls. **Exit full screen** restores the phone view. Where the browser supports it, the page also requests the browser's native fullscreen mode. Otherwise, including browsers with restricted fullscreen support, it fills the available browser viewport using CSS.

On devices reporting a coarse touch pointer, landscape orientation displays **Rotate your phone to portrait**. Desktop landscape monitors remain usable. This is an orientation prompt, not a guaranteed hardware orientation lock. The game simulation is not paused automatically by the prompt.

The emulated display remains **176 × 208** pixels. The game itself defines its scene as **176 × 144** pixels in class `b` (`g()` and `i()`). The original game centers this scene in its MIDP canvas; the emulator supplies the surrounding menu and soft key area. Both are scaled uniformly. No game image is stretched, cropped or reflowed. Pixelated rendering is used. Scaling can be fractional to use available space; this preserves proportions but does not guarantee equally sized physical pixels at every window size.

## Original files inspected

| File | Findings / handling |
| --- | --- |
| KemoGame.jar | 70,508 bytes; 49 ZIP entries; Sumea KemoGame 1.0.1; MIDP 1.0 / CLDC 1.0; GameMIDlet entry point. Original bytecode, PNG sprites, level.bin and 11 OTT sound sequences are retained unchanged. |
| KemoGame.jad | Launch metadata and an obsolete local Windows/Symbian mail attachment URL. The original descriptor is preserved for reference; that path is not used by the browser. |
| KemoGame.ini | Contains only the obsolete MidpUpdateUrl. Preserved for reference, not used as browser settings. |
| rms.db | 4,938-byte Symbian/Psion-style database containing AppData and GameData names. Preserved unchanged. It is not a portable FreeJ2ME RMS export, and its historical save state has not been imported. The browser starts its own record stores. |

Original JAR SHA-256:
`988fa8047a0f5469dcc9ffd3ffc4b6afbdb67509d07ed34e26131d277a754877`

The original help says to collect all notes, move with 4 / 6, jump with 1 / 2 / 3 and avoid notes fired by loudspeakers. Completing all levels advertises a historical ringtone download address. That old destination has not been checked or updated.

## Sound compatibility

The bundled FreeJ2ME web runtime initially treated Nokia FORMAT_TONE as unsupported. Its Nokia Sound adapter has been patched for the 11 exact OTT payloads in this game. The original OTT files are decoded into MIDI note sequences using the FreeJ2ME-Plus NokiaOTTDecoder. The adapter identifies the exact original bytes by Java array hash and loads the corresponding decoded sequence from the runtime JAR. All 11 hashes are distinct. The game still controls when each original sound starts and stops.

This preserves the source note sequences; the browser synthesizer's timbre is not guaranteed to match the Nokia 7650 speaker. Press any game control to resume browser audio. Keep **Sound: on** in the game's Options and unmute the device. Audio output has not been compared by ear against a physical Nokia 7650.

## Verification and limits

Verified in the desktop in-app browser: fullscreen entry with the photograph hidden and proportional enlarged display, English interface, closed phone frame without white surround, original boot and title screens, Options, New game, Laura character selection, first-level rendering, rightward movement, note collection (23 to 22 remaining), and an on-screen jump button producing a visible airborne character. The unchanged original JAR was compared byte-for-byte with the bundled game. All 11 original sound payloads decoded successfully and their MIDI resources are bundled. JavaScript syntax checks passed.

Not verified: finishing every level, all character-specific sequences, historical rms.db migration, physical iPhone Safari touch/multitouch, device orientation transitions, or audibly identical hardware sound. Browser UI and compatibility modifications do not rewrite the original game's physics or level data. CheerpJ is downloaded externally, so this is not a fully offline standalone JavaScript port.

## Contents and rights

- `index.html`, `style.css`, `app.js`: English browser interface and controls.
- `runtime/`: FreeJ2ME browser runtime, its dependencies, patched JAR and packaged original game.
- `original/`: all four supplied original files, unchanged.
- `assets/`: user-supplied phone screenshots for this private-use version. The closed phone screenshot is active. See the [Mobile Phone Museum Nokia 7650 page](https://www.mobilephonemuseum.com/phone-detail/nokia-7650) for the museum reference. No public redistribution license for these photographs is asserted.
- `source/`: upstream source archive, patched Sound.java, original NokiaOTTDecoder.java, converter, minimal offline logging stub and rebuild script.

Game and photograph rights remain with their respective owners. This package was prepared for the user's own use and has not been publicly deployed.

FreeJ2ME web source: https://github.com/zb3/freej2me-web, commit c19416e75cbc15f9a27f7e967ee81cb108761e30. GPLv3-or-later; license included. The source archive contains its source and build resources. Browser JS changes are present directly in runtime/.

Nokia OTT decoder: https://github.com/TASEmulators/freej2me-plus, commit 3933e75ef927a95eab9f5e065f0b76dabf336069. GPLv3-or-later. Its full decoder source is included with its license header.

CheerpJ is a proprietary external runtime loaded from its vendor. See https://cheerpj.com/ for its terms. No CheerpJ binaries are redistributed in this package. Other dependency license notices are retained in the upstream source archive and runtime sources, including FluidSynth.

## Project history

The History button opens an English account based on Marko’s recollection of Mobile Kemopetrol, Hewlett-Packard’s Mobile E-Services Bazaar, Sumea’s game, and recovery of the files from the Nokia handset. It includes the supplied Google Drive links to the original archive and the Joystick appearance on Yle TV1 on 25 October 2002. How to play opens separately. Both dialogs support the close button, Escape and clicking outside the panel.

Alternative keyboard controls use one shared mapping whether the page or game canvas has focus. Options and Back buttons send the original soft keys; their action follows the label in the game. Holding two alternative keys for the same action keeps the action held until both are released. Standard Command, Control and Alt shortcuts are left to the browser.

The default on-screen controls show movement, Jump, OK, Options and Back. The original numeric phone keypad is available under Original keypad and is hidden in fullscreen mode. Physical numeric keys continue to work at all times.

The How to play dialog is device-neutral: keyboard and mouse controls for Windows PCs, Macs and other computers, and touch controls for phones and tablets, including iPad, iPhone and Android. These instructions describe the intended controls, not a claim that every listed physical device has been tested. Browser fullscreen availability depends on the device; the viewport-filling fallback remains available.

Touch controls use Pointer Events and separate pointer IDs for simultaneous movement and jumping. Pointer capture handles release outside a button; pointer cancellation, hidden pages, focus loss and orientation prompts release held inputs. Touch controls have at least 44-pixel targets, with larger movement controls. Portrait touch fullscreen layout also applies to tablets, rather than relying only on phone-width breakpoints. Physical-device testing is still required before claiming verified iOS, iPadOS or Android compatibility.

The History dialog also transcribes the supplied original About screen: KemoGame v1.0.1, Copyright 2002 Sumea, Music by Kemopetrol, and Ring Tone Conversion by HMM Software. The old URLs shown in that screen are omitted from this added credit section.

## Menu rendering fix

The browser runtime now uses the same ReentrantLock for MIDP menu rendering, queued canvas repainting and immediate canvas repainting. Previously, menu invalidation synchronized on the lock object’s Java monitor while the game used lock()/unlock(), allowing concurrent access to the same drawing surface. Every standard UI render also resets its drawing clip and translation before filling the white background. The original game JAR is unchanged. Patched Displayable.java and Canvas.java are included in source/ and rebuilt by source/rebuild.py. The runtime JAR has a new filename to avoid reusing a cached older runtime.

When leaving the native command menu, the canvas also clears the whole surface once before the next game repaint. This removes menu titles and rows from margins that the original game does not redraw.

Menu fix verification: white menu background checked from the title screen, character selection and active gameplay; clean game margins checked after leaving the menu; three additional consecutive open/close cycles passed in the in-app desktop browser.

## Original progression and sound behavior

The single-level claim has been removed. Each band member has a character-specific level. In the original e.class state machine, collecting the last note marks that character completed and plays the corresponding laura.ott, marko.ott, kalle.ott, kari.ott or teemu.ott once. The level-clear state waits about 20 seconds of game time, or skips its timer when key 5 is pressed (Enter / OK in the browser). Character selection uses left/right and 5. Already completed characters display Level clear!.

Original d.class audio calls: title.ott plays from the title screen with a requested repeat count of 20; note.ott plays once for an ordinary collected note; damage.ott once on damage; character-specific OTT once when the final note completes that level; gameover.ott once when entering game-over state; endofgame.ott once when entering the all-completed ending. selectchar.ott is loaded but has no playback call in d.class. No continuous gameplay music call is present. These are code-inspection findings, not an assertion that all sounds have been audited on physical hardware.

## Audio audit and playback correction

The game still runs its original d.class audio controller unchanged. Its title, note, damage, character-completion, game-over and all-completed calls determine playback. The Sound adapter now stops the previous Nokia Sound before starting the next one and starts each play request from the beginning. A corrected JS bridge keeps the MIDI bytes per logical player while sharing one physical synthesizer. It reloads the correct sequence on every start, delivers completion only to that sound, and prevents a stale stop request from stopping a newer sound. Gain is silenced immediately on stop so synthesizer tails cannot linger after Sound: off. The worklet seek call also now passes the required player pointer.

Start game creates and resumes the audio context within the actual user gesture. This allows the title tune to start when loading completes instead of waiting for a later Options press. Browsers may suspend audio again when backgrounded; game controls request resume.

Automated validation passed: all 11 original OTT payloads select exactly their corresponding decoded MIDI data; title play(20) starts exactly 20 times using the runtime's real BasePlayer; one-shot effects do not loop; changing sounds stops the previous player; stopped title playback does not restart; MIDI note/damage/note sequence switches back correctly; stale stops and simultaneous starts are handled. MIDI bridge regression: node source/tests/check-midi.mjs.

Browser validation measured nonzero Web Audio output for title.ott, damage.ott, gameover.ott and note.ott, with the context running; title repetitions and its stop on entering character selection were observed. Character-completion and all-completed triggers were checked in original bytecode and all their sound resource selections were tested; every level was not played through for this audit. The MIDI synthesizer's waveform, envelope and output device are not guaranteed to sound identical to a real Nokia 7650. This verifies playback selection and control behavior, not an acoustic comparison with original hardware.

An optional ?audioDebug=1 URL shows original asset names and measured Web Audio signal levels for diagnostics. It is absent in the normal UI.
