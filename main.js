var gameInterval, canvas, ctx, width, height;
var t, gameState, ship, party;

function init() {
    t = 0 // The frame of the game (time basically)
    width = 160
    height = 144
    gameState = "title";
    gameInterval = setInterval(game, 1000 / 15);
    ship = {
        fuel: 100,
        cargo: 50,
        credits: 1000
    }
    party = [
        {name: "Mark", status: "Good"},
        {name: "Matt", status: "Good"},
        {name: "Bryce", status: "Good"},
        {name: "Tanner", status: "Good"},
    ]
}
window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
    init();
    resizeCanvas();
}
function resizeCanvas() {
    canvas.width = width;
    canvas.height = height;
}
function game() {
    update();
    draw();
}
function draw() {
    switch(gameState){
        case "title":
            // background
            color(3);
            ctx.fillRect(0, 0, width-2, height-2);
            // stars
            color(0);
            for(var x = 0; x < width; x++){
                for(var y = 0; y < height; y++){
                    let chance = 1; // chance% of drawing a star
                    if(randomInt(100) < chance){
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
            // title
            font(25, "PROJECT 71", 4, 20);
            font(12, "A space trucking game", 7, 30);
            font(12, "(press any key)", 30, height - 20);
            break;
        case "main":
            // background
            color(3);
            ctx.fillRect(1, 1, width, height);
            // map rectangle
            color(1)
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.rect(1, 1, width-2, height/2);
            ctx.stroke();
            // ship rectangle
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.rect(1, height/2, width-2, height/2 -1);
            ctx.stroke();
            break;
        case "status":
            // background
            color(3);
            ctx.fillRect(0, 0, width-2, height-2);
            // person list
            var i = 0;
            for(let person of party){
                font(10, person.name, 15, 15 + 15*i);
                font(10, person.status, 100, 15 + 15*i);
                i++;
            }
            break;
        case "gameover":
            // background
            color(3);
            ctx.fillRect(1, 1, width-2, height-2);
            // game over text
            color(1);
            ctx.fillRect(28, 33, 100, 20);
            font(16, "Game over!", 30, 50);
            break;
    }
}
function update() {
    switch(gameState){
        case "main":
            break;
        case "gameover":
            clearInterval(gameInterval);
            break;
    }
    t++;
}
function keyPush(e) {
    if(gameState = "title"){
        gameState = "main";
        return;
    }
    switch (e.keyCode) {
        case 37: // left
            
            break;
        case 38: // up
            if (vy == 1) return;
            
            break;
        case 39: // right
            
            break;
        case 40: // down
            
            break;
        case 90: // z
            break;
        case 88: // x
            break;
        case 32: // space
            if(gameState == "status"){
                gameState = "main";
            } else {
                gameState = "status";
            }
            break;
        case 13: // enter
            break;
    }
}
function randomInt(max) {
    return Math.floor(Math.random() * max);
}
function font(size, what, x, y) {
    ctx.font = size + "px Courier";
    color(2);
    ctx.fillText(what, x, y);
}
function color(c) {
    switch (c){
        case 0:
            ctx.fillStyle = "#00ff00";
            ctx.strokeStyle = "#00ff00";
            break;
        case 1:
            ctx.fillStyle = "#00b300";
            ctx.strokeStyle = "#00b300";
            break;
        case 2:
            ctx.fillStyle = "#008000";
            ctx.strokeStyle = "#008000";
            break;
        case 3:
            ctx.fillStyle = "#003300";
            ctx.strokeStyle = "#003300";
            break;
    }
}