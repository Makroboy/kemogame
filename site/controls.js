// Shared by the page and the emulated game so focus never changes the controls.
const aliases = {ArrowLeft:'Digit4',ArrowRight:'Digit6',ArrowUp:'Digit2',Space:'Digit2',ArrowDown:'Digit8',Enter:'Digit5',NumpadEnter:'Digit5',KeyO:'F1',Backspace:'F2'};
export function gameKey(code){if(['KeyA','KeyD','KeyS','KeyQ','KeyW','KeyM'].includes(code))return null;return /^Numpad[0-9]$/.test(code)?'Digit'+code.slice(6):(aliases[code]||code);}
