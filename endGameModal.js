class EndGameModal {
    static show(winnerIdx) {
        const container = document.getElementById('modal-container');
        let winner = winnerIdx===0 ? "Red ($AVAX)" : "White";
        container.innerHTML = `<div class="modal" id="endgame-modal">
            <h1>Game Over</h1>
            <p>Winner: <b>${winner}</b>!<br>
            $AVAX wager transferred.</p>
            <button class="modal-btn" onclick="window.EndGameModal.hide()">Close</button>
        </div>`;
        container.style.display = "block";
        if(window.SoundManager) window.SoundManager.playWin();
        if(window.WagerSystem) window.WagerSystem.resolveWager(winnerIdx);
        if(window.UIManager) window.UIManager.updateUI();
    }
    static hide() {
        document.getElementById('modal-container').style.display = "none";
        document.getElementById('modal-container').innerHTML = "";
    }
}

window.EndGameModal = EndGameModal;