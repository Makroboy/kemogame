// One physical MIDI synthesizer, distinct logical handles for each Java Player.
// Keep source bytes per handle: the synthesizer is not a per-sound cache.
export class KemoMidiChannel {
  constructor(engine, emitEnd, trace = () => {}) {
    this.engine = engine; this.emitEnd = emitEnd; this.trace = trace;
    this.active = null; this.tail = Promise.resolve(); this.nextId = 1;
    engine.addEventListener('end-of-media', () => {
      const player = this.active;
      if (!player) return;
      this.active = null; this.engine.volume = 0;
      this.trace('end', player);
      this.emitEnd(player);
    });
  }
  create() { return {id:this.nextId++, sequence:null, loops:0, volume:1, position:0}; }
  setSequence(player, bytes) {
    player.sequence = Uint8Array.from(bytes); player.position = 0;
    return -1; // Duration unknown to Java; the MIDI engine controls actual timing.
  }
  serial(action) {
    const task = this.tail.then(action); this.tail = task.catch(() => {}); return task;
  }
  play(player) {
    return this.serial(async () => {
      if (!player.sequence) throw new Error('Missing MIDI sequence');
      this.engine.volume = 0;
      if(this.active) await this.engine.send({cmd:'stop'});
      this.active = null;
      // Reload on every start, including repeats. This also resets the sequence.
      await this.engine.setSequence(player.sequence.buffer.slice(0));
      await this.engine.send({cmd:'loop',times:player.loops});
      if(player.position) await this.engine.send({cmd:'seek',pos:player.position});
      this.engine.volume = player.volume;
      this.active = player;
      await this.engine.send({cmd:'play'});
      this.trace('play', player);
    });
  }
  stop(player) {
    return this.serial(async () => {
      if(this.active!==player) return; // Stopping an old sound must not stop a new one.
      this.active=null; this.engine.volume=0; await this.engine.send({cmd:'stop'}); this.trace('stop',player);
    });
  }
  seek(player, position) {
    player.position=position;
    return this.serial(async()=>{
      if(this.active===player) await this.engine.send({cmd:'seek',pos:position});
    });
  }
  async position(player) { return this.active===player ? await this.engine.getPosition() : player.position; }
  volume(player, value) {player.volume=value;if(this.active===player)this.engine.volume=value;}
}
