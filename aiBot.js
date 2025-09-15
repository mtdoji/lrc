class AIBot {
    constructor(name, type, chips, seatIndex, x, y) {
        this.name = name;
        this.type = type; // 'ai1' or 'ai2'
        this.chips = chips;
        this.seatIndex = seatIndex;
        this.x = x;
        this.y = y;
    }
}
window.AIBot = AIBot;