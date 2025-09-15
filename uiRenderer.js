class UIRenderer {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.overlay = document.getElementById('ui-overlay');
        this.diceAnim = null;
        this.diceAnimTimer = 0;
        this.diceAnimDuration = 800;
        this.diceAnimResults = [];
        this.instructionsModal = null; // Track modal so we can close it
        this.startingChipsModal = null; // Track starting chips modal
        this.renderStaticUI();

        // --- CHIP IMAGE LOADING ---
        this.chipImage = new window.Image();
        this.chipImageLoaded = false;
        this.chipImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/93109b07-1312-49d8-9dca-94c977c78702/library/avax_1756436013984.png";
        this.chipImage.onload = () => {
            this.chipImageLoaded = true;
        };

        // --- PROFILE PHOTO PLACEHOLDER IMAGE ---
        this.profilePhotoImage = new window.Image();
        this.profilePhotoImageLoaded = false;
        // Set player profile photo to the requested URL
        this.profilePhotoImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/93109b07-1312-49d8-9dca-94c977c78702/library/sj_1757905894162.png";
        this.profilePhotoImage.onload = () => {
            this.profilePhotoImageLoaded = true;
        };

        // --- AI LEFT PROFILE PHOTO IMAGE ---
        this.aiLeftProfilePhotoImage = new window.Image();
        this.aiLeftProfilePhotoImageLoaded = false;
        this.aiLeftProfilePhotoImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/93109b07-1312-49d8-9dca-94c977c78702/library/wolfi_1757906079427.png";
        this.aiLeftProfilePhotoImage.onload = () => {
            this.aiLeftProfilePhotoImageLoaded = true;
        };

        // --- AI RIGHT PROFILE PHOTO IMAGE ---
        this.aiRightProfilePhotoImage = new window.Image();
        this.aiRightProfilePhotoImageLoaded = false;
        this.aiRightProfilePhotoImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/93109b07-1312-49d8-9dca-94c977c78702/library/ff_1757905974921.png";
        this.aiRightProfilePhotoImage.onload = () => {
            this.aiRightProfilePhotoImageLoaded = true;
        };
    }

    renderStaticUI() {
        this.clearOverlay();

        // If game is at initial state (first load or after restart), show starting chips modal
        if (this.game.stateManager.shouldPromptStartingChips) {
            this.showStartingChipsModal();
            // --- ADD TITLE ON TOP OF SCREEN (even before starting chips) ---
            this._addLCRTitle();
            return;
        }

        // --- Message at the top of the screen ---
        let msg = document.createElement('div');
        msg.id = 'game-message';
        msg.style.position = 'fixed';
        msg.style.top = '0';
        msg.style.left = '50%';
        msg.style.transform = 'translateX(-50%)';
        msg.style.width = '900px';
        msg.style.maxWidth = '95vw';
        msg.style.textAlign = 'center';
        msg.style.marginTop = '32px';
        msg.style.marginBottom = '0';
        msg.style.pointerEvents = 'none';
        msg.style.zIndex = '20';
        this.overlay.appendChild(msg);

        // --- Button at the bottom of the screen ---
        let btnContainer = document.createElement('div');
        btnContainer.id = 'lcr-bottom-btn-container';
        btnContainer.style.position = 'fixed';
        btnContainer.style.left = '50%';
        btnContainer.style.bottom = '48px';
        btnContainer.style.transform = 'translateX(-50%)';
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'column';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.pointerEvents = 'none'; // let children enable pointer events
        btnContainer.style.zIndex = '20';

        let btn = document.createElement('button');
        btn.className = 'lcr-btn';
        btn.id = 'roll-btn';
        btn.textContent = 'Roll Dice';
        btn.style.position = 'static';
        btn.style.pointerEvents = 'all';
        btn.addEventListener('click', () => {
            if (this.game.stateManager.isHumanTurn() && this.game.stateManager.phase === 'waiting') {
                this.game.stateManager.playerRoll();
            }
        });
        btnContainer.appendChild(btn);

        this.overlay.appendChild(btnContainer);

        // Info icon (bottom right, fixed to browser window)
        let infoBtn = document.createElement('div');
        infoBtn.id = 'lcr-info-icon';
        infoBtn.title = 'Game Instructions';
        infoBtn.style.position = 'fixed';
        infoBtn.style.right = '32px';
        infoBtn.style.bottom = '32px';
        infoBtn.style.width = '44px';
        infoBtn.style.height = '44px';
        infoBtn.style.borderRadius = '50%';
        infoBtn.style.background = 'rgba(255,255,255,0.93)';
        infoBtn.style.boxShadow = '0 2px 12px #0003';
        infoBtn.style.display = 'flex';
        infoBtn.style.alignItems = 'center';
        infoBtn.style.justifyContent = 'center';
        infoBtn.style.cursor = 'pointer';
        infoBtn.style.zIndex = '100';
        infoBtn.style.pointerEvents = 'all';
        infoBtn.style.transition = 'background 0.18s, box-shadow 0.18s, transform 0.1s';
        infoBtn.onmouseenter = () => {
            infoBtn.style.background = 'rgba(255,255,220,1)';
            infoBtn.style.transform = 'scale(1.07)';
        };
        infoBtn.onmouseleave = () => {
            infoBtn.style.background = 'rgba(255,255,255,0.93)';
            infoBtn.style.transform = 'scale(1)';
        };
        // SVG info icon
        infoBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#396bad" stroke-width="2" fill="#fff"/>
                <text x="14" y="20" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="bold" fill="#396bad">i</text>
            </svg>
        `;
        infoBtn.addEventListener('click', () => {
            this.showInstructionsModal();
        });
        this.overlay.appendChild(infoBtn);

        // --- ADD TITLE ON TOP OF SCREEN (before game starts) ---
        if (this.game.stateManager && this.game.stateManager.turnIndex === 0 && this.game.stateManager.phase === 'waiting' && this.game.stateManager.players && this.game.stateManager.players.every(p => p.chips === this.game.stateManager.startingChips)) {
            this._addLCRTitle();
        }
    }

    // Add the big red title at the top center of the screen
    _addLCRTitle() {
        // Remove if already present
        let oldTitle = document.getElementById('lcr-huge-title');
        if (oldTitle && oldTitle.parentNode) oldTitle.parentNode.removeChild(oldTitle);

        let title = document.createElement('div');
        title.id = 'lcr-huge-title';
        title.textContent = 'LEFT. RIGHT. CENTER.';
        title.style.position = 'fixed';
        // Lowered from 36px to 64px
        title.style.top = '64px';
        title.style.left = '50%';
        title.style.transform = 'translateX(-50%)';
        title.style.width = '100vw';
        title.style.textAlign = 'center';
        title.style.fontFamily = "'Segoe UI', 'Arial', sans-serif";
        title.style.fontWeight = 'bold';
        title.style.fontSize = 'clamp(3.2rem, 8vw, 6.5rem)';
        title.style.letterSpacing = '0.04em';
        title.style.color = '#e53935';
        title.style.textShadow = '0 2px 18px #0004, 0 1px 0 #fff8';
        title.style.zIndex = '1000';
        title.style.pointerEvents = 'none';
        title.style.userSelect = 'none';
        title.style.lineHeight = '1.06';
        title.style.textTransform = 'uppercase';
        // Responsive: hide on small screens if needed
        title.style.maxWidth = '96vw';
        // Only show if not already present
        this.overlay.appendChild(title);
    }

    clearOverlay() {
        while (this.overlay.firstChild) {
            this.overlay.removeChild(this.overlay.firstChild);
        }
        // Remove modal if present
        if (this.instructionsModal && this.instructionsModal.parentNode) {
            this.instructionsModal.parentNode.removeChild(this.instructionsModal);
            this.instructionsModal = null;
        }
        if (this.startingChipsModal && this.startingChipsModal.parentNode) {
            this.startingChipsModal.parentNode.removeChild(this.startingChipsModal);
            this.startingChipsModal = null;
        }
        // Remove huge title if present
        let oldTitle = document.getElementById('lcr-huge-title');
        if (oldTitle && oldTitle.parentNode) oldTitle.parentNode.removeChild(oldTitle);
    }

    renderGameMessage() {
        let msg = document.getElementById('game-message');
        if (!msg) return;
        // Replace "Chips" with "$AVAX" in the message for consistency
        let displayMsg = this.game.stateManager.message.replace(/Chips/gi, '$AVAX');
        msg.innerHTML = displayMsg;
    }

    showRestartButton() {
        // Place restart button at the bottom as well
        let btnContainer = document.getElementById('lcr-bottom-btn-container');
        if (!btnContainer) {
            // Fallback: create it if not present (should not happen)
            btnContainer = document.createElement('div');
            btnContainer.id = 'lcr-bottom-btn-container';
            btnContainer.style.position = 'fixed';
            btnContainer.style.left = '50%';
            btnContainer.style.bottom = '48px';
            btnContainer.style.transform = 'translateX(-50%)';
            btnContainer.style.display = 'flex';
            btnContainer.style.flexDirection = 'column';
            btnContainer.style.alignItems = 'center';
            btnContainer.style.justifyContent = 'center';
            btnContainer.style.pointerEvents = 'none';
            btnContainer.style.zIndex = '20';
            this.overlay.appendChild(btnContainer);
        }

        let btn = document.createElement('button');
        btn.className = 'lcr-btn';
        btn.textContent = 'Restart Game';
        btn.style.position = 'static';
        btn.style.marginTop = '18px';
        btn.style.pointerEvents = 'all';
        btn.addEventListener('click', () => {
            this.game.restartGame();
        });
        btnContainer.appendChild(btn);
    }

    showDiceRollAnimation(results) {
        // Start animating dice
        this.diceAnim = true;
        this.diceAnimTimer = 0;
        this.diceAnimResults = results;
    }

    showInstructionsModal() {
        // Prevent multiple modals
        if (this.instructionsModal) return;

        // Modal background
        let modalBg = document.createElement('div');
        modalBg.style.position = 'fixed';
        modalBg.style.left = '0';
        modalBg.style.top = '0';
        modalBg.style.width = '100vw';
        modalBg.style.height = '100vh';
        modalBg.style.background = 'rgba(30,40,60,0.38)';
        modalBg.style.zIndex = '9999';
        modalBg.style.display = 'flex';
        modalBg.style.alignItems = 'center';
        modalBg.style.justifyContent = 'center';
        modalBg.style.pointerEvents = 'all';

        // Modal box
        let modal = document.createElement('div');
        modal.style.background = 'linear-gradient(135deg, #fffbe9 80%, #f7e6b8 100%)';
        modal.style.borderRadius = '18px';
        modal.style.boxShadow = '0 8px 32px #0003, 0 2px 6px 2px #0002';
        modal.style.padding = '2.2em 2.3em 1.7em 2.3em';
        modal.style.maxWidth = '90vw';
        modal.style.width = '420px';
        modal.style.color = '#2b2b2b';
        modal.style.fontSize = '1.1em';
        modal.style.position = 'relative';

        // Close button
        let closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '0.7em';
        closeBtn.style.right = '1.1em';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '2em';
        closeBtn.style.color = '#396bad';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.lineHeight = '1em';
        closeBtn.style.pointerEvents = 'all';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.addEventListener('click', () => {
            if (modalBg.parentNode) modalBg.parentNode.removeChild(modalBg);
            this.instructionsModal = null;
        });

        // Instructions content
        modal.innerHTML = `
            <h2 style="margin-top:0;margin-bottom:0.7em;font-size:1.35em;color:#396bad;text-align:center;">How to Play Left. Right. Center.</h2>
            <ol style="margin:0 0 0.8em 1.1em;padding:0;">
                <li>Each player starts with <b style="color:#e53935;">${this.game.stateManager.startingChips}</b> <b style="color:#e53935;">$AVAX</b> chips (shown as red triangles).</li>
                <li>On your turn, roll as many dice as you have $AVAX chips (up to 3).</li>
                <li>For each die:
                    <ul style="margin:0.2em 0 0.2em 1.2em;padding:0;font-size:0.98em;">
                        <li><b>L</b>: Pass a $AVAX chip to the player on your left.</li>
                        <li><b>R</b>: Pass a $AVAX chip to the player on your right.</li>
                        <li><b>C</b>: Place a $AVAX chip in the center (out of play).</li>
                        <li><b>Dot</b>: Keep your $AVAX chip.</li>
                    </ul>
                </li>
                <li>If you have no $AVAX chips, skip your turn (but you might get chips back!).</li>
                <li>The last player with $AVAX chips wins!</li>
            </ol>
            <div style="font-size:0.97em;color:#444;text-align:center;margin-top:0.7em;">
                Click the <b>Roll Dice</b> button or press <b>Space</b>/<b>Enter</b> to roll on your turn.
            </div>
        `;
        modal.appendChild(closeBtn);

        // Allow closing modal by clicking background
        modalBg.addEventListener('click', (e) => {
            if (e.target === modalBg) {
                if (modalBg.parentNode) modalBg.parentNode.removeChild(modalBg);
                this.instructionsModal = null;
            }
        });

        modalBg.appendChild(modal);
        document.body.appendChild(modalBg);
        this.instructionsModal = modalBg;
    }

    showStartingChipsModal() {
        // Prevent multiple modals
        if (this.startingChipsModal) return;

        let modalBg = document.createElement('div');
        modalBg.style.position = 'fixed';
        modalBg.style.left = '0';
        modalBg.style.top = '0';
        modalBg.style.width = '100vw';
        modalBg.style.height = '100vh';
        modalBg.style.background = 'rgba(30,40,60,0.38)';
        modalBg.style.zIndex = '9999';
        modalBg.style.display = 'flex';
        modalBg.style.alignItems = 'center';
        modalBg.style.justifyContent = 'center';
        modalBg.style.pointerEvents = 'all';

        let modal = document.createElement('div');
        modal.style.background = 'linear-gradient(135deg, #fffbe9 80%, #f7e6b8 100%)';
        modal.style.borderRadius = '18px';
        modal.style.boxShadow = '0 8px 32px #0003, 0 2px 6px 2px #0002';
        modal.style.padding = '2.2em 2.3em 1.7em 2.3em';
        modal.style.maxWidth = '90vw';
        modal.style.width = '420px';
        modal.style.color = '#2b2b2b';
        modal.style.fontSize = '1.1em';
        modal.style.position = 'relative';
        modal.style.textAlign = 'center';

        let title = document.createElement('h2');
        title.style.marginTop = '0';
        title.style.marginBottom = '0.7em';
        title.style.fontSize = '1.35em';
        title.style.color = '#396bad';
        title.textContent = 'Set Starting $AVAX Chips';
        modal.appendChild(title);

        let label = document.createElement('label');
        label.textContent = 'How many $AVAX chips should each player start with?';
        label.style.display = 'block';
        label.style.marginBottom = '1em';
        label.style.fontWeight = 'bold';
        modal.appendChild(label);

        let input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = '20';
        input.value = this.game.stateManager.startingChips || 3;
        input.style.fontSize = '1.2em';
        input.style.width = '4em';
        input.style.textAlign = 'center';
        input.style.marginBottom = '1em';
        input.style.padding = '0.3em';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #bbb';
        modal.appendChild(input);

        let errorMsg = document.createElement('div');
        errorMsg.style.color = '#e53935';
        errorMsg.style.fontSize = '1em';
        errorMsg.style.marginTop = '0.5em';
        errorMsg.style.height = '1.2em';
        errorMsg.textContent = '';
        modal.appendChild(errorMsg);

        let btn = document.createElement('button');
        btn.className = 'lcr-btn';
        btn.textContent = 'Start Game';
        btn.style.marginTop = '1.3em';
        btn.style.fontSize = '1.15em';
        btn.style.padding = '0.6em 2.1em';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
            let val = parseInt(input.value, 10);
            if (isNaN(val) || val < 1 || val > 20) {
                errorMsg.textContent = 'Please enter a value between 1 and 20.';
                return;
            }
            this.game.stateManager.setStartingChips(val);
            this.clearOverlay();
            this.renderStaticUI();
        });
        modal.appendChild(btn);

        // Allow pressing Enter to submit
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btn.click();
        });

        modalBg.appendChild(modal);
        document.body.appendChild(modalBg);
        this.startingChipsModal = modalBg;
    }

    // --- CENTERING CHANGES BELOW ---

    // Helper to get canvas center
    getCanvasCenter() {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }

    renderTableBackground() {
        // Table ellipse
        let ctx = this.ctx;
        ctx.save();
        // Center table in canvas dynamically
        const { x: cx, y: cy } = this.getCanvasCenter();
        // Green felt gradient
        let gradient = ctx.createRadialGradient(0, 0, 120, 0, 0, 340);
        gradient.addColorStop(0, "#d8ffe0");
        gradient.addColorStop(0.12, "#90e090");
        gradient.addColorStop(0.4, "#3cb371");
        gradient.addColorStop(1, "#206030");
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.ellipse(0, 0, 440, 270, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowColor = "#3cb371";
        ctx.shadowBlur = 32;
        ctx.globalAlpha = 0.92;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.restore();

        // Center circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.24)";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }

    renderPlayerPanels() {
        let players = this.game.stateManager.players;
        let ctx = this.ctx;
        // Panel size
        let panelW = 210, panelH = 90;
        // Centered positions based on canvas size
        const { x: cx, y: cy } = this.getCanvasCenter();
        // Table ellipse: 440x270, so offset accordingly
        let positions = [
            {x: cx - 430, y: cy - 240, color: 'var(--color-ai1)'},    // AI Left (left)
            {x: cx + 220, y: cy - 240, color: 'var(--color-ai2)'},    // AI Right (right)
            {x: cx - panelW/2, y: cy + 240, color: 'var(--color-player)'}  // You (bottom)
        ];
        // Profile photo box parameters
        const photoBoxSize = 72;
        const photoBoxRadius = 18;
        const photoBoxMargin = 18;

        for (let i = 0; i < players.length; ++i) {
            let p = players[i];
            let pos = positions[i];

            // --- Draw profile photo box ---
            ctx.save();
            // Position: to the left of the panel, vertically centered
            let photoX = pos.x - photoBoxSize - photoBoxMargin;
            let photoY = pos.y + (panelH - photoBoxSize) / 2;
            ctx.globalAlpha = 0.99;
            ctx.beginPath();
            ctx.roundRect(photoX, photoY, photoBoxSize, photoBoxSize, photoBoxRadius);
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#0008";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.lineWidth = 2.6;
            ctx.strokeStyle = "#e0e0e0";
            ctx.stroke();

            // Draw profile photo image (if loaded), otherwise fallback to colored circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(photoX + photoBoxSize/2, photoY + photoBoxSize/2, photoBoxSize/2 - 6, 0, Math.PI*2);
            ctx.closePath();
            ctx.clip();
            if (i === 2 && this.profilePhotoImageLoaded) {
                // Human player: show human profile photo
                ctx.drawImage(this.profilePhotoImage, photoX + 6, photoY + 6, photoBoxSize - 12, photoBoxSize - 12);
            } else if (i === 0 && this.aiLeftProfilePhotoImageLoaded) {
                // AI Left: show AI Left profile photo
                ctx.drawImage(this.aiLeftProfilePhotoImage, photoX + 6, photoY + 6, photoBoxSize - 12, photoBoxSize - 12);
            } else if (i === 1 && this.aiRightProfilePhotoImageLoaded) {
                // AI Right: show AI Right profile photo
                ctx.drawImage(this.aiRightProfilePhotoImage, photoX + 6, photoY + 6, photoBoxSize - 12, photoBoxSize - 12);
            } else {
                // fallback: colored circle if image not loaded yet
                ctx.fillStyle = pos.color;
                ctx.fill();
            }
            ctx.restore();

            // Optional: Draw player initial if image not loaded (for all)
            if (
                (i === 2 && !this.profilePhotoImageLoaded) ||
                (i === 0 && !this.aiLeftProfilePhotoImageLoaded) ||
                (i === 1 && !this.aiRightProfilePhotoImageLoaded)
            ) {
                ctx.save();
                ctx.font = "bold 32px Segoe UI";
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let initial = (p.name && p.name.length > 0) ? p.name[0].toUpperCase() : "?";
                ctx.fillText(initial, photoX + photoBoxSize/2, photoY + photoBoxSize/2 + 2);
                ctx.restore();
            }
            ctx.restore();

            // --- Draw player panel ---
            ctx.save();
            ctx.globalAlpha = 0.84;
            ctx.beginPath();
            ctx.roundRect(pos.x, pos.y, panelW, panelH, 26);

            // Use a dark, transparent background instead of black or solid color
            ctx.fillStyle = "rgba(24, 32, 48, 0.72)";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            // Optional: subtle border with player color
            ctx.strokeStyle = pos.color;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Text
            ctx.font = "bold 23px Segoe UI";
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 2.5;
            ctx.fillText(p.name, pos.x + 22, pos.y + 38);
            ctx.font = "19px Segoe UI";
            ctx.fillStyle = "#f0e7d2";
            // Replace "Chips" with "$AVAX"
            ctx.fillText(`$AVAX: ${p.chips}`, pos.x + 22, pos.y + 70);
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }

    renderTurnHighlight() {
        let players = this.game.stateManager.players;
        let turnIndex = this.game.stateManager.turnIndex;
        let ctx = this.ctx;
        // Centered positions based on canvas size
        const { x: cx, y: cy } = this.getCanvasCenter();
        let panelW = 210, panelH = 90;
        let positions = [
            {x: cx - 430, y: cy - 240},
            {x: cx + 220, y: cy - 240},
            {x: cx - panelW/2, y: cy + 240}
        ];
        let pos = positions[turnIndex];
        ctx.save();
        ctx.globalAlpha = 0.36 + 0.22 * Math.abs(Math.sin(Date.now()/410));
        ctx.beginPath();
        ctx.roundRect(pos.x - 16, pos.y - 16, 242, 122, 32);
        ctx.strokeStyle = "#fff9";
        ctx.lineWidth = 8;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    renderAllChips() {
        // Chips at players
        let players = this.game.stateManager.players;
        // Centered positions based on canvas size
        const { x: cx, y: cy } = this.getCanvasCenter();
        let positions = [
            {x: cx - 340, y: cy - 140},
            {x: cx + 340, y: cy - 140},
            {x: cx, y: cy + 320}
        ];
        for (let i = 0; i < players.length; ++i) {
            let p = players[i];
            this.renderChipsStack(positions[i].x, positions[i].y, p.chips, i);
        }
        // Chips in the center
        let centerChips = this.game.stateManager.chipManager.centerChips;
        this.renderChipsStack(cx, cy, centerChips, 'center');
    }

    renderChipsStack(x, y, num, owner) {
        let ctx = this.ctx;
        // Offset for stacking effect
        for (let i = 0; i < num; ++i) {
            let offx = 0, offy = 0;
            // owner: 0 = AI Left (left), 1 = AI Right (right), 2 = You (bottom)
            if (owner === 0) { offx = -12 + (i % 3) * 6; offy = 12 + Math.floor(i / 3) * 7; }
            else if (owner === 1) { offx = 12 - (i % 3) * 6; offy = 12 + Math.floor(i / 3) * 7; }
            else if (owner === 2) { offx = (i % 3) * 4 - 4; offy = -12 - Math.floor(i / 3) * 7; }
            else { // center
                offx = (i % 4) * 4 - 6;
                offy = (i % 3) * 4 - 6;
            }
            this.drawAVAXChip(x + offx, y + offy);
        }
    }

    // Draw a chip using the provided image, with white outline and glow
    drawAVAXChip(x, y) {
        let ctx = this.ctx;
        ctx.save();
        let size = 40;
        // Draw glow (white, soft)
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(x, y, size/2 + 4, 0, Math.PI*2);
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();

        // Draw white outline
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size/2 + 2, 0, Math.PI*2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.restore();

        // Draw chip image or fallback
        ctx.save();
        if (this.chipImageLoaded) {
            ctx.drawImage(this.chipImage, x - size/2, y - size/2, size, size);
        } else {
            // fallback: draw a gray circle if image not loaded yet
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, Math.PI*2);
            ctx.fillStyle = "#ccc";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#999";
            ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
    }

    renderDice() {
        let state = this.game.stateManager;
        let diceResults = (state.phase === 'animating' && this.diceAnim)
            ? this.randomDiceFaces(state.currentRollResults.length)
            : state.currentRollResults;

        if (state.phase === 'animating' && this.diceAnim) {
            this.diceAnimTimer += 17;
            if (this.diceAnimTimer > this.diceAnimDuration) {
                this.diceAnim = false;
                this.diceAnimTimer = 0;
            }
        }

        if (diceResults && diceResults.length > 0) {
            const { x: cx, y: cy } = this.getCanvasCenter();
            let x0 = cx - ((diceResults.length - 1) * 38);
            for (let i = 0; i < diceResults.length; ++i) {
                this.drawDice(x0 + i * 76, cy + 60, diceResults[i]);
            }
        }
    }

    randomDiceFaces(count) {
        let faces = ['L', 'R', 'C', '.', '.', '.'];
        let arr = [];
        for (let i = 0; i < count; ++i) {
            let idx = Math.floor(Math.random() * 6);
            arr.push(faces[idx]);
        }
        return arr;
    }

    drawDice(x, y, face) {
        let ctx = this.ctx;
        ctx.save();

        // Dice shadow
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.roundRect(x-31, y+19, 62, 20, 10);
        ctx.fillStyle = "#0007";
        ctx.fill();
        ctx.globalAlpha = 1;

        // Dice cube
        let grad = ctx.createLinearGradient(x-32, y-32, x+32, y+32);
        grad.addColorStop(0, "#fffefc");
        grad.addColorStop(1, "#e1e7ef");
        ctx.beginPath();
        ctx.roundRect(x-32, y-32, 64, 64, 14);
        ctx.fillStyle = grad;
        ctx.shadowColor = "#0008";
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#b8bfc7";
        ctx.stroke();

        // Show face
        if (face === 'L' || face === 'R' || face === 'C') {
            ctx.font = "bold 42px Segoe UI";
            ctx.fillStyle = {
                'L': 'hsl(200, 70%, 56%)',
                'R': 'hsl(0, 70%, 56%)',
                'C': 'hsl(46, 96%, 60%)'
            }[face];
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "#0003";
            ctx.shadowBlur = 1.5;
            ctx.fillText(face, x, y+2);
            ctx.shadowBlur = 0;
        } else {
            // Dot: draw 1-3 dots, random positions for animation
            ctx.fillStyle = "hsl(210, 40%, 36%)";
            ctx.beginPath();
            ctx.arc(x, y, 7, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.restore();
    }
}

window.UIRenderer = UIRenderer;