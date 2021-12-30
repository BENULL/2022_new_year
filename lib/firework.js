function Firework(x, y, tx, ty, color) {
    this.name = 'Firework';
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, -random(0, 30));
    this.acc = new Vector(0, 0);
    this.angle = random(0, 360);
    this.speed = random(150, 300);

    this.accSp = new Vector(0, -randomInt(5, 10));

    this.friction = 1;

    this.hue = color;
    this.saturation = 100;
    this.lightness = randomInt(50, 80);
    this.alpha = random(40, 100) / 100;

    this.tail = [
        new Vector(x, y),
        new Vector(x, y),
        new Vector(x, y)
    ];

    this.radius = 2;

    this.showTarget = false;
    this.target = new Vector(tx, ty);
    this.targetRadius = 5;
    this.CollisionRadius = 5;

    this.IsDead = false;
    this.flag = 0;

    this.vel = this.target.clone().subtract(this.pos).norm().multiplyScalar(this.speed);
}

Firework.prototype.applyForce = function (force) {
    this.acc.add(force);
}

Firework.prototype.update = function (dt) {

    this.tail.pop();
    this.tail.unshift(this.pos.clone());

    this.applyForce(this.accSp);
    this.vel.add(this.acc);
    this.vel.multiplyScalar(this.friction);
    this.pos.add(this.vel.clone().multiplyScalar(dt));
    this.acc.multiplyScalar(0);

    this.CheckLife();
}

Firework.prototype.render = function (ctx) {
    ctx.save();
    let color = 'hsla(' + this.hue + ',' + this.saturation + '%, ' + this.lightness + '%, ' + this.alpha + ')';

    if (this.showTarget) {
        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, this.targetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    FillCircle(ctx, this.pos.x, this.pos.y, this.radius, color);

    let randomTail = this.tail[randomInt(0, this.tail.length - 1)];
    DrawLine(ctx, randomTail, this.pos, this.radius, color);

    ctx.restore();
}

Firework.prototype.CheckLife = function () {
    if (this.IsDead) return;

    if (this.pos.y < 0) {
        this.IsDead = true;
    }

    if (CircleToCircle(this.pos, this.CollisionRadius, this.target, this.CollisionRadius) ||
        this.vel.y > 0) {
        this.IsDead = true;

        CreateParticle(this.pos.x, this.pos.y, this.hue, randomInt(100, 500));
        if (randomInt(0, 1000) < 200) {
            CreateParticle(this.pos.x, this.pos.y, random(0, 360), randomInt(300, 800));
        }
    }
}

//---------------------

function CreateFirework() {
    let sx = random(width * 0.1, width * 0.9);
    let sy = height;
    let ex = sx;
    let ey = random(height * 0.1, height * 3 / 4);

    fireworks.push(new Firework(sx, sy, ex, ey, random(0, 360)));
}