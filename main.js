var gameInterval, canvas, ctx, width, height;
var t, gameState, ship, party, images, imagesLoaded;

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
function loadImages(imagefiles) {
    loadcount = 0;
    loadtotal = imagefiles.length;
    imagesLoaded = false;
 
    // Load the images
    var loadedimages = [];
    for (var i=0; i<imagefiles.length; i++) {
        // Create the image object
        var image = new Image();
 
        // Add onload event handler
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                // Done loading
                imagesLoaded = true;
            }
        };
        image.src = imagefiles[i];
        loadedimages[i] = image;
    }
    return loadedimages;
}
window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
    images = loadImages(["Assets/Ship_1.png", "Assets/Ship_2.png"])
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
            drawTitle();
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
            drawStars(width, height/2);
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.rect(1, height/2, width-2, height/2 -1);
            ctx.stroke();
            // ship
            if(t % 6 < 3){
                ctx.drawImage(images[0], 20, 28);
            } else {
                ctx.drawImage(images[1], 20, 28);
            }
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
            
            font(10, `Fuel: ${ship.fuel}%`, 15, 95);
            font(10, `Cargo: ${ship.cargo} tons`, 15, 110);
            font(10, `Credits: ${ship.credits}`, 15, 125);
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
function drawStars(w, h){
    color(1);
    for(var x = 0; x < w; x++){
        for(var y = 0; y < h; y++){
            let chance = 1; // chance% of drawing a star
            if(randomInt(100) < chance){
                ctx.fillRect(x, y, 1, 1);
            } 
        }
    }
}
function drawTitle(){
    // background
    color(3);
    ctx.fillRect(0, 0, width-2, height-2);
    // stars
    drawStars(width, height);
    // title
    font(25, "PROJECT 71", 4, 20);
    font(12, "A space trucking game", 7, 30);
    font(12, "(press any key)", 30, height - 20);
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
    if(imagesLoaded && gameState == "title"){
        gameState = "main";
        return;
    }
    switch (e.keyCode) {
        case 37: // left
        case 38: // up
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
    var color = "";
    switch (c){
        case 0:
            color = "#FA0000";
            break;
        case 1:
            color = "#b4b4b4";
            break;
        case 2:
            color = "#fafafa";
            break;
        case 3:
            color = "#000000";
            break;
    }
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}