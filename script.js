// TODO: put entire thing into anonymous function: (function() {})();

var canvas, ctx, game, frameCount, lastUpdate;

// PLAYER ------------------------------

class Player extends Circle {
    constructor(x, y) {
        super(x, y, 40);
        this.accel = 3;
        this.speedcap = 13;
        this.vel = new Vector(0,0);

        this.inAir = false;
    }

    bump(vel) {
        this.vel.z = vel;
        this.inAir = true;
    }

    update() {
        // Controller

        if (this.inAir) {
            this.vel.z -= 0.5;
        } else {
            let velAdd = new Vector((keysdown.indexOf("d") != -1) - (keysdown.indexOf("a") != -1), (keysdown.indexOf("s") != -1) - (keysdown.indexOf("w") != -1));
            velAdd.setMagnitude(this.inAir ? 0 : this.accel);
            this.vel.add(velAdd);
            this.vel.scale(this.inAir ? 1 : 0.7);
        }

        if (this.vel.magnitude() > this.speedcap) {
            this.vel.setMagnitude(this.speedcap);
            console.log("speecap hit");
        }

        this.pos.add(this.vel);

        // PLY logic

        if (this.inAir && this.pos.z < 0) {
            this.inAir = false;
            this.pos.z = 0;
            this.vel.z = 0;
        }

    }

    draw() {
        
        // DEBUG
        ctx.fillStyle = (game.ply.inAir ? "#ff0000" : "#000000");
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.size.x, this.size.y, 0, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.strokeStyle = "#0000ff";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        let controller = new Vector((keysdown.indexOf("d") != -1) - (keysdown.indexOf("a") != -1), (keysdown.indexOf("s") != -1) - (keysdown.indexOf("w") != -1));
        controller.setMagnitude(game.ply.speedcap*10);
        ctx.lineTo(this.pos.x + controller.x, this.pos.y + controller.y);
        ctx.stroke();

        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.vel.x*10, this.pos.y + this.vel.y*10);
        ctx.stroke();
    }
}

// GAME ------------------------------

function loop() {

    let now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    
    update();
    draw();

    frameCount++;


    window.requestAnimationFrame(loop);

}

function setup() {

    frameCount = 0;

    game = {}

    game.ply = new Player(canvas.width/2, canvas.height/2);
    
    game.attacks = [];
    game.enemies = [];
    game.projectiles = [];
    game.state = "ACTIVE";
}

function update() {

    if (game.state == "ACTIVE") {
        game.ply.update();
    
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (game.state == "OVER") {
        
    }
    

}

function draw() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    game.ply.draw();
}

window.onload = function() {

    canvas = document.getElementById("cnvs");
    ctx = canvas.getContext("2d");

    setup();
    loop();

}