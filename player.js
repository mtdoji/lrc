class Player {
    constructor(name, type, chips, seatIndex, x, y) {
        this.name = name;
        this.type = type; // 'human'
        this.chips = chips;
        this.seatIndex = seatIndex; // 0=AI Left, 1=You, 2=AI Right
        this.x = x; // For display
        this.y = y;
    }
}
window.Player = Player;