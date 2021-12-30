var ctx,
    textctx,
    textCanvas,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    DeltaTime = 0,
    loop = true,
    start = 12;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#222";
var keys = {}, mousePos = {};
var texts = [];

var h_d = 25,
    num_d = 10;

function fun() {
    start--;
    if (start <= 0) {
        start = -1;
    }
}
// function toggleSound() {
//     var music = document.getElementById("bgmMusic");
//     if (music.paused) {
//         music.paused=false;
//         music.play();
//     }    
// }

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    return theRequest;
}

window.onload = function () {
    ctx = CreateDisplay("myCanvas");


    textCanvas = document.createElement("canvas");
    textCanvas.width = 1000;
    textCanvas.height = 300;
    textctx = textCanvas.getContext("2d");
    textctx.fillStyle = "#000000";
    textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

    msg = getRequest();
    if (msg.msg) {
        texts = msg.msg.split(',')
    }

    console.log(texts)


    width = ctx.canvas.width; height = ctx.canvas.height;

    let audio = document.getElementById('bgmMusic');

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

    // setInterval("toggleSound()",10);

    setInterval("fun()", 1700);

    main();

}



var textParticles = [];

function createTextFireworks(x, y, text = "") {

    var hue = Math.random() * 360;
    var hueVariance = 30;

    function setupColors(p) {
        p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
        p.brightness = Math.floor(Math.random() * 21) + 50;
        p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
    }

    if (text != "") {

        var gap = 6;
        var fontSize = 120;

        textctx.font = fontSize + "px Verdana";
        textctx.fillStyle = "#ffffff";

        var textWidth = textctx.measureText(text).width;
        var textHeight = fontSize;

        textctx.fillText(text, 0, textHeight);
        var imgData = textctx.getImageData(0, 0, textWidth, textHeight * 1.2);

        textctx.fillStyle = "#000000";
        textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

        for (var h = 0; h < textHeight * 1.2; h += gap) {
            for (var w = 0; w < textWidth; w += gap) {
                var position = (textWidth * h + w) * 4;
                var r = imgData.data[position], g = imgData.data[position + 1], b = imgData.data[position + 2], a = imgData.data[position + 3];

                if (r + g + b == 0) continue;

                var p = {};

                p.x = x;
                p.y = y;

                p.fx = x + w - textWidth / 2;
                p.fy = y + h - textHeight / 2;

                p.size = Math.floor(Math.random() * 2) + 1;
                p.speed = 1;

                setupColors(p);

                textParticles.push(p);
            }
        }
    }
}
function drawTextFireworks() {


    for (var i = 0; i < textParticles.length; i++) {
        var p = textParticles[i];

        p.x += (p.fx - p.x) / 10;
        p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

        p.alpha -= 0.006;

        if (p.alpha <= 0) {
            textParticles.splice(i, 1);
            continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.fillStyle = 'hsla(' + p.hue + ',100%,' + p.brightness + '%,' + p.alpha + ')';
        ctx.fill();
        ctx.restore();
    }
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
    drawTextFireworks();

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
        let fontSize = height / num_d;
        let str1 = start + '';
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
    } else if (start <= 0) {
        let fontSize = height / h_d;
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
    createTextFireworks(e.clientX, e.clientY, texts[Math.floor(Math.random() * texts.length)]);
    // CreateParticle(e.clientX, e.clientY, randomInt(0, 360), randomInt(100, 500));
    if (randomInt(0, 700) < 300 || texts.length == 0) {
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
    if (width > height) {
        num_d = 5;
        h_d = 10;

    } else {
        num_d = 10;
        h_d = 25;

    }
    
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