class RulesModal {
    static show() {
        const container = document.getElementById('modal-container');
        container.innerHTML = `<div class="modal" id="rules-modal">
            <h1>$AVAX Backgammon Rules</h1>
            <ul>
                <li>Players take turns rolling dice and moving $AVAX red triangle chips according to the dice.</li>
                <li>Click "Roll" to roll dice on your turn.</li>
                <li>Drag your $AVAX chip to a valid triangle matching your dice move.</li>
                <li>First to bear off all $AVAX chips wins the wager!</li>
                <li>Captured $AVAX chips go to the bar and must re-enter.</li>
                <li>Use the buttons to roll, end turn, and restart.</li>
            </ul>
            <button class="modal-btn" onclick="window.RulesModal.hide()">Close</button>
        </div>`;
        container.style.display = "block";
    }
    static hide() {
        document.getElementById('modal-container').style.display = "none";
        document.getElementById('modal-container').innerHTML = "";
    }
}

window.RulesModal = RulesModal;