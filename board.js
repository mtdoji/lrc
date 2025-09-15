class Board {
    constructor() {
        this.width = 800;
        this.height = 480;
        this.origin = { x: 80, y: 60 };
        this.triangleWidth = 44;
        this.triangleHeight = 188;
        this.points = this._createPoints();
        this.bar = { x: 480-22, y: 60, width: 44, height: 360 };

        this._precomputeTriangleShapes();
    }

    _createPoints() {
        // 24 points (triangles)
        let pts = [];
        for (let i=0; i<24; ++i) {
            let side = i<12 ? 0 : 1;
            let idx = i%12;
            pts.push({
                index: i,
                x: this.origin.x + (side===0?idx:11-idx)*this.triangleWidth,
                y: side===0 ? this.origin.y : this.origin.y+this.height-this.triangleHeight,
                isTop: side===0,
                pieces: []
            });
        }
        return pts;
    }

    _precomputeTriangleShapes() {
        // Used for drawing triangles - red and white alternating
        this.triangleShapes = [];
        for (let i=0; i<24; ++i) {
            let isTop = i<12;
            let idx = i%12;
            let color = (idx%2===0) ? "red" : "white";
            let x = this.origin.x + (isTop?idx:11-idx)*this.triangleWidth;
            let y = isTop ? this.origin.y : this.origin.y+this.height-this.triangleHeight;
            this.triangleShapes.push({
                x, y, isTop, color
            });
        }
    }

    render(ctx) {
        // Draw board background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(this.origin.x-16, this.origin.y-16, this.width+32, this.height+32, 18);
        ctx.closePath();
        ctx.fillStyle = "#1e2026";
        ctx.shadowColor = "#111";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw "bar" in center
        ctx.beginPath();
        ctx.rect(this.bar.x, this.bar.y, this.bar.width, this.bar.height);
        ctx.fillStyle = "#23263a";
        ctx.fill();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw triangles
        for (let i=0; i<24; ++i) {
            let t = this.triangleShapes[i];
            this._drawTriangle(ctx, t.x, t.y, t.isTop, t.color, i);
        }

        // Draw outline
        ctx.beginPath();
        ctx.roundRect(this.origin.x-10, this.origin.y-10, this.width+20, this.height+20, 14);
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.restore();
    }

    _drawTriangle(ctx, x, y, isTop, color, idx) {
        // Draws red or white triangle, red for chips, white for neutral
        ctx.save();
        ctx.beginPath();
        if (isTop) {
            ctx.moveTo(x, y);
            ctx.lineTo(x+this.triangleWidth, y);
            ctx.lineTo(x+this.triangleWidth/2, y+this.triangleHeight);
        } else {
            ctx.moveTo(x, y+this.triangleHeight);
            ctx.lineTo(x+this.triangleWidth, y+this.triangleHeight);
            ctx.lineTo(x+this.triangleWidth/2, y);
        }
        ctx.closePath();
        if (color==="red") {
            // $AVAX: red triangle
            ctx.fillStyle = "#e53935";
            ctx.shadowColor = "#b71c1c";
            ctx.shadowBlur = 14;
        } else {
            ctx.fillStyle = "#f7f7f7";
            ctx.shadowColor = "#e1e1e1";
            ctx.shadowBlur = 12;
        }
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffd700";
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    getPointByScreen(x, y) {
        // Returns the nearest triangle index for a given board screen position
        for (let i=0; i<24; ++i) {
            let t = this.triangleShapes[i];
            let tx = t.x, ty = t.y;
            let w = this.triangleWidth, h = this.triangleHeight;
            if (t.isTop) {
                if (x>=tx && x<=tx+w && y>=ty && y<=ty+h) return i;
            } else {
                if (x>=tx && x<=tx+w && y>=ty && y<=ty+h) return i;
            }
        }
        return null;
    }

    checkVictory() {
        // Returns 0 or 1 if player has borne off all pieces
        if (window.Piece) {
            const player0 = window.Piece.all.filter(p=>p.owner===0 && p.borneOff);
            const player1 = window.Piece.all.filter(p=>p.owner===1 && p.borneOff);
            if (player0.length===15) return 0;
            if (player1.length===15) return 1;
        }
        return null;
    }

    reset() {
        // Reset board and pieces
        if (window.Piece) window.Piece.reset();
    }
}

window.Board = Board;