class CaptureLogic {
    static tryCapture(piece, destIdx) {
        // If destination has exactly one enemy checker, capture it
        const enemyIdx = piece.owner===0 ? 1 : 0;
        let enemyPieces = window.Piece.all.filter(
            p=>p.pointIndex===destIdx && p.owner===enemyIdx && !p.borneOff
        );
        if (enemyPieces.length===1) {
            // Move enemy checker to the bar
            enemyPieces[0].pointIndex = -1;
            if(window.SoundManager) window.SoundManager.playCapture();
        }
    }
}

window.CaptureLogic = CaptureLogic;