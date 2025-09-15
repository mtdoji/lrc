class TurnManager {
    constructor() {
        this.currentTurn = 0;
    }

    nextTurn() {
        this.currentTurn = 1 - this.currentTurn;
        if(window.UIManager) window.UIManager.updateUI();
    }

    reset() {
        this.currentTurn = 0;
    }

    static getCurrentTurn() {
        if(window.gameLoop && window.gameLoop.stateManager && window.gameLoop.stateManager.turnManager)
            return window.gameLoop.stateManager.turnManager.currentTurn;
        return 0;
    }
}

window.TurnManager = TurnManager;