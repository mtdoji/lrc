class Dice {
    constructor() {
        this.faces = ['L', 'R', 'C', '.', '.', '.'];
    }

    roll(numDice) {
        let results = [];
        for (let i = 0; i < numDice; ++i) {
            let idx = Math.floor(Math.random() * 6);
            results.push(this.faces[idx]);
        }
        return results;
    }
}

window.Dice = Dice;