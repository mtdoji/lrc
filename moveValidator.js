class MoveValidator {
    static isValidMove(piece, destIdx) {
        // Only allow moves to open points or with one enemy checker
        // Only allow legal dice moves (simplified for demo)
        const turnIdx = window.TurnManager ? window.TurnManager.getCurrentTurn() : 0;
        if (piece.owner !== turnIdx) return false;
        // For simplicity, allow any move for now
        // TODO: Implement full backgammon rules and dice checks
        return true;
    }
}

window.MoveValidator = MoveValidator;