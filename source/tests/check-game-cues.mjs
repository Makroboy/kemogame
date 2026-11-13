import fs from 'node:fs';import assert from 'node:assert/strict';
// Exercise the observer factory without the browser-only sender.
const src=fs.readFileSync(new URL('../../site/runtime/libjs/kemo-game-cues.js',import.meta.url),'utf8').split('const observeGameText=')[0];
const {createGameCueObserver}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
let callback;const events=[];
const observe=createGameCueObserver(cue=>events.push(cue),{setTimer:cb=>(callback=cb,1),clearTimer:()=>{callback=null;}});
observe('Level clear!');observe('game over!');observe('Options');assert.deepEqual(events,[]);
observe('Press 5');observe('Press 5');assert.deepEqual(events,['confirm']);callback();assert.deepEqual(events,['confirm',null]);
observe('level clear!');observe('level clear!');assert.deepEqual(events,['confirm',null,'options']);
observe('Press 5');assert.equal(events.at(-1),'confirm');callback();assert.equal(events.at(-1),null);
console.log('PASS browser game cues: exact completion text, character badge ignored, repeated paint deduplicated, confirm expiry, cue transitions');
