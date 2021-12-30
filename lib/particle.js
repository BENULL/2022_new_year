function Particle(x, y, color, maxSpeed) {
    this.name = 'Particle';
    this.pos = new Vector(x, y);
    this.vel = new Vector(1, 0);
    this.acc = new Vector(0, 0);
    this.angle = random(0, 360);

    this.minSp = 150;
    this.maxSp = ((maxSpeed | 0) < this.minSp) ? this.minSp : maxSpeed;
    this.speed = random(10, this.maxSp);

    this.vel.setAngleDeg(this.angle);
    this.vel.setLength(this.speed);

    this.hue = color + randomInt(-10, 10);
    this.saturation = 100;
    this.lightness = randomInt(50, 80);
    this.alpha = random(40, 100) / 100;
    this.decay = random(10, 50) / 1000; // alpha 衰減

    this.flickerDensity = 10;

    this.wind = random(-12, 12);
    this.friction = 0.99;

    this.radius = randomInt(1, 3);

    this.tail = [
        new Vector(x, y),
        new Vector(x, y),
        new Vector(x, y)
    ];

    this.IsDead = false;
}

Particle.prototype.applyForce = function (force) {
    this.acc.add(force);
}

Particle.prototype.update = function (dt) {
    if (this.IsDead) return;

    this.tail.pop();
    this.tail.unshift(this.pos.clone());

    this.vel.add(this.acc);
    this.vel.multiplyScalar(this.friction);
    this.pos.add(this.vel.clone().multiplyScalar(dt));
    this.acc.multiplyScalar(0);

    this.alpha -= this.decay;

    this.CheckLife();
}

Particle.prototype.render = function (ctx) {
    ctx.save();

    let color = 'hsla(' + this.hue + ',' + this.saturation + '%, ' + this.lightness + '%, ' + this.alpha + ')';
    let randomTail = this.tail[randomInt(0, this.tail.length - 1)];
    /*
    FillCircle(ctx, this.pos.x, this.pos.y, this.radius, color);

    FillCircle(ctx, randomTail.x, randomTail.y, this.radius, color);
    */
    DrawLine(ctx, randomTail, this.pos, this.radius, color);


    if (this.flickerDensity > 0) {
        let inverseDensity = 50 - this.flickerDensity;
        if (randomInt(0, inverseDensity) == inverseDensity) {
            let randomAlpha = random(50, 100) / 100;
            let color = 'hsla(' + this.hue + ',' + this.saturation + '%, ' + this.lightness + '%, ' + randomAlpha + ')';
            FillCircle(ctx, this.pos.x, this.pos.y, (this.radius + randomInt(0, 3)) * 0.5, color);
        }
    }

    ctx.restore();
}

Particle.prototype.CheckLife = function () {
    let condition1 = this.alpha > 0;
    let condition2 = this.pos.x - this.radius < 0 || this.pos.x + this.radius > width ||
        this.pos.y - this.radius < 0 || this.pos.y + this.radius > height;
    this.IsDead = !condition1 || condition2;
}

//---------------------------------------------


function CreateParticle(x, y, color, num) {
    let speed = randomInt(0, num * 0.9);// 決定這次爆炸的最大範圍
    while (num--) {
        particles.push(new Particle(x, y, color, speed));
    }
}

//------------------------------------------------


function FillCircle(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}
function DrawLine(ctx, pos1, pos2, w, color) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function CircleToCircle(pos1, r1, pos2, r2) {
    let d = new Vector(pos2.x - pos1.x, pos2.y - pos1.y);
    return d.lengthSq() <= Math.pow(r1 + r2, 2);
}