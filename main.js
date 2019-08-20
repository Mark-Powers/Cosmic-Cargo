var gameInterval, canvas, ctx, width, height;
var t, gameState, ship, party, images, imagesLoaded, 
    endDistance, currentEvent, currentDay, lastEventDay, 
    selectedEventChoice, doEventAction, eventResult;
var FPS = 10;
function init() {
    t = 0 // The frame of the game (time basically)
    lastEventT = 0
    endDistance = 100
    width = 160
    height = 144
    currentDay = 1
    lastEventDay = 1
    gameState = "title";
    gameInterval = setInterval(game, 1000 / FPS);
    ship = {
        fuel: 100,
        cargo: 50,
        credits: 1000, 
        distance = 0,
        speed = 5
    }
    party = createParty(6);
    generate_events();
}

function createParty(size){
    party = [];
    for(var i = 0; i < size; i++){
        party.push({
            name: getRandomName(),
            status: getStatus(""),
        });
    }
    return party;
}
var randomNames;
var randomNameIndex = 0;
function getRandomName(){
    if(randomNames == undefined){
        randomNames = [
            "Mark",
            "Matt",
            "Bryce",
            "Tanner",
            "Shawn",
            "Janet",
            "Jill",
            "Stephanie",
            "Rose",
            "Martha",
        ];
        shuffle_array(randomNames);
    }
    return randomNames[randomNameIndex++];
}
function getAliveMembers(){
    return party.filter( el => (el.status != "Dead"));
}
function getStatus(currentStatus, delta = undefined){
    let statuses = {
        "": { // Unset status just make good
            "up": "Good",
            "down": "Good"
        },
        "Good": {
            "up": "Good",
            "down": "OK"
        },
        "OK": {
            "up": "Good",
            "down": "Poor"
        },
        "Poor": {
            "up": "OK",
            "down": "Dead"
        },
        "Dead": {
            "up": "Dead",
            "down": "Dead"
        },
    };
    if(delta == undefined){ // Initial
         return "Good"
    } else if(delta == 0){
        return currentStatus;
    } else if(delta > 0){
        return statuses[currentStatus]["up"];
    }
    else if(delta < 0){
        return statuses[currentStatus]["down"];
    }
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
    var imagesArray = loadImages(["Assets/Ship_1.png", "Assets/Ship_2.png", "Assets/Ship_Destroyed.png"])
    images = {
        "ship1": imagesArray[0],
        "ship2": imagesArray[1],
        "shipDestroyed": imagesArray[2],
    };
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
            ctx.fillRect(0, 0, width, height);
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
                ctx.drawImage(images["ship1"], 20, 28); 
            } else {
                ctx.drawImage(images["ship2"], 20, 28); 
            }
            // map
            font(10, `Day ${currentDay}`, 3, 82);
            font(10, `${ship.distance}/${endDistance} lightyears`, 3, 139);
            break;
        case "event":
            // background
            color(3);
            ctx.fillRect(0, 0, width, height);
            if(eventResult == undefined){
                font(16, `${currentEvent.name}`, 5, 13);
                font(12, `${currentEvent.desc}`, 5, 25, true);
                let choices = get_choices(currentEvent)
                var i = 0;
                for(let choice of choices){
                    font(10, choice, 10, 100 + 10*i);
                    if(selectedEventChoice == i){
                        font(10, `>`, 4, 100 + 10*i);
                    }
                    i++;
                }
            } else {
                font(12, `${eventResult}`, 5, 11, true);
                font(12, "(press any key)", 26, height - 8);
            }
            break;
        case "status":
            // background
            color(3);
            ctx.fillRect(0, 0, width, height);
            // person list
            var i = 0;
            for(let person of party){
                font(10, person.name, 15, 15 + 12*i);
                font(10, person.status, 100, 15 + 12*i);
                i++;
            }
            
            font(10, `Cargo: ${ship.cargo} tons`, 15, 107);
            font(10, `Credits: ${ship.credits}`, 15, 119);
            font(10, `Fuel: ${ship.fuel}%`, 15, 131);
            break;
        case "gameover":
            // background
            color(3);
            ctx.fillRect(0, 0, width, height);
            // game over text
            color(1);
            ctx.fillRect(28, 33, 100, 20);
            font(16, "Game over!", 30, 50);
            break;
        case "win":
            color(3);
            ctx.fillRect(0, 0, width, height);
            // game over text
            font(16, "You've arrived!", 3, 12);
            font(10, "Score:", 3, 24);
            font(10, `${getAliveMembers().length} alive members * 400`, 7, 34);
            font(10, `${ship.cargo} tons of cargo * 100`, 7, 44);
            font(10, `${ship.credits} credits`, 7, 54);
            let total = getAliveMembers().length*400 + ship.cargo*100 + ship.credits;
            font(10, `Total: ${total}`, 20, 120);
            break;

    }
}
function drawStars(w, h){
    color(1);
    for(var x = 0; x < w; x++){
        for(var y = 0; y < h; y++){
            let chance = 1; // chance% of drawing a star
            if(random_chance(0.01)){
            //if(random_int(100) < chance){
                ctx.fillRect(x, y, 1, 1);
            } 
        }
    }
}
function drawTitle(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
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
            if(t % ship.speed == 0){
                currentDay++;
                if(currentDay % 3 == 0){
                    ship.fuel--;
                }
                // Check for event for today
                if(lastEventDay + 3 < currentDay){
                    // 20% chance any day 3 days after last event will be another event
                    if(random_chance(0.2)){
                    //if(randomInt(5) < 1){ 
                        lastEventDay = currentDay;
                        currentEvent = get_event();
                        selectedEventChoice = 0;
                        doEventAction = false;
                        eventResult = undefined;
                        gameState = "event";
                    }                
                }
            }
            ship.distance++;
            if(ship.distance >= endDistance){
                gameState = "win"
            }            
            break;
        case "event":
            if(doEventAction){
                eventResult = handle_event(currentEvent, selectedEventChoice, ship, party);
            }
            break;
        case "gameover":
            clearInterval(gameInterval);
            break;
    }
    t++;
}
function keyPush(e) {
    if((imagesLoaded && gameState == "title")
        || ((gameState == "event" && eventResult != undefined))
        ){
        gameState = "main";
        return;
    }
    switch (e.keyCode) {
        case 37: // left
            break;
        case 38: // up
            if(gameState == "event"){
                selectedEventChoice--
                if(selectedEventChoice < 0){
                    selectedEventChoice = get_choices(currentEvent).length-1
                }
            }
            break;
        case 39: // right
            break;
        case 40: // down
            if(gameState == "event"){
                selectedEventChoice++
                if(selectedEventChoice >= get_choices(currentEvent).length){
                    selectedEventChoice = 0
                }
            }
            break;
        case 90: // z
            if(gameState == "event"){
                doEventAction = true
            }
            break;
        case 88: // x
            break;
        case 32: // space
            if(gameState == "status"){
                gameState = "main";
            } else if(gameState == "main"){
                gameState = "status";
            }
            break;
        case 13: // enter
            break;
    }
}
function font(size, what, x, y, wrap = false) {
    ctx.font = size + "px Courier";
    color(2);
    if(wrap){
        var parts = what.match(/.{1,21}\W/g); // Match up to 22 characters, making sure to not end a line mid word
        parts.forEach((element, i) => {
            ctx.fillText(element.trim(), x, y + i*size);
        });
    } else {
        ctx.fillText(what, x, y);
    }
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