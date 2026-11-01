# Terminology audit

The original game’s English resources (`en`, `en.hlp`) were inspected alongside the web interface, status messages, keyboard mappings, runtime soft-key labels, README and technical notes. The original game JAR remains unchanged.

| Action | Consistent label | Keyboard |
| --- | --- | --- |
| Load browser game | Start game | Activate the button |
| Open game options | Options | O |
| Return | Back | Backspace |
| Confirm | OK | Enter |
| Begin a new game | New game | Select in Options |
| Enable sound | Sound: on | Select in Options |
| Completed character | Level clear! | Game status |
| Browser fullscreen | Full screen / Exit full screen | Activate the button |

Options replaces Menu in user-facing button names and instructions. The generic word menu remains where it describes a menu rather than naming a button. M is ignored consistently by both the parent page and game frame. The shared mapper routes O to the original left soft key. Internal identifiers such as `ready-menu` and `kemo-menu` are implementation details and unchanged.

The runtime-generated confirmation label is now OK rather than Okay. Runtime touch soft-key labels are Options and Back rather than L and R. The game instructions retain their original numeric controls; the browser help documents the corresponding modern controls. The original game’s Instructions screen and the site’s How to play dialog are separate views.

Automated Exit/Start, keyboard mapping, Back routing and MIDI regression checks pass. This audit inspected all English game text resources and reachable web-interface text in source; it does not claim a full visual playthrough of every level or screen.
