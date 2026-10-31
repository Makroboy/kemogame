import fs from 'node:fs';import assert from 'node:assert/strict';
const src=fs.readFileSync(new URL('../../site/runtime/libjs/kemo-midi-channel.js',import.meta.url),'utf8');
const {KemoMidiChannel}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
class FakeEngine extends EventTarget{constructor(){super();this.calls=[];}async setSequence(b){this.calls.push(['sequence',...new Uint8Array(b)]);}async send(c){this.calls.push([c.cmd,c.times??c.pos]);}async getPosition(){return 0;}}
const engine=new FakeEngine(),ends=[];const channel=new KemoMidiChannel(engine,p=>ends.push(p));
const note=channel.create(),damage=channel.create(),title=channel.create();channel.setSequence(note,new Uint8Array([1]));channel.setSequence(damage,new Uint8Array([2]));channel.setSequence(title,new Uint8Array([3]));
await channel.play(note);await channel.play(damage);await channel.play(note);
assert.deepEqual(engine.calls.filter(c=>c[0]==='sequence'),[['sequence',1],['sequence',2],['sequence',1]]);
engine.calls=[];await channel.stop(damage);assert.equal(engine.calls.length,0);assert.equal(channel.active,note);
engine.dispatchEvent(new Event('end-of-media'));assert.deepEqual(ends,[note]);assert.equal(channel.active,null);
engine.calls=[];await channel.play(title);await channel.stop(title);assert.equal(channel.active,null);assert.equal(engine.volume,0);assert(engine.calls.some(c=>c[0]==='stop'));
engine.calls=[];for(let i=0;i<20;i++){await channel.play(title);engine.dispatchEvent(new Event('end-of-media'));}assert.equal(engine.calls.filter(c=>c[0]==='sequence').length,20);assert.equal(ends.length,21);
engine.calls=[];await Promise.all([channel.play(note),channel.play(damage),channel.play(note)]);assert.deepEqual(engine.calls.filter(c=>c[0]==='sequence'),[['sequence',1],['sequence',2],['sequence',1]]);
console.log('PASS MIDI routing: note/damage/note, stop isolation, completion owner, 20 reloads, serialized starts');
