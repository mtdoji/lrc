class GameLoop {
    constructor() {
        this.lastTime = 0;
        this.running = false;
        this.renderer = new (window.Renderer || function(){})();
        this.inputHandler = new (window.InputHandler || function(){})();
        this.stateManager = new (window.StateManager || function(){})();
        this.animationManager = new (window.AnimationManager || function(){})();
        this.uiManager = new (window.UIManager || function(){})();
        this.soundManager = new (window.SoundManager || function(){})();
        this._bindUI();
    }

    _bindUI() {
        this.inputHandler.attach();
        this.uiManager.attach();
    }

    start() {
        this.running = true;
        requestAnimationFrame((ts) => this.loop(ts));
    }

    loop(ts) {
        if (!this.running) return;
        const delta = (ts - this.lastTime) * 0.001;
        this.lastTime = ts;
        this.inputHandler.update();
        this.stateManager.update(delta);
        this.animationManager.update(delta);
        this.renderer.render();
        requestAnimationFrame((nts) => this.loop(nts));
    }

    stop() {
        this.running = false;
    }
}

window.GameLoop = GameLoop;