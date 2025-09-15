class InputHandler {
    constructor(game) {
        this.game = game;
        this.attach();
    }

    attach() {
        // Key: Space or Enter for rolling if it's player's turn
        window.addEventListener('keydown', (e) => {
            if (this.game.stateManager.phase !== 'waiting') return;
            if (!this.game.stateManager.isHumanTurn()) return;
            if (e.code === 'Space' || e.code === 'Enter') {
                this.game.stateManager.playerRoll();
            }
        });
    }
}

window.InputHandler = InputHandler;