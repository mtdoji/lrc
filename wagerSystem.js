class WagerSystem {
    constructor() {
        this.currentWager = 5;
        this.lastWinner = null;
    }

    render(ctx) {
        // Draw AVAX wager in the center top
        ctx.save();
        ctx.font = "bold 22px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffd700";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 10;
        ctx.fillText("$AVAX Wager: " + this.currentWager, 480, 40);
        ctx.restore();
    }

    placeWager(amount) {
        this.currentWager = Math.max(1, Math.min(100, amount));
    }

    resolveWager(winnerIdx) {
        const loserIdx = winnerIdx===0?1:0;
        WalletIntegration.transfer(loserIdx, winnerIdx, this.currentWager);
        this.lastWinner = winnerIdx;
    }
}

window.WagerSystem = new WagerSystem();