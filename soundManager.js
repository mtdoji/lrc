class SoundManager {
    constructor() {
        this.ctx = null;
        this.buffers = {};
        this.muted = false; // Add muted state
        this._initAudio();
    }
    _initAudio() {
        try {
            this.ctx = window.AudioContext ? new window.AudioContext() : null;
        } catch (e) { this.ctx = null; }
    }
    setMuted(mute) {
        this.muted = !!mute;
    }
    toggleMute() {
        this.muted = !this.muted;
    }
    isMuted() {
        return !!this.muted;
    }
    _play(freq, duration, type="triangle", volume=0.09) {
        if (!this.ctx || this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    }
    playMove() { this._play(780, 0.07, "triangle"); }
    playCapture() { this._play(180, 0.12, "square"); }
    playWin() {
        if (!this.ctx || this.muted) return;
        const now = this.ctx.currentTime;
        const notes = [
            { freq: 880, time: 0, dur: 0.10 },
            { freq: 1175, time: 0.10, dur: 0.10 },
            { freq: 1568, time: 0.20, dur: 0.12 }
        ];
        for (let n of notes) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(n.freq, now + n.time);
            gain.gain.setValueAtTime(0.17, now + n.time);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + n.time);
            osc.stop(now + n.time + n.dur);
            gain.gain.linearRampToValueAtTime(0, now + n.time + n.dur);
        }
    }
    playRollButton() {
        this._play(620, 0.06, "square", 0.11);
    }
    playDiceRolling() {
        if (!this.ctx || this.muted) return;
        const bufferSize = this.ctx.sampleRate * 0.14;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.23;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.17, this.ctx.currentTime);
        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
        noise.stop(this.ctx.currentTime + 0.14);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.14);
    }
    playTurnChange() {
        this._play(390, 0.09, "triangle", 0.12);
    }
}

window.SoundManager = SoundManager;