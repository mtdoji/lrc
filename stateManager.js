class StateManager {
    constructor(game) {
        this.game = game;
        this.players = [];
        this.turnIndex = 0;
        this.chipManager = new window.ChipManager(this);
        this.dice = new window.Dice();
        this.currentRollResults = [];
        this.phase = 'waiting'; // 'waiting', 'rolling', 'animating', 'between', 'gameover'
        this.message = '';
        this.animTimer = 0;
        this.rollAnimationDuration = 1600; // ms (was 900ms, increased for slower dice animation)
        this.betweenTurnWait = 2600; // ms (was 1600ms, increased for longer message display)
        this.lastWinner = null;

        // New: starting chips logic
        this.startingChips = 3;
        this.shouldPromptStartingChips = true;

        // Store AI names for each game
        this.aiLeftName = '';
        this.aiRightName = '';

        this.initPlayers();
    }

    // Utility: random AI name generator
    static getRandomAIName(side) {
        // Example name lists, can be expanded
        const leftNames = [
            "Wolfie", "Luna", "Blitz", "Echo", "Nova", "Pixel", "Ziggy", "Milo", "Rex", "Dash",
            "Fang", "Shadow", "Scout", "Bolt", "Ranger", "Mojo", "Cosmo", "Finn", "Jax", "Ollie"
        ];
        const rightNames = [
            "Foxy", "Vega", "Juno", "Sparx", "Gizmo", "Rocket", "Ace", "Koda", "Pip", "Zane",
            "Indy", "Flash", "Ryder", "Axel", "Baxter", "Maverick", "Bingo", "Tango", "Zephyr", "Mochi"
        ];
        const names = side === 'left' ? leftNames : rightNames;
        // Pick random name
        return names[Math.floor(Math.random() * names.length)];
    }

    initPlayers() {
        // Generate new random names for AIs each time
        this.aiLeftName = StateManager.getRandomAIName('left');
        this.aiRightName = StateManager.getRandomAIName('right');
        // ROTATED COUNTERCLOCKWISE:
        // Original: [Human bottom, AI left, AI right]
        // Original order: [You (bottom), AI Left (left), AI Right (right)]
        // Counterclockwise rotation: [AI Left (left), AI Right (right), You (bottom)]
        // Positions: AI Left (left), AI Right (right), You (bottom)
        this.players = [
            new window.AIBot(this.aiLeftName, 'ai1', this.startingChips, 0, 130, 160),
            new window.AIBot(this.aiRightName, 'ai2', this.startingChips, 2, 670, 160),
            new window.Player('You', 'human', this.startingChips, 1, 420, 520)
        ];
        this.turnIndex = 0;
        this.chipManager.resetChips(this.players, this.startingChips);
        this.phase = 'waiting';
        this.message = 'Your turn! Roll to start.';
        this.currentRollResults = [];
        this.animTimer = 0;
        this.lastWinner = null;
    }

    setStartingChips(num) {
        this.startingChips = num;
        this.shouldPromptStartingChips = false;
        this.initPlayers();
    }

    restartGame() {
        this.shouldPromptStartingChips = true;
        this.initPlayers();
    }

    getCurrentPlayer() {
        return this.players[this.turnIndex];
    }

    isHumanTurn() {
        return this.getCurrentPlayer().type === 'human';
    }

    isGameOver() {
        let alive = this.players.filter(p => p.chips > 0);
        return alive.length === 1;
    }

    update(dt) {
        if (this.phase === 'gameover') return;

        // AI auto-rolls after a small delay
        if (this.phase === 'waiting' && !this.isHumanTurn()) {
            this.phase = 'rolling';
            setTimeout(() => {
                this.aiTakeTurn();
            }, 900 + Math.random()*500); // was 560+rand*350, now slower for kids
        }

        // Animation for dice roll
        if (this.phase === 'animating') {
            this.animTimer += dt;
            if (this.animTimer > this.rollAnimationDuration) {
                this.phase = 'between';
                this.animTimer = 0;
                setTimeout(() => {
                    this.processRollResults();
                }, 800); // was 360ms, now longer for kids to see dice results
            }
        }
    }

    playerRoll() {
        if (this.phase !== 'waiting' || !this.isHumanTurn()) return;
        let player = this.getCurrentPlayer();
        let diceToRoll = Math.min(3, player.chips);
        if (diceToRoll === 0) {
            // Should not occur, but safety check
            this.nextTurn();
            return;
        }
        this.currentRollResults = this.dice.roll(diceToRoll);
        this.phase = 'animating';
        this.animTimer = 0;
        this.message = `${player.name} rolls...`;
        this.game.uiRenderer.showDiceRollAnimation(this.currentRollResults);
    }

    aiTakeTurn() {
        let player = this.getCurrentPlayer();
        let diceToRoll = Math.min(3, player.chips);
        if (diceToRoll === 0) {
            this.nextTurn();
            return;
        }
        this.currentRollResults = this.dice.roll(diceToRoll);
        this.phase = 'animating';
        this.animTimer = 0;
        this.message = `${player.name} rolls...`;
        this.game.uiRenderer.showDiceRollAnimation(this.currentRollResults);
    }

    processRollResults() {
        let player = this.getCurrentPlayer();
        let actions = this.currentRollResults;
        // Update leftIdx and rightIdx for new player order
        // leftIdx: (turnIndex + 2) % 3
        // rightIdx: (turnIndex + 1) % 3

        // --- REVERSE LEFT/RIGHT LOGIC ---
        // Swap left and right indices
        let leftIdx = (this.turnIndex + 1) % 3;
        let rightIdx = (this.turnIndex + 2) % 3;

        // For each die, process result
        let actionStrings = [];
        for (let i = 0; i < actions.length; ++i) {
            let res = actions[i];
            if (res === 'L') {
                if (player.chips > 0) {
                    player.chips--;
                    this.players[leftIdx].chips++;
                    this.chipManager.moveChip(player, this.players[leftIdx]);
                    actionStrings.push('Left');
                }
            } else if (res === 'R') {
                if (player.chips > 0) {
                    player.chips--;
                    this.players[rightIdx].chips++;
                    this.chipManager.moveChip(player, this.players[rightIdx]);
                    actionStrings.push('Right');
                }
            } else if (res === 'C') {
                if (player.chips > 0) {
                    player.chips--;
                    this.chipManager.moveChipToCenter(player);
                    actionStrings.push('Center');
                }
            } else {
                actionStrings.push('Dot');
            }
        }

        // Update message
        let msg = `${player.name} rolled: ${actions.join(' ')} (${actionStrings.join(', ')})`;
        this.message = msg;

        // Check win condition
        if (this.isGameOver()) {
            this.phase = 'gameover';
            this.lastWinner = this.players.find(p => p.chips > 0);
            setTimeout(() => {
                this.message = `${this.lastWinner.name} wins!`;
                this.game.uiRenderer.showRestartButton();
            }, 1800); // was 1200ms, now longer for kids to see winner
            return;
        }

        // Wait, then next turn
        setTimeout(() => {
            this.nextTurn();
        }, this.betweenTurnWait);
    }

    nextTurn() {
        this.turnIndex = (this.turnIndex + 1) % 3;
        if (this.getCurrentPlayer().chips === 0) {
            // Skip players with no chips (but keep message)
            setTimeout(() => {
                this.nextTurn();
            }, 700); // was 380ms, now longer for kids to see skip
            return;
        }
        this.currentRollResults = [];
        if (this.isHumanTurn()) {
            this.phase = 'waiting';
            this.message = 'Your turn! Roll to start.';
        } else {
            this.phase = 'waiting';
            this.message = `${this.getCurrentPlayer().name}'s turn.`;
        }
    }
}

window.StateManager = StateManager;