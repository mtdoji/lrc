class Renderer {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stateManager = window.StateManager ? new window.StateManager() : {};
        this.board = window.Board ? new window.Board() : {};
        this.player = window.Player ? new window.Player() : {};
        this.piece = window.Piece ? new window.Piece() : {};
        this.animationManager = window.AnimationManager ? new window.AnimationManager() : {};
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.board.render(this.ctx);
        this.piece.renderAll(this.ctx);
        this.animationManager.render(this.ctx);
        // Dice, highlights, etc are handled in their subsystems
        if (window.Dice) {
            window.Dice.render(this.ctx);
        }
        if (window.WagerSystem) {
            window.WagerSystem.render(this.ctx);
        }
    }
}

window.Renderer = Renderer;