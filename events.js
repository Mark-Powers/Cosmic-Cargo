var events = [];
//test_events();

/**
 * Creates all established events and stores them in the events array
 */
function generate_events(){
    events = [
        new SpaceEvent("Pirates!", "Pirates have boarded your ship demanding payment! Fight?", 
            [["Pay",function(ship, party){
                let loot = Math.floor(ship.credits *.2);
                ship.credits -= loot;
                return `The pirates take ${loot} credits, and your party remains unscathed.`
            }], 
            ["Fight",function(ship, party){
                // Higher chance to win if there are more members in your party
                let alive = party.filter( el => (el.status != "Dead"));
                if(random_chance(1-(1/alive.length))){
                    return "You fight the pirates off successfully!"
                } else {
                    let loot = Math.floor(ship.credits *.2);
                    ship.credits -= loot;
                    let injured = random_choice(alive);
                    injured.status = getStatus(injured.status, -1);
                    return `The pirates overtake you. They steal ${loot} credits, and ${injured.name} is now ${injured.status}.`
                }
            }]]),
        new SpaceEvent("Dalek Attack!", "A group of daleks have invaded your ship!",
            [["Surrender",function(ship, party){
                let exterminated = random_choice(party.filter( el => (el.status != "Dead")));
                exterminated.status = "Dead"
                return `The daleks exterminate ${exterminated.name} and move on, finding nothing of interest on your ship.`
            }], 
            ["Try to resist",function(ship, party){
                // Higher chance to win if there are more members in your party
                let alive = party.filter( el => (el.status != "Dead"));
                if(alive.length == 1 || random_chance(0.2)){
                    let talker = random_choice(alive);
                    return `${talker.name} tries to convince the daleks to leave. Some how against all odds, it works!`
                } else {
                    let talker = random_choice(alive);
                    var fodder = random_choice(alive);
                    while(fodder.name == talker.name){
                        fodder = random_choice(alive);
                    }
                    talker.status = "Dead";
                    fodder.status = "Dead"
                    return `${talker.name} tries to convince the daleks to leave. They shout 'EXTERMINATE' and murder ${talker.name} and ${fodder.name}.`
                }
            }]]),
        new SpaceEvent("Space Plague", "During your travels through a nebula, your ship took on foreign bacteria, infecting your crew",
            [["OK", function(ship, party){
                let alive = party.filter( el => (el.status != "Dead"));
                let sick = random_choice(alive);
                sick.status = getStatus(sick.status, -1);
                if(alive.length >= 2 && random_chance(0.4)){
                    var fodder = random_choice(alive);
                    while(fodder.name == sick.name){
                        fodder = random_choice(alive);
                    }
                    fodder.status = getStatus(sick.status, -1);
                    return `${sick.name} catches the illness and is now feeling ${sick.status}. It spreads to ${fodder.name}, who now is ${fodder.status}`
                } else {
                    return `${sick.name} catches the illness and is now feeling ${sick.status}.`
                }
            }]]),
        new SpaceEvent("Engine Fault", "Your engine breaks down and requires repair.",
            [["Go on without it", function(ship, party){
                ship.speed -= 1
                return "Your speed has been impacted, it will take you longer to arrive."
            }],
            ["Try to repair it", function(ship, party){
                var days = random_int(25)+1;
                ship.current_day += days;
                return `It took ${days} days but you manage to get the engine back in working order.`
            }]])
    ];
}

/**
 * Preset event to call during specific days of travel
 */
