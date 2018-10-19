
// this is a utility script to make stuff easier

// KEYS DOWN ------------------------------

var keysdown = [];

window.addEventListener("keydown", function(e) {
    if (keysdown.indexOf(e.key) === -1) {
        keysdown.push(e.key);
    }
});

window.addEventListener("keyup", function(e) {
    let i = keysdown.length;
    while (i--) {
        if (keysdown[i] == e.key) {
            keysdown.splice(i, 1);
        }
    }
});

// VECTORS ------------------------------

class Vector {

    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static mul(v1, v2) {
        return new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    static scale(v1,s) {
        return new Vector(v1.x * s, v1.y * s, v1.z * s);
    }

    static div(v1, v2) {
        return new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z)
    }

    static normalize(v) {
        if (v.magnitude() != 0) {
            return Vector.scale(v, 1/v.magnitude());
        }
    }

    static setMagnitude(v, m) {
        let out = Vector.normalize(v);
        out.scale(m);
        return out;
    }
    
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }
    
    mul(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    div(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
    }

    normalize() {
        if (this.magnitude() != 0) {
            this.scale(1/this.magnitude());
        }
    }

    // faster for comparison
    magnitudeSq() {
        return this.x**2 + this.y**2 + this.z**2;
    }
    
    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    setMagnitude(m) {
        this.normalize();
        this.scale(m);
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    setHeading(h) {
        // TODO: this function
        let mag = this.magnitude();
        this.normalize();
        this.mul(mag);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y; 
    }

}

// COLLISIONS -----------------------------

class Point {
    constructor(x, y) {
        this.pos = new Vector(x, y);
    }
}

class Ellipse extends Point {
    constructor(x, y, sx, sy) {
        super(x, y);
        this.size = new Vector(sx, sy);
    }
}

class Circle extends Ellipse {
    constructor(x, y, s) {
        super(x, y, s, s);
    }
}

class Rectangle extends Point {
    constructor(x, y, w, h) {
        super(x, y);
        this.size = new Vector(w, h);
    }
}

Collisions = {
    pointInCircle: function(p, c) {
        // console.log("mag squared: " + Vector.sub(p.pos, c.pos).magnitudeSq() + ", r squared: " + (c.size.x/2)**2);
        return Vector.sub(p.pos, c.pos).magnitudeSq() < (c.size.x/2)**2;
    },

    circleTouchingCircle: function(c1, c2) {
        return Vector.sub(c1.pos, c2.pos).magnitudeSq() < (c1.size.x/2 + c2.size.x/2)**2;
    }
}