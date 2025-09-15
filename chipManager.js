class ChipManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.centerChips = 0;
    }

    resetChips(players, startingChips) {
        this.centerChips = 0;
        for (let p of players) {
            p.chips = startingChips;
        }
    }

    moveChip(fromPlayer, toPlayer) {
        // Animation handled in rendering
        // Logic: already moved in stateManager.processRollResults
    }

    moveChipToCenter(fromPlayer) {
        this.centerChips++;
    }
}

window.ChipManager = ChipManager;