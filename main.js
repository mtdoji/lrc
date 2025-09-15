/* Left Center Right (LCR) Game - main orchestrator */

class LCRGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        // Defensive: Ensure all dependencies exist
        window.StateManager = window.StateManager || {};
        window.Player = window.Player || function(){};
        window.AIBot = window.AIBot || function(){};
        window.Dice = window.Dice || {};
        window.ChipManager = window.ChipManager || {};
        window.UIRenderer = window.UIRenderer || {};
        window.InputHandler = window.InputHandler || {};

        // Game state
        this.stateManager = new window.StateManager(this);
        this.inputHandler = new window.InputHandler(this);
        this.uiRenderer = new window.UIRenderer(this);

        this.running = true;
        this.lastTimestamp = 0;
        this.gameLoop = this.gameLoop.bind(this);

        // Start game loop
        requestAnimationFrame(this.gameLoop);

        // UI
        this.uiRenderer.renderStaticUI();
    }

    gameLoop(timestamp) {
        if (!this.running) return;
        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        // Update + AI
        this.stateManager.update(delta);

        // Render
        this.render();

        requestAnimationFrame(this.gameLoop);
    }

    render() {
        // Always use current canvas size
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear
        this.ctx.clearRect(0, 0, width, height);

        // Draw table/background
        this.uiRenderer.renderTableBackground(width, height);

        // Draw chips (per player and center)
        this.uiRenderer.renderAllChips(width, height);

        // Draw dice if needed
        this.uiRenderer.renderDice(width, height);

        // Draw player panels
        this.uiRenderer.renderPlayerPanels(width, height);

        // Highlight current player
        this.uiRenderer.renderTurnHighlight(width, height);

        // Draw game message
        this.uiRenderer.renderGameMessage();

        // Draw buttons (handled by overlay DOM)
    }

    restartGame() {
        this.stateManager.restartGame();
        this.uiRenderer.clearOverlay();
        this.uiRenderer.renderStaticUI();
    }
}

window.LCRGame = LCRGame;

window.addEventListener('DOMContentLoaded', () => {
    window.lcrGameInstance = new LCRGame();
});