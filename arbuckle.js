
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

function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vector.prototype = {
    
    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    },
    
    mul: function(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    },
    

    div: function(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
    },
    
    magnitude: function() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    },

    setMagnitude: function(m) {
        this.div(this.getMag());
        this.mul(new Vector(m, m));
    },

    heading: function() {
        return Math.atan2(this.y, this.x);
    }


}

Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
}

Vector.sub = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.x - v2.x);
}

Vector.mul = function(v1, v2) {
    return new Vector(v1.x * v2.x, v1.y * v2.y);
}

Vector.div = function(v1, v2) {
    return new Vector(v1.x / v2.x, v1.y / v2.y);
}

Vector.normalize = function(v) {
    let mag = v.getMag();
    return new Vector()
}

Vector.dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y; 
}
