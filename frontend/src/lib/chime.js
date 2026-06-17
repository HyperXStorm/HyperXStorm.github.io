// Soft singing-bowl-like chime using Web Audio API (no audio file needed).
// Two-note overlap with gentle attack/release envelope for a calming bell tone.
export function playResultChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    // Two harmonically related sine partials (F5 + C6) for a gentle bowl
    const notes = [
      { freq: 698.46, gain: 0.6, dur: 3.0 },
      { freq: 1046.5, gain: 0.35, dur: 2.6 },
      { freq: 1396.91, gain: 0.18, dur: 1.8 },
    ];
    notes.forEach(({ freq, gain, dur }, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(gain, now + 0.12 + i * 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(g);
      g.connect(master);
      osc.start(now + i * 0.05);
      osc.stop(now + dur + 0.1);
    });
  } catch {
    // silently ignore — chime is non-essential
  }
}
