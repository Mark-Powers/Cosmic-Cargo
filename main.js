var gameInterval, canvas, ctx, width, height;
var t, gameState, ship, party, images, imagesLoaded, 
    currentEvent, lastEventDay, 
    selectedChoice, doAction, eventResult, doneShopping, shopResult;
var FPS = 10;
function init() {
    t = 0 // The frame of the game (time basically)
    lastEventT = 0
    width = 160
    height = 144
    lastEventDay = 1
    gameState = "title";
    gameInterval = setInterval(game, 1000 / FPS);
    doneShopping = false;
    ship = {
        fuel: 100,
        cargo: 50,
        credits: 1000, 
        distance: 0,
        end_distance: 3000,
        speed: 10, // How many lightyears traveled in a day
        current_day: 1,
        next_shop: 1
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
                    if(random_chance(0.15)){
                        lastEventDay = ship.current_day;
                        currentEvent = get_event();
                        selectedChoice = 0;
                        doAction = false;
                        eventResult = undefined;
                        gameState = "event";
                    }                
                }
                // Check for shop day
                let progress = ship.distance/ship.end_distance
                if(ship.next_shop * .25<progress){
                    ship.next_shop++;
                    currentShop = new Shop(ship);
                    selectedChoice = 0;
                    doAction = false;
                    doneShopping = false;
                    shopResult = undefined;
                    gameState = "shop";
                    pause_audio("bgm");
                    play_audio("shop", true);
                }
            }
            ship.distance++;
            if(ship.distance >= ship.end_distance){
                gameState = "win"
                pause_audio("bgm");
                pause_audio("shop");
                play_audio("endgame", true);
            }            
            break;
        case "event":
            if(doAction){
                eventResult = handle_event(currentEvent, selectedChoice, ship, party);
                gameState = "event_result";
            }
            break;
        case "shop":
            if(doAction){ // TODO: Refactor this into method within shop.js
                if (selectedChoice == 0){
                    shopResult = purchase_fuel(ship, currentShop);
                    gameState = "shop_result";
                }
                else if (selectedChoice == 1){
                    shopResult = truck_talk(currentShop);
                    gameState = "shop_result";
                }
                else if (selectedChoice == 2){
                    shopResult = leave();
                    doneShopping = true;
                    gameState = "shop_result";
                }
            }
            break;
        case "gameover":
            clearInterval(gameInterval);
            break;
    }
}
function keyPush(e) {
    if(imagesLoaded && gameState == "title") {
        // Plays background music if not playing
        play_audio("bgm", true);
        gameState = "setup";
        return;
    } else if(gameState == "setup" || gameState == "event_result"){
        // Plays background music if not playing
        play_audio("bgm", true);
        gameState = "main";
        return;
    } else if (gameState == "shop_result"){
        if (doneShopping == true){
            gameState = "main";
            pause_audio("shop");
            play_audio("bgm", true);
            return;
        }
        gameState = "shop";
        selectedChoice = 0;
        doAction = false;
        shopResult = undefined;
        return;
    }

    switch (e.keyCode) {
        case 37: // left
            break;
        case 38: // up
            if(gameState == "event"){
                selectedChoice--;
                if(selectedChoice < 0){
                    selectedChoice = get_choices(currentEvent).length-1;
                }
                play_audio("click");
            }
            else if(gameState == "shop"){
                selectedChoice--;
                if(selectedChoice < 0){
                    selectedChoice = shop_choices(currentShop).length-1;
                }
                play_audio("click");
            }
            break;
        case 39: // right
            break;
        case 40: // down
            if(gameState == "event"){
                selectedChoice++;
                if(selectedChoice >= get_choices(currentEvent).length){
                    selectedChoice = 0;
                }
                play_audio("click");
            }
            else if(gameState == "shop"){
                selectedChoice++;
                if(selectedChoice >= shop_choices(currentShop).length) {
                    selectedChoice = 0;
                }
                play_audio("click");
            }
            break;
        case 90: // z
            if(gameState == "event" || gameState == "shop"){
                doAction = true;
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
