function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/* 
    ### Examples:
    var vec = Vector.fromArray([42,21]);
    vec.toString();
    // => x:42, y:21
*/
Vector.fromArray = function (arr) {
    return new Victor(arr[0] || 0, arr[1] || 0);
};

/*
    ### Examples:
    var vec = Victor.fromObject({ x: 42, y: 21 });
    vec.toString();
    // => x:42, y:21
*/
Vector.fromObject = function (obj) {
    return new Vector(obj.x || 0, obj.y || 0);
};

/*
    ### Examples:
    var vec = new Vector(10,20).clone();
    vec.addScalar(40);
    vec.toString();
    // => x:50, y:60
*/
Vector.prototype.clone = function () {
    return new Vector(this.x, this.y);
};


Vector.prototype.toString = function () {
    return 'x:' + this.x + ', y:' + this.y;
};



Vector.prototype.add = function (vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
};
Vector.prototype.addScalar = function (scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
};


Vector.prototype.subtract = function (vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
};
Vector.prototype.subtractScalar = function (scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
};


Vector.prototype.multiply = function (vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
};
Vector.prototype.multiplyScalar = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};


Vector.prototype.divide = function (vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
};
Vector.prototype.divideScalar = function (scalar) {
    if (scalar !== 0) {
        this.x /= scalar;
        this.y /= scalar;
    } else {
        this.x = 0;
        this.y = 0;
    }
    return this;
};


Vector.prototype.dot = function (vec2) {
    return this.x * vec2.x + this.y * vec2.y;
};
Vector.prototype.cross = function (vec2) {
    return (this.x * vec2.y) - (this.y * vec2.x);
};
Vector.prototype.projectOnto = function (vec2) {
    let coeff = ((this.x * vec2.x) + (this.y * vec2.y)) / ((vec2.x * vec2.x) + (vec2.y * vec2.y));
    this.x = coeff * vec2.x;
    this.y = coeff * vec2.y;
    return this;
};
Vector.prototype.projectLengthOnto = function (vec2) {
    let dotProduct = this.dot(vec2);
    let len = vec2.length();
    return dotProduct / len;
};


Vector.prototype.setAngle = function (angle) {
    let length = this.length();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
};
Vector.prototype.setAngleDeg = function (angle) {
    let length = this.length();
    angle = this.deg2rad(angle);
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
};

Vector.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
};
Vector.prototype.getAngleDeg = function () {
    return this.rad2deg(this.getAngle());
};

/* 
    ### Examples:
    var v1 = new Vector(10,0);
    v1.rotateDeg(90);

    v1.toString();
    // => x:0, y:10

    v1.rotateDeg(90);

    v1.toString();
    // => x:-10, y:0
*/
Vector.prototype.rotate = function (angle) {
    let new_x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
    let new_y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

    this.x = new_x;
    this.y = new_y;
    return this;
    /* y error, but why?
    this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    this.y = this.y * Math.cos(angle) + this.x * Math.sin(angle);
    */
};
Vector.prototype.rotateDeg = function (angle) {
    angle = this.deg2rad(angle);
    this.rotate(angle);
};

/* 
    ### Examples:
    var v1 = new Vector(10,0);
    v1.rotateToDeg(90);

    v1.toString();
    // => x:0, y:10

    v1.rotateToDeg(90);

    v1.toString();
    // => x:0, y:10
*/
Vector.prototype.rotateTo = function (rotation) {
    this.rotate(rotation - this.getAngle());
};
Vector.prototype.rotateToDeg = function (rotation) {
    rotation = this.deg2rad(rotation);
    this.rotateTo(rotation);
};

/* 
    ### Examples:
    var center = new Vector(50, 50);
    var p1 = new Vector(75,50);

    p1.rotateRefPointDeg(90, center);
    p1.toString();
    // => x:50, y:75

    p1.rotateRefPointDeg(90, center);
    p1.toString();
    // => x:25, y:50
*/
Vector.prototype.rotateRefPoint = function (angle, refP) {
    let new_x = (this.x - refP.x) * Math.cos(angle) - (this.y - refP.y) * Math.sin(angle) + refP.x;
    let new_y = (this.y - refP.y) * Math.cos(angle) + (this.x - refP.x) * Math.sin(angle) + refP.y;
    this.x = new_x;
    this.y = new_y;
};
Vector.prototype.rotateRefPointDeg = function (angle, refP) {
    angle = this.deg2rad(angle);
    this.rotateRefPoint(angle, refP);
};

/* 
    ### Examples:
    var center = new Vector(50, 50);
    var p1 = new Vector(75,50);

    p1.rotateToRefPointDeg(90, center);
    p1.toString();
    // => x:50, y:75

    p1.rotateToRefPointDeg(90, center);
    p1.toString();
    // => x:50, y:75
*/
Vector.prototype.rotateToRefPoint = function (rotation, refP) {
    let angle = rotation - Math.atan2(this.y - refP.y, this.x - refP.x);// this.position angle to refP 

    let new_x = (this.x - refP.x) * Math.cos(angle) - (this.y - refP.y) * Math.sin(angle) + refP.x;
    let new_y = (this.y - refP.y) * Math.cos(angle) + (this.x - refP.x) * Math.sin(angle) + refP.y;
    this.x = new_x;
    this.y = new_y;
};
Vector.prototype.rotateToRefPointDeg = function (rotation, refP) {
    rotation = this.deg2rad(rotation);
    this.rotateToRefPoint(rotation, refP);
};


Vector.prototype.setLength = function (len) {
    let angle = this.getAngle();
    this.x = Math.cos(angle) * len;
    this.y = Math.sin(angle) * len;
};

Vector.prototype.length = function () {
    return Math.sqrt(this.lengthSq());
};
Vector.prototype.lengthSq = function () {
    return this.x * this.x + this.y * this.y;
};

Vector.prototype.normalize = function () {
    let length = this.length();

    if (length === 0) {
        this.x = 1;
        this.y = 0;
    } else {
        this.divideScalar(length);
    }
    return this;
};
Vector.prototype.norm = Vector.prototype.normalize;

Vector.prototype.normalL = function () {
    return new Vector(-this.y, this.x);
};
Vector.prototype.normalR = function () {
    return new Vector(this.y, -this.x);
};

Vector.prototype.unfloat = function () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
};
Vector.prototype.toFixed = function (precision) {
    if (typeof precision === 'undefined') { precision = 8; }
    this.x = this.x.toFixed(precision);
    this.y = this.y.toFixed(precision);
    return this;
};

Vector.prototype.rad2deg = function (rad) {
    return rad * 180 / Math.PI;
};
Vector.prototype.deg2rad = function (deg) {
    return deg * Math.PI / 180;
};
