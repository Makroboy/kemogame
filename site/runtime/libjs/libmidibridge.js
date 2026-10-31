import {toneLabels} from './kemo-tone-labels.js';
import {KemoMidiChannel} from './kemo-midi-channel.js';
let channel;
function device() {
  if(!channel) channel=new KemoMidiChannel(window.libmidi.midiPlayer,
    player=>window.evtQueue.queueEvent({kind:'player-eom',player}),
    (kind,player)=>traceAudio(kind,player));
  return channel;
}
export default {
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_getMidiPlayer(){return device().create();},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiSetSequence(lib,player,sequence){return sequence?device().setSequence(player,sequence):-1;},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiPlay(lib,player){await device().play(player);},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiLoop(lib,player,times){player.loops=times;},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiStop(lib,player){await device().stop(player);},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiShortEvent(lib,player,status,data1,data2){window.libmidi.midiPlayer.shortEvent(status,data1,data2);},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiGetPosition(lib,player){return await device().position(player);},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiSeek(lib,player,pos){await device().seek(player,pos);},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiGetVolume(lib,player){return player.volume;},
 async Java_pl_zb3_freej2me_bridge_media_MidiBridge_midiSetVolume(lib,player,volume){device().volume(player,volume);return volume;}
};

function traceAudio(kind,player){
 if(!new URLSearchParams(location.search).has('audioDebug'))return;
 let hash=2166136261;for(const byte of player.sequence||[])hash=Math.imul(hash^byte,16777619)>>>0;
 const payload={kind,tone:toneLabels[hash]||String(hash),state:window.libmidi.context.state};
 parent.postMessage({kemoAudio:payload},location.origin);
 if(kind==='play'){
  const ctx=window.libmidi.context,analyser=ctx.createAnalyser();analyser.fftSize=1024;window.libmidi.midiPlayer.gainNode.connect(analyser);
  const samples=new Float32Array(analyser.fftSize);let peak=0,passes=0;
  const timer=setInterval(()=>{analyser.getFloatTimeDomainData(samples);for(const x of samples)peak=Math.max(peak,Math.abs(x));if(++passes===12){clearInterval(timer);window.libmidi.midiPlayer.gainNode.disconnect(analyser);parent.postMessage({kemoAudio:{...payload,kind:'signal',peak}},location.origin);}},40);
 }
}
