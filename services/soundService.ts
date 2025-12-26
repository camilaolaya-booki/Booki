
class SoundService {
  private ctx: AudioContext | null = null;

  private getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  playCoin() {
    this.playTone(1200, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1500, 'sine', 0.2, 0.08), 50);
  }

  playSuccess() {
    const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    tones.forEach((t, i) => {
      setTimeout(() => this.playTone(t, 'sine', 0.4, 0.05), i * 100);
    });
  }

  playError() {
    this.playTone(200, 'triangle', 0.3, 0.1);
    setTimeout(() => this.playTone(150, 'triangle', 0.4, 0.08), 100);
  }

  playUnlock() {
    const ctx = this.getCtx();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.playTone(800 + Math.random() * 800, 'sine', 0.3, 0.03);
      }, i * 80);
    }
  }
}

export const sounds = new SoundService();
