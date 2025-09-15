// SoundManager is now a no-op to disable all sounds

class SoundManager {
    constructor() {}
    setMuted(mute) {}
    toggleMute() {}
    isMuted() { return true; }
    playMove() {}
    playCapture() {}
    playWin() {}
    playRollButton() {}
    playDiceRolling() {}
    playTurnChange() {}
}

window.SoundManager = SoundManager;