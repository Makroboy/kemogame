import {gameKey} from './controls.js';
const screen=document.querySelector('#screen');
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame?.contentWindow)return;if(e.data==='kemo-ready'){document.querySelector('#status').textContent='Ready. Choose New game in Options.';document.querySelector('#game-notice').classList.add('ready');document.querySelector('#ready-menu').hidden=false;}if(e.data==='kemo-menu'&&document.querySelector('#game-notice').classList.contains('ready')){document.querySelector('#game-notice').hidden=true;document.querySelector('#ready-menu').hidden=true;}if(e.data==='kemo-error')document.querySelector('#status').textContent='Loading failed. Check your connection and reload the page.';});let frame;const active=new Map();
function send(code,down){const c=frame?.contentDocument?.querySelector('canvas');if(!c)return;if(down&&gameKey(code)==='F1'&&document.querySelector('#game-notice').classList.contains('ready')){document.querySelector('#game-notice').hidden=true;document.querySelector('#ready-menu').hidden=true;}frame.contentWindow.libmidi?.context?.resume();c.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,key:code.startsWith('Digit')?code.slice(5):code,bubbles:true,cancelable:true}));}
function releaseAll(){
 const keys=new Set([...active.values(),...held.values()]);active.clear();held.clear();
 for(const code of keys)send(code,false);
 document.querySelectorAll('.active').forEach(b=>b.classList.remove('active'));
}
document.querySelector('#start').onclick=()=>{if(frame)return;const AudioContextType=window.AudioContext||window.webkitAudioContext;if(AudioContextType&&!window.kemoAudioContext){window.kemoAudioContext=new AudioContextType();window.kemoAudioContext.resume().catch(()=>{});}frame=document.createElement('iframe');frame.title='Original KemoGame';frame.allow='autoplay';frame.src='runtime/run.html?app=kemopetrol&fractionScale=1'+(new URLSearchParams(location.search).has('audioDebug')?'&audioDebug=1':'');screen.replaceChildren(frame);document.querySelector('#status').textContent='Loading game… This may take a moment. Please wait.';document.querySelector('#start').textContent='Game started';};
document.querySelector('#screen-start').onclick=()=>document.querySelector('#start').click();
document.querySelector('#photo').onchange=e=>document.querySelector('#phone').classList.toggle('photo',e.target.checked);
for(const b of document.querySelectorAll('[data-key]')){b.oncontextmenu=e=>e.preventDefault();b.onpointerdown=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();b.setPointerCapture(e.pointerId);const already=isHeld(b.dataset.key);active.set(e.pointerId,b.dataset.key);b.classList.add('active');if(!already)send(b.dataset.key,true);};const end=e=>{const code=active.get(e.pointerId);active.delete(e.pointerId);if(code&&!isHeld(code))send(code,false);if(!Array.from(active.values()).includes(code))b.classList.remove('active');};b.onpointerup=end;b.onpointercancel=end;b.onlostpointercapture=end;}
const held=new Map();
const isHeld=code=>Array.from(held.values()).includes(code)||Array.from(active.values()).includes(code);
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.target.matches('input:not([type=checkbox]):not([type=button]),textarea,[contenteditable=true]'))return;if(e.metaKey||e.ctrlKey||e.altKey)return;const code=gameKey(e.code);if(!/^(Digit[0-9]|F[12]|Escape|ArrowDown)$/.test(code))return;e.preventDefault();if(!e.repeat&&!held.has(e.code)){const already=isHeld(code);held.set(e.code,code);if(!already)send(code,true);}});
window.addEventListener('keyup',e=>{if(held.has(e.code)){const code=held.get(e.code);held.delete(e.code);if(!isHeld(code))send(code,false);}});
window.addEventListener('blur',()=>{for(const code of held.values())send(code,false);held.clear();releaseAll();});

