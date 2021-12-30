var ctx,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    DeltaTime = 0,
    loop = true,
    start = 11;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#222";
var keys = {}, mousePos = {};

function fun() {
    start--;
    if(start <= 0) {
        start = -1;
    }
}
function toggleSound() {
    var music = document.getElementById("bgmMusic");
    if (music.paused) {
        music.paused=false;
        music.play();
    }    
}
window.onload = function () {
    ctx = CreateDisplay("myCanvas");
    width = ctx.canvas.width; height = ctx.canvas.height;

    let audio = document.getElementById('bg_music');

    // 兼容微信浏览器自动播放
    document.addEventListener("WeixinJSBridgeReady", function () {
      audio.play();
    }, false);
    
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mouseup", mouseup, false);
    document.addEventListener("mousemove", mousemove, false);
    window.addEventListener("resize", resize);
    
    setInterval("toggleSound()",10);
    
	setInterval("fun()", 1700);

    main();

}

// ----------------------------------------------------------
function mainLoop(timestamp) {
    Timesub = timestamp - lastTime;// get sleep
    DeltaTime = Timesub / 1000;
    lastTime = timestamp;
    //Clear
    ctx.fillStyle = 'rgba(34,34,34,' + clearAlpha + ')';
    ctx.fillRect(0, 0, width, height);
    //--------Begin-----------

    update(DeltaTime);
    draw(ctx);
    if (loop) {
        animation = window.requestAnimationFrame(mainLoop);
    } else {
        // over
    }
}
//-------------------------------------------------------
var clearAlpha = 0.3;

var particles = [];
var fireworks = [];
var gravity = new Vector(0, 3);

var backImg = new Image();   // Create new img element
backImg.src = 'img/skyline.png'; // Set source path
var scaleY, imgHeight, startY;

function main() {
    console.log("Start");

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';


    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}


function update(dt) {
    if (random(0, 1000) < 80 && start < 0) {
        CreateFirework();
    }

    for (particle of particles) {
        particle.applyForce(gravity);
        particle.update(dt);
    }

    for (firework of fireworks) {
        //firework.applyForce(gravity);
        firework.update(dt);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].IsDead) {
            particles.splice(i, 1);
        }
    }
    for (let i = fireworks.length - 1; i >= 0; i--) {
        if (fireworks[i].IsDead) {
            fireworks.splice(i, 1);
        }
    }
}

function draw(ctx) {
    drawBackground(ctx);

    for (particle of particles) {
        particle.render(ctx);
    }

    for (firework of fireworks) {
        firework.render(ctx);
    }


}

function drawBackground(ctx) {
    if (backImg.src != '') {
        scaleY = width / backImg.width;
        imgHeight = backImg.height * scaleY;
        startY = (height - imgHeight) * 6 / 7;
        ctx.drawImage(backImg, 0, startY, width, imgHeight);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, startY + imgHeight, width, (height - startY));
    }
    if (start > 0 && start <= 10) {
        let fontSize = height / 5;
        let str1 = start+'';
        let offPos = new Vector(0, Math.sin(new Date().getTime() / 1000) * 30);
        let fontPos1 = new Vector(
            width / 2 - str1.length * fontSize * 0.3 + offPos.x,
            height / 3 + offPos.y
        );
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
        drawString(ctx, str1,
            fontPos1.x, fontPos1.y,
            "rgba(255,255,0,1)", fontSize, "orbitron",
            0, 0, 0);
    }else if (start <= 0) {
        let fontSize = height / 10;
        let str1 = "Happy New Year !";
        //let offPos = new Vector(0, Math.tan(new Date().getTime() / 1000) * 30);
        let offPos = new Vector(0, Math.sin(new Date().getTime() / 1000) * 30);
        let fontPos1 = new Vector(
            width / 2 - str1.length * fontSize * 0.3 + offPos.x,
            height / 3 + offPos.y
        );
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
        drawString(ctx, str1,
            fontPos1.x, fontPos1.y,
            "rgba(255,255,0,1)", fontSize, "orbitron",
            0, 0, 0);
        let str2 = "2022";
        let fontPos2 = new Vector(
            width / 2 - str2.length * fontSize * 0.3 + offPos.x,
            height / 3 + fontSize + offPos.y
        );
        drawString(ctx, str2,
            fontPos2.x, fontPos2.y,
            "rgba(255,255,0,1)", fontSize, "orbitron",
            0, 0, 0);
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 0;
}
//---evnt---
function keydown(e) {
    keys[e.keyCode] = true;
}

function keyup(e) {
    delete keys[e.keyCode];
}

function mousedown(e) {
    CreateParticle(e.clientX, e.clientY, randomInt(0, 360), randomInt(100, 500));
    if (randomInt(0, 1000) < 300) {
        CreateParticle(e.clientX, e.clientY, randomInt(0, 360), randomInt(300, 800));
    }
}

function mouseup(e) {

}

function mousemove(e) {
    mousePos.x = e.clientX - ctx.canvas.offsetLeft
    mousePos.y = e.clientY - ctx.canvas.offsetTop;

}

function resize() {
    width = ctx.canvas.width = window.innerWidth;
    height = ctx.canvas.height = window.innerHeight;
}

//----tool-------
function toRadio(angle) {
    return angle * Math.PI / 180;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}

//---------------------
function CreateDisplay(id, width, height, border) {
    let canvas = document.createElement("canvas");
    let style_arr = [
        "display: block;",
        "margin: 0 auto;",
        "background: #FFF;",
        "padding: 0;",
        "display: block;"
    ];
    canvas.id = id;
    canvas.width = width | 0;
    canvas.height = height | 0;

    if (border) style_arr.push("border:1px solid #000;");

    if (!width && !height) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    canvas.style.cssText = style_arr.join("");

    document.body.appendChild(canvas);

    return canvas.getContext("2d");
}