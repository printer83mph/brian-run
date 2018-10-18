// TODO: put entire thing into anonymous function: (function() {})();

const imgFiles = {
    ply: ["plybrain.png", 60, 60],
    bigBrain: ["bigbrain.png", 60, 60]
}

// TODO: pickup sprite names

const pickupTypes = {
    "ALKALI": {
        s: 20
    },

    "TRANSITION": {
        s: 35
    },

    "NONMETAL": {
        s: 20
    }
}

var canvas, ctx, game, frameCount, lastUpdate;

// LOADING IMAGES

function addImage(imgList, key) {
    let content = imgFiles[key];
    var img = new Image(content[1], content[2]);
    img.addEventListener("load", function() {
        imgList[key] = this;
    });
    console.log(`Loaded ${key}`);
    img.src = `media/${content[0]}`;
}

function loadImages(imgList) {

    for (key in imgFiles) {
        addImage(imgList, key);
    }

}

// PLAYER ------------------------------

class Player extends Circle {
    constructor(x, y, game) {
        super(x, y, 60);
        this.accel = 0.3;
        this.speedcap = 13;
        this.vel = new Vector(0,0);
        this.pickupRange = 70;

        this.game = game;

        this.inAir = false;
    }

    bump(vel) {
        this.vel.z = vel;
        this.inAir = true;
    }

    update(dt) {
        // Controller

        if (this.inAir) {
            this.vel.z -= 0.1 * dt;
        } else {
            let velAdd = new Vector((keysdown.indexOf("d") != -1) - (keysdown.indexOf("a") != -1), (keysdown.indexOf("s") != -1) - (keysdown.indexOf("w") != -1));
            velAdd.setMagnitude(this.inAir ? 0 : this.accel * dt);
            this.vel.add(velAdd);
            this.vel.scale(this.inAir ? 1 : 0.7);
        }

        if (this.vel.magnitude() > this.speedcap) {
            this.vel.setMagnitude(this.speedcap);
            console.log("speedcap hit");
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
        // ctx.fillStyle = (game.ply.inAir ? "#ff0000" : "#000000");
        // ctx.beginPath();
        // ctx.ellipse(this.pos.x, this.pos.y, this.size.x/2, this.size.y/2, 0, 0, Math.PI * 2, false);
        // ctx.fill();

        // REAL DRAWING
        ctx.drawImage(this.game.images["ply"], this.pos.x - this.size.x/2, this.pos.y - this.size.y/2);

        // ctx.strokeStyle = "#0000ff";
        // ctx.lineWidth = 10;
        // ctx.beginPath();
        // ctx.moveTo(this.pos.x, this.pos.y);
        // let controller = new Vector((keysdown.indexOf("d") != -1) - (keysdown.indexOf("a") != -1), (keysdown.indexOf("s") != -1) - (keysdown.indexOf("w") != -1));
        // controller.setMagnitude(game.ply.speedcap*10);
        // ctx.lineTo(this.pos.x + controller.x, this.pos.y + controller.y);
        // ctx.stroke();

        // ctx.strokeStyle = "#00ff00";
        // ctx.lineWidth = 5;
        // ctx.beginPath();
        // ctx.moveTo(this.pos.x, this.pos.y);
        // ctx.lineTo(this.pos.x + this.vel.x*10, this.pos.y + this.vel.y*10);
        // ctx.stroke();
    }
}

// PICKUP

class Pickup extends Circle {

    constructor(game, type, ypos) {
        let myType = pickupTypes[type];
        super(canvas.width + myType.s/2, ypos, myType.s/2);
        this.type = myType;
        this.game = game;
    }

    update(dt) {
        this.pos.x -= dt * this.game.speed;
    }

    despawnable() {
        return this.pos.x + this.size.x < 0;
    }

    canBePickedUp() {
        // return Collisions.circleTouchingCircle(this, this.game.ply);

        return Vector.sub(this.pos, this.game.ply.pos).magnitudeSq() < (this.size.x/2 + this.game.ply.pickupRange)**2;
    }

    draw() {
        // DEBUG
        ctx.fillStyle = this.canBePickedUp() ? "#000000" : "#a0a0a0";
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.size.x, this.size.y, 0, 0, Math.PI * 2, false);
        ctx.fill();
    }

}

// GAME

class Game {

    constructor() {
        
        this.ply = new Player(canvas.width/2, canvas.height/2, this);
        
        this.speed = 0.2;
        this.pickups = [];
        this.enemies = [];
        this.projectiles = [];
        this.plyProjectiles = [];
        this.state = "LOADING";
        this.images = {};

        loadImages(this.images);

    }

    update(dt) {

        if (this.state == "ACTIVE") {
            
            // update ply
            this.ply.update(dt);

            // update pickups
            let i = this.pickups.length;
            while (i--) {
                this.pickups[i].update(dt);
                if (this.pickups[i].despawnable()) {
                    this.pickups.splice(i,1);
                    console.log("despawnable");
                }
            }

            // TODO: logic for spawns
            if (frameCount % 120 == 0) {
                if (Math.random() < 0.3) {
                    this.pickups.push(new Pickup(this, "ALKALI", Math.random() * canvas.height));
                } else {
                    this.pickups.push(new Pickup(this, "TRANSITION", Math.random() * canvas.height));
                }
            }
        
        } else if (this.state == "LOADING") {

            // not much here, just show loading

            if (Object.keys(this.images).length == Object.keys(imgFiles).length) {
                this.state = "MENU";
                console.log("Beep");
            }
        
        } else if (this.state == "MENU") {

            if (keysdown.indexOf(" ") != -1) {
                this.state = "ACTIVE";
            }

            // logic to start game

        } else if (this.state == "OVER") {
            
        }

    }

    draw() {

        // draw bg
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.state == "ACTIVE") {
            // draw pickups
            let i = this.pickups.length;
            while (i--) {
                this.pickups[i].draw();
            }

            // draw ply
            this.ply.draw();
        }

    }

}

// SETUP STUFF ------------------------------

function loop() {

    let now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    
    game.update(dt);
    game.draw();

    frameCount++;


    window.requestAnimationFrame(loop);

}

function setup() {

    frameCount = 0;

    game = new Game();

}

window.onload = function() {

    canvas = document.getElementById("cnvs");
    ctx = canvas.getContext("2d");

    setup();
    loop();

}