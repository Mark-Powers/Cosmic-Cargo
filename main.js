var gameInterval, canvas, ctx, width, height;
var t, gameState, ship, party, images, imagesLoaded, 
    currentEvent, lastEventDay, 
    selectedEventChoice, doEventAction, eventResult;
var FPS = 10;
function init() {
    t = 0 // The frame of the game (time basically)
    lastEventT = 0
    width = 160
    height = 144
    lastEventDay = 1
    gameState = "title";
    gameInterval = setInterval(game, 1000 / FPS);
    ship = {
        fuel: 100,
        cargo: 50,
        credits: 1000, 
        distance: 0,
        end_distance: 100,
        speed: 10, // How many lightyears traveled in a day
        current_day: 1
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
window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
    var imagesArray = loadImages(["Assets/Ship_1.png", "Assets/Ship_2.png", "Assets/Ship_Destroyed.png", "Assets/Map.png"])
    images = {
        "ship1": imagesArray[0],
        "ship2": imagesArray[1],
        "shipDestroyed": imagesArray[2],
        "map": imagesArray[3]
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

function update() {
    switch(gameState){
        case "main":
            t++;
            if(t % ship.speed == 0){
                ship.current_day++;
                if(ship.current_day % 3 == 0){
                    ship.fuel--;
                }
                // Check for event for today
                if(lastEventDay + 3 < ship.current_day){
                    // chance any day 3 days after last event will be another event
                    if(random_chance(0.1)){
                        lastEventDay = ship.current_day;
                        currentEvent = get_event();
                        selectedEventChoice = 0;
                        doEventAction = false;
                        eventResult = undefined;
                        gameState = "event";
                    }                
                }
            }
            ship.distance++;
            if(ship.distance >= ship.end_distance){
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