const fullButton=document.querySelector('#fullscreen');
function syncFullButton(){const on=document.body.classList.contains('fullscreen');fullButton.textContent=on?'Exit full screen':'Full screen';fullButton.setAttribute('aria-pressed',String(on));}
fullButton.onclick=async()=>{if(!frame)document.querySelector('#start').click();releaseAll();const on=!document.body.classList.contains('fullscreen');document.body.classList.toggle('fullscreen',on);syncFullButton();try{if(on&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if(!on&&document.fullscreenElement)await document.exitFullscreen();}catch(error){/* iOS Safari uses the viewport-filling CSS mode. */}frame?.contentWindow.dispatchEvent(new Event('resize'));};
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('fullscreen');syncFullButton();}frame?.contentWindow.dispatchEvent(new Event('resize'));});
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&document.body.classList.contains('fullscreen')&&!document.fullscreenElement){document.body.classList.remove('fullscreen');syncFullButton();}});
function orientationHint(){const touch=matchMedia('(pointer:coarse)').matches;const landscape=innerWidth>innerHeight;document.querySelector('#rotate').hidden=!(touch&&landscape);if(touch&&landscape)releaseAll();}
window.addEventListener('resize',orientationHint);window.addEventListener('orientationchange',orientationHint);orientationHint();

for(const button of document.querySelectorAll('[data-dialog]')) button.addEventListener('click',()=>{releaseAll();for(const code of held.values())send(code,false);held.clear();document.getElementById(button.dataset.dialog).showModal();});
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});}

document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();});

document.querySelector('#ready-menu').onclick=()=>{send('F1',true);setTimeout(()=>send('F1',false),80);};

if(new URLSearchParams(location.search).has('audioDebug')){
 const log=document.createElement('pre');log.id='audio-audit';log.style.cssText='white-space:pre-wrap;font:11px monospace;background:#172e25;color:#d8ffeb;padding:12px;max-height:230px;overflow:auto';document.querySelector('header').after(log);
 window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===frame?.contentWindow&&event.data?.kemoAudio){log.textContent+=JSON.stringify(event.data.kemoAudio)+'\n';log.scrollTop=log.scrollHeight;}});
}

// Indicate off-screen touch controls without changing the game layout.
{
 const mobile=matchMedia('(max-width: 680px) and (pointer: coarse)');
 const controls=document.querySelector('.modern-controls');
 const hint=document.createElement('a');
 hint.id='controls-scroll-hint';hint.href='#touch-game-controls';
 hint.textContent='Controls below ↓ Scroll down';hint.hidden=true;
 controls.id='touch-game-controls';document.body.append(hint);
 let queued=false;
 function updateHint(){
  queued=false;
  const viewport=window.visualViewport;
  const bottom=(viewport?.offsetTop||0)+(viewport?.height||innerHeight);
  hint.hidden=!(mobile.matches&&!document.body.classList.contains('fullscreen')&&
   !document.querySelector('dialog[open]')&&document.querySelector('#rotate').hidden&&
   controls.getBoundingClientRect().top+24>bottom&&
   screen.getBoundingClientRect().top>(viewport?.offsetTop||0)+8);
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(updateHint);}}
 hint.addEventListener('click',event=>{event.preventDefault();const viewport=window.visualViewport;
  const top=viewport?.offsetTop||0;
  const bottom=top+(viewport?.height||innerHeight);
  const needed=Math.max(0,controls.getBoundingClientRect().top+44-bottom);
  const safe=Math.max(0,screen.getBoundingClientRect().top-top-8);
  window.scrollBy({top:Math.min(needed,safe),behavior:'smooth'});});
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 window.visualViewport?.addEventListener('resize',schedule);
 window.visualViewport?.addEventListener('scroll',schedule);
 mobile.addEventListener('change',schedule);
 new ResizeObserver(schedule).observe(document.querySelector('main'));
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
 for(const dialog of document.querySelectorAll('dialog'))new MutationObserver(schedule).observe(dialog,{attributes:true,attributeFilter:['open']});
 schedule();
}
