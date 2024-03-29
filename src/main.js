var gameInterval, canvas, ctx, width, height;
var t, gameState, ship, party, images, imagesLoaded, 
    currentEvent, lastEventDay, 
    selectedChoice, doAction, eventResult, doneShopping, shopResult, talk_count, talked;
var FPS = 10;
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
        next_shop: 1,
        // hostiles / asteroid
        next_zone: 0,
        rate: 2.5
    }
    party = createParty(6);

    for(var song of music){
        audio[song].volume = 0.4
    }
    for(var song of sfx){
        audio[song].volume = 0.1
    }
    generate_events();

    // If Karen is in the Party add the 'Rouge Karen' event
    for (i = 0; i < party.length; i++){
        if (party[i].name == "Karen"){
            events.push(return_karen());
        }
    }

    talk_count = 0;
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
            "Karen",
            "Marge",
            "Scoob",
            "Ice Man",
            "Thunder",
            "Bandit",
            "Rocky",
            "Foxworthy",
            "Cable Guy",
            "Gus",
            "Turntable",
            "Hooch",
            "Bugeyes",
            "Kitty Kat",
            "Hollywood",
            "Skeeter",
            "Archimedes",
            "Ace",
            "Doc",
            "Flying Hog",
            "Fatcat",
            "Twitchy",
            "Stank",
            "Wagon Wheel",
            "Ford",
            "Bandit",
            "The Gambler",
            "Gygax",
            "Janet",
            "Jill",
            "Stephanie",
            "Albino Rhino",
            "Rose",
            "Martha",
            "Ohio Queen",
            "Charlie",
            "Frank",
            "Dale",
            "Hank",
            "Beatrice",
            "Roxanne",
            "Beatsy",
            "Caroline",
            "Mitch",
            "Gerty",
            "Ma'am",
            "Smokey",
            "Hoss",
            "Bonney",
            "Clyde",
            "Sundace",
            "Butch",
            "Big Dunc",
            "Chad",
            "Diego",
            "Slim-Jim",
            "Dick",
            "Rasputin",
            "Gaston",
            "Short Round",
            "Long Schlong",
            "Curtis",
            "Egg",
        ];
        shuffle_array(randomNames);
    }
    return randomNames[randomNameIndex++];
}
function getAliveMembers(){
    return party.filter( el => (el.status != "Dead" && el.status != "Missing"));
}
function getStatus(currentStatus, delta = undefined){
    let statuses = {
        "": { // Unset status just make good
            "up": "Good",
            "down": "Good"
        },
        "Good": {
            "up": "Good",
            "down": "Dire"
        },
        "Dire": {
            "up": "Good",
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

function game() {
    update();
    draw();
}

function update() {
    if (ship.speed < 0){
        ship.speed = 0;
    }

    switch(gameState){
        case "main":
            t++;
            if(getAliveMembers().length == 0 || ship.fuel <= 0){
                gameState = "gameover"
                play_audio("alert");
                pause_audio("bgm");
                pause_audio("shop");
                pause_audio("encounter");
                play_audio("gameover", true);
                return;
            }

            ship.distance++;
            if(ship.distance >= (ship.end_distance - 1) && karen_finale){
                currentEvent = karen_requiem();
                selectedChoice = 0;
                doAction = false;
                eventResult = undefined;
                gameState = "event";
                pause_audio("bgm");
                play_audio("alert");
                play_audio("encounter", true);
                karen_finale = false;
                return;
            }
            
            if(ship.distance >= ship.end_distance){
                gameState = "win"
                play_audio("alert");
                pause_audio("bgm");
                pause_audio("shop");
                pause_audio("encounter");
                play_audio("endgame", true);
                return;
            }
        

            if(t % ship.speed == 0){
                ship.current_day++;
                // Should run out of fuel around 176 days
                if(ship.current_day % 3 == 0){
                    ship.fuel -= ship.rate;
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
                        pause_audio("bgm");
                        play_audio("alert");
                        play_audio("encounter", true);
                        return
                    }                
                }
                // Check for shop day
                let progress = ship.distance/ship.end_distance
                if(progress > ship.next_shop * .25){
                    ship.next_shop++;
                    currentShop = new Shop(ship);
                    selectedChoice = 0;
                    doAction = false;
                    doneShopping = false;
                    shopResult = undefined;
                    gameState = "shop";
                    pause_audio("bgm");
                    play_audio("alert");
                    play_audio("shop", true);
                    return
                } else if(progress > ship.next_zone * .5 + .36){
                    if(ship.next_zone == 0){
                        currentEvent = hostiles_event()
                    } else {
                        currentEvent = asteroid_event()
                    }
                    lastEventDay = ship.current_day;
                    ship.next_zone++;
                    selectedChoice = 0;
                    doAction = false;
                    eventResult = undefined;
                    gameState = "event";
                    play_audio("alert");
                    return
                }
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
                    shopResult = fix_engine(ship, currentShop);
                    gameState = "shop_result";
                }
                else if (selectedChoice == 2){
                    shopResult = truck_talk(currentShop);
                    talked = true;
                    gameState = "shop_result";
                }
                else if (selectedChoice == 3){
                    shopResult = leave();
                    doneShopping = true;

                    if (talked){
                        talk_count += 1;
                    }

                    talked = false;

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
    if (gameState == "gameover" || gameState == "win") {
        gameState = "title";
        pause_audio("gameover");
        pause_audio("endgame");
        init();
        return;
    }

    e.preventDefault()
    if(imagesLoaded && gameState == "title") {
        play_audio("select");
        play_audio("bgm", true);
        gameState = "setup";
        return;
    } else if(gameState == "setup" || gameState == "event_result"){
        pause_audio("encounter");
        play_audio("select");
        play_audio("bgm", true);
        gameState = "main";
        return;
    } else if (gameState == "shop_result"){
        play_audio("select");
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
        case 38: // up
            if(gameState == "event"){
                selectedChoice--;
                if(selectedChoice < 0){
                    selectedChoice = get_choices(currentEvent).length-1;
                }
                play_audio("move");
            }
            else if(gameState == "shop"){
                selectedChoice--;
                if(selectedChoice < 0){
                    selectedChoice = shop_choices(currentShop).length-1;
                }
                play_audio("move");
            } else if(gameState == "options"){
                if(selectedChoice == 1){
                    selectedChoice = 0;
                } else {
                    selectedChoice = 1
                }
                play_audio("move");
            }
            break;
        case 40: // down
            if(gameState == "event"){
                selectedChoice++;
                if(selectedChoice >= get_choices(currentEvent).length){
                    selectedChoice = 0;
                }
                play_audio("move");
            }
            else if(gameState == "shop"){
                selectedChoice++;
                if(selectedChoice >= shop_choices(currentShop).length) {
                    selectedChoice = 0;
                }
                play_audio("move");
            } else if(gameState == "options"){
                if(selectedChoice == 1){
                    selectedChoice = 0;
                } else {
                    selectedChoice = 1
                }
                play_audio("move");
            }
            break;
        case 39: // right
            if(gameState == "options"){
                if(selectedChoice == 0){
                    var music_volume = audio[music[0]].volume
                    music_volume = Math.min(1, music_volume + .05).toFixed(2)
                    for(var song of music){
                        audio[song].volume = music_volume
                    }
                } else {
                    var sfx_volume = audio[sfx[0]].volume
                    sfx_volume = Math.min(1, sfx_volume + .05).toFixed(2)
                    for(var song of sfx){
                        audio[song].volume = sfx_volume
                    }
                    play_audio("move");
                }
            }
            break;
        case 37: // left
            if(gameState == "options"){
                if(selectedChoice == 0){
                    var music_volume = audio[music[0]].volume
                    music_volume = Math.max(0, music_volume - .05).toFixed(2)
                    for(var song of music){
                        audio[song].volume = music_volume
                    }
                } else {
                    var sfx_volume = audio[sfx[0]].volume
                    sfx_volume = Math.max(0, sfx_volume - .05).toFixed(2)
                    for(var song of sfx){
                        audio[song].volume = sfx_volume
                    }
                    play_audio("move");
                }
            }
            break;
        case 90: // z
            if(gameState == "event" || gameState == "shop"){
                doAction = true;
                play_audio("select");
            }
            break;
        case 88: // x
            if(gameState == "status"){
                gameState = "main";
                play_audio("select");
            } else if(gameState == "main"){
                gameState = "status";
                play_audio("select");
            }
            break;
        case 32: // space
        case 13: // enter
            if(gameState == "options"){
                gameState = "main";
                play_audio("select");
            } else if(gameState == "main"){
                selectedChoice = 0;
                gameState = "options";
                play_audio("select");
            }
            break;
    }
}