function asteroid_event(){
    return new SpaceEvent("Astroid Belt", "Your ship is approaching an asteroid belt that is difficult to navigate.",
                [["Try to fly through", function(ship, party){
                    if(random_chance(0.33)){
                        return "Your mastery at piloting your ship allowed you to navigate the field with no difficulties."
                    } else if(random_chance(0.5)){
                        let lost = Math.floor(ship.cargo * ((random_int(10)+2)/100)); // (2-11% of cargo)
                        ship.cargo -= lost;
                        return `Your trip through the asteroid belt went mostly smooth, except for a minor collision towards the end in which you lost ${lost} tons fo cargo`
                    } else {
                        let lost = Math.floor(ship.cargo * ((random_int(10)+10)/100)); // (11-20% of cargo)
                        ship.cargo -= lost;
                        return `The asteroid belt hits you hard, you lost ${lost} tons of cargo during the trip.`
                    }
                }],
                ["Look for a new route", function(ship, party){
                    let days = random_int(20)+1;
                    let fuel = Math.floor(days/2);
                    ship.current_day += days
                    ship.fuel -= fuel;
                    return `You took ${days} days to find a safe route, and used some fuel in the process.`
                }],
                ["Ask for an escort", function(ship, party){
                    let charge = Math.min(random_int(75)+50, ship.credits);
                    return `You pay for the local taxi service to escort you across the belt. They do with no difficulties,  but charge you ${charge} credits.`
                }]]);
}

function hostiles_event(){
    return new SpaceEvent("Hostile Area", "Your ship is reaches a hostile zone, full of marauders.",
        [["Try to fly through", function(ship, party){
            if(random_chance(0.33)){
                return "Your mastery at piloting your ship allowed you to navigate the area with no difficulties."
            } else if(random_chance(0.5)){
                let lost = Math.floor(ship.cargo * ((random_int(10)+2)/100)); // (2-11% of cargo)
                ship.cargo -= lost;
                return `Your trip through the hostile zone went mostly smooth, except for a minor conflict towards the end in which you lost ${lost} tons fo cargo`
            } else {
                let lost = Math.floor(ship.cargo * ((random_int(10)+10)/100)); // (11-20% of cargo)
                ship.cargo -= lost;
                return `The marauders hit you hard, you lost ${lost} tons of cargo during the trip.`
            }
        }],
        ["Look for a new route", function(ship, party){
            let days = random_int(20)+1;
            let fuel = Math.floor(days/2);
            ship.current_day += days
            ship.fuel -= fuel;
            return `You took ${days} days to find a safe route, and used some fuel in the process.`
        }],
        ["Ask for an escort", function(ship, party){
            let charge = Math.min(random_int(75)+50, ship.credits);
            return `You pay for the local taxi service to escort you across the hostile zone. They do with no difficulties, but charge you ${charge} credits.`
        }]]);
}

/**
 * Returns a random event from the events array
 */
function get_event(){
    return random_choice(events);
}

/**
 * Represents an available psudo random event the player may experience
 * @constructor
 * @param {string} name - the name of the event as shown to the player
 * @param {string} desc - a description of the event shown to the player
 * @param {array} choices - an array of tuple choices with index 0 holding the choice name and index 1 a callback function that
 * is passed the ship and party stats, which returns a description of the consequences
 */
function SpaceEvent(name, desc, choices){
    this.name = name;
    this.desc = desc;
    this.choices = choices;
}

/**
 * Returns a string array of all available strings for this event
 * @param {Event} event - an Event object
 */
function get_choices(event){
    var c = []
    for (i = 0; i < event.choices.length; i++){
        c.push(event.choices[i][0]);
    }
    return c;
}

/**
 * Handles event logic dependent on the players choice after an event occurs.
 * Essentially calls the event callback function with the ship and party stats.
 * Returns a string dictating what occurred as a result of the choice.
 * @param {*} event 
 * @param {*} ship 
 * @param {*} party 
 */
function handle_event(event, choice_num, ship, party){
    var result = event.choices[choice_num][1](ship, party);
    return result;
}

function test_events(){
    // All tests currently pass... will quickly develop validator tomorrow...

    // Created a test event with choices
    var event1 = new SpaceEvent("Testing in progress...", "The captain would like to know if this test was successfull...", [["Yes",function(ship, party){return "Hooray!"}], ["No",function(ship, party){return "Welp..."}]]);
    events.push(event1);
    // Should return the event1 object literal
    console.log("Testing draw event method...")
    console.log(get_event());
    // Should return ["Yes", "No"]
    console.log("Testing get_choices method...");
    console.log(get_choices(event1));
    // Should return "Horray!" and then "Welp"
    console.log("Testing handle event method...")
    var e = get_event();
    console.log(handle_event(e, 0));
    console.log(handle_event(e, 1));
}