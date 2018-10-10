// TODO: put entire thing into anonymous function: (function() {})();

var canvas, ctx, game;

// ENTITY ------------------------------

class Entity {
    constructor(x, y, sx, sy) {
        this.pos = new Vector(x, y);
        this.size = new Vector(sx, sy);
    }
    isTouching(e) {
        return (this.x + this.sx > e.x && e.x + e.sx > this.x && this.y + this.sy > e.y && e.y + e.sy > this.y );
    }
}

// PLAYER ------------------------------

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20);
    }

    update() {
        let xVelAdd = (keysdown.indexOf("ArrowRight") != -1) - (keysdown.indexOf("ArrowLeft") != -1);
        let yVelAdd = (keysdown.indexOf("ArrowDown") != -1) - (keysdown.indexOf("ArrowUp") != -1);
        let mag = Math.sqrt(xVelAdd**2 + yVelAdd**2);
        let newXVelAdd = (xVelAdd/mag) || 0;
        let newYVelAdd = (yVelAdd/mag) || 0;

        this.vx += newXVelAdd*5;
        this.vy += newYVelAdd*5;

        this.vy *= 0.6;
        this.vx *= 0.6;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.draw
    }
}

// GAME ------------------------------

function restart() {

    game = {}

    game.ply = new Player(canvas.width/2, canvas.height/2);
    
    game.attacks = [];
    game.enemies = [];
    game.projectiles = [];
    game.state = "ACTIVE";
}

function plyUpdate() {

    

}

function update() {

    if (game.state == "ACTIVE") {
        plyUpdate();
    
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (game.state == "OVER") {
        
    }
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(game.ply.x, game.ply.y, 40, 40);
    
    window.requestAnimationFrame(update);
}

window.onload = function() {

    canvas = document.getElementById("cnvs");
    ctx = canvas.getContext("2d");

    restart();
    update();

}