// Observe existing rendered text. Never send keys or modify the original game.
export function createGameCueObserver(notify, {setTimer=setTimeout,clearTimer=clearTimeout}={}) {
 let cue=null,timer=null;
 function setCue(next){if(cue!==next){cue=next;notify(next);}}
 return text=>{
  // Capitalized "Level clear!" is a character-selection badge, not a completion screen.
  const next=text==='level clear!'?'options':text==='Press 5'?'confirm':null;
  if(!next)return;
  setCue(next);
  if(timer!==null)clearTimer(timer);
  timer=setTimer(()=>{timer=null;setCue(null);},1500);
 };
}
const observeGameText=createGameCueObserver(cue=>{
 window.parent.postMessage({kemoControlCue:cue},location.origin);
});
export {observeGameText};
