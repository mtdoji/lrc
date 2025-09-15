class Piece {
    constructor(owner, pointIndex, n) {
        this.owner = owner; // 0=red, 1=white
        this.pointIndex = pointIndex;
        this.n = n; // stack position
        this.borneOff = false;
        this.screenPos = this.calcScreenPos();
        this.dragging = false;
    }

    static all = [];

    static setup() {
        // Remove all
        Piece.all.length = 0;
        // Backgammon starting positions
        // 0: red, 1: white
        // 2 on point 0, 5 on point 11, 3 on point 16, 5 on point 18 (for both)
        // We'll use mirrored positions for both players
        const positions = [
            {owner:0, point:0, count:2},
            {owner:0, point:11, count:5},
            {owner:0, point:16, count:3},
            {owner:0, point:18, count:5},
            {owner:1, point:23, count:2},
            {owner:1, point:12, count:5},
            {owner:1, point:7, count:3},
            {owner:1, point:5, count:5}
        ];
        for (let pos of positions) {
            for (let i=0; i<pos.count; ++i) {
                Piece.all.push(new Piece(pos.owner, pos.point, i));
            }
        }
    }

    static reset() {
        Piece.setup();
    }

    static renderAll(ctx) {
        // Group by triangle, then stack
        const board = window.Board ? new window.Board() : {};
        let pointStacks = Array(24).fill(null).map(()=>[]);
        for (let p of Piece.all) {
            if (!p.borneOff) pointStacks[p.pointIndex].push(p);
        }
        for (let i=0; i<24; ++i) {
            let stack = pointStacks[i];
            for (let j=0; j<stack.length; ++j) {
                stack[j].n = j;
                stack[j].render(ctx, j, stack.length, i);
            }
        }
        // Render dragged piece on top
        let dragging = Piece.all.find(p=>p.dragging);
        if (dragging) dragging.render(ctx, dragging.n, 1, dragging.pointIndex, true);

        // Render borne off (collected) pieces
        for (let p of Piece.all) {
            if (p.borneOff) {
                p.renderBorneOff(ctx);
            }
        }
    }

    calcScreenPos() {
        // Convert pointIndex and n to screen coordinates
        const board = window.Board ? new window.Board() : {};
        let t = board.triangleShapes ? board.triangleShapes[this.pointIndex] : {x:0,y:0,isTop:true};
        let stackOffset = this.n*15;
        let x = t.x + board.triangleWidth/2;
        let y = t.isTop ? t.y+25+stackOffset : t.y+board.triangleHeight-25-stackOffset;
        return { x, y };
    }

    render(ctx, n, stackLen, pointIndex, isDragged=false) {
        // Red triangle = $AVAX chip = red triangle marker with $AVAX logo
        // White triangle = neutral
        const pos = isDragged?this.screenPos:this.calcScreenPos();
        ctx.save();
        ctx.globalAlpha = isDragged ? 0.7 : 1;
        ctx.translate(pos.x, pos.y);
        this._drawRedTrianglePiece(ctx, this.owner===0);
        ctx.restore();
    }

    renderBorneOff(ctx) {
        // Draw collected pieces on the side
        let x = this.owner===0 ? 880 : 80;
        let y = 80 + (this.n*26);
        ctx.save();
        ctx.translate(x, y);
        this._drawRedTrianglePiece(ctx, this.owner===0, true);
        ctx.restore();
    }

    _drawRedTrianglePiece(ctx, isRed, isBorne=false) {
        // Draw a triangle chip with AVAX logo and glow
        ctx.save();
        ctx.scale(1.18,1.18);
        ctx.rotate(Math.PI/6);
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(18, 12);
        ctx.lineTo(-18, 12);
        ctx.closePath();
        ctx.shadowColor = isRed ? "#e53935" : "#e1e1e1";
        ctx.shadowBlur = 14;
        ctx.fillStyle = isRed ? "#e53935" : "#f7f7f7";
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffd700";
        ctx.stroke();
        // Draw $AVAX logo
        ctx.save();
        ctx.scale(0.7,0.7);
        ctx.rotate(-Math.PI/6);
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.globalAlpha = 0.77;
        ctx.font = "bold 11px Segoe UI";
        ctx.fillStyle = "#e53935";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("AVAX", 0, 1.5);
        ctx.restore();
        ctx.restore();
    }

    setDragging(b) {
        this.dragging = b;
    }

    setScreenPosition(x, y) {
        this.screenPos.x = x;
        this.screenPos.y = y;
    }

    resetPosition() {
        this.screenPos = this.calcScreenPos();
    }

    isPlayerTurn() {
        const turn = window.TurnManager ? window.TurnManager.getCurrentTurn() : 0;
        return this.owner === turn;
    }

    static getPieceAt(x, y) {
        // Return the topmost piece at (x,y)
        let candidates = Piece.all.filter(p=>{
            let pos = p.calcScreenPos();
            let dx = x-pos.x, dy = y-pos.y;
            return !p.borneOff && Math.sqrt(dx*dx+dy*dy)<24;
        });
        if (candidates.length) {
            let topmost = candidates[candidates.length-1];
            return topmost;
        }
        return null;
    }

    static tryDropPiece(piece, x, y) {
        // Attempt to drop piece at board position
        let board = window.Board ? new window.Board() : {};
        let idx = board.getPointByScreen(x, y);
        if (idx!==null && window.MoveValidator && window.MoveValidator.isValidMove(piece, idx)) {
            piece.pointIndex = idx;
            piece.resetPosition();
            // Sound removed
            return true;
        }
        return false;
    }
}

Piece.setup();
window.Piece = Piece;