// Web Audio API sound generation — no external files needed

function createAudioCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

export function playCrowdRoar() {
  const ctx = createAudioCtx();
  if (!ctx) return;
  const duration = 1.5;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.3);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.2);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + duration);
}

export function playLightningSound() {
  const ctx = createAudioCtx();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.3);
}

export function playTerminalBeep() {
  const ctx = createAudioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 880;
  osc.type = 'square';
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}
