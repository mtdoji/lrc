class UIManager {
    constructor() {
        this.walletUI = document.getElementById('wallet-ui');
        this.wagerUI = document.getElementById('wager-ui');
        this.rollBtn = document.getElementById('roll-btn');
        this.endTurnBtn = document.getElementById('end-turn-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.rulesBtn = document.getElementById('rules-btn');
        this.modalContainer = document.getElementById('modal-container');
        this.stateManager = null;
    }

    attach() {
        // Button bindings
        this.rollBtn.addEventListener('click', ()=>this.onRollDice());
        this.endTurnBtn.addEventListener('click', ()=>this.onEndTurn());
        this.restartBtn.addEventListener('click', ()=>this.onRestart());
        this.rulesBtn.addEventListener('click', ()=>window.RulesModal && window.RulesModal.show());
        this.updateUI();
    }

    setStateManager(sm) {
        this.stateManager = sm;
    }

    updateUI() {
        // Update wallet and wager UI
        const p0 = window.WalletIntegration.getWallet(0);
        const p1 = window.WalletIntegration.getWallet(1);
        this.walletUI.textContent = `$AVAX: Red ${p0.balance} | White ${p1.balance}`;
        this.wagerUI.textContent = `$AVAX Wager: ${window.WagerSystem ? window.WagerSystem.currentWager : "?"}`;
    }

    onRollDice() {
        if (this.stateManager) this.stateManager.rollDice();
    }
    onEndTurn() {
        if (this.stateManager) this.stateManager.endTurn();
    }
    onRestart() {
        if (this.stateManager) this.stateManager.startGame();
    }
}

window.UIManager = UIManager;