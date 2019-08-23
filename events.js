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
        new SpaceEvent("Dolik Attack!", "A group of doliks have invaded your ship!",
            [["Surrender",function(ship, party){
                let exterminated = random_choice(party.filter( el => (el.status != "Dead")));
                exterminated.status = "Dead"
                return `The doliks eliminate ${exterminated.name} and move on, finding nothing of interest on your ship.`
            }], 
            ["Try to resist",function(ship, party){
                // Higher chance to win if there are more members in your party
                let alive = party.filter( el => (el.status != "Dead"));
                if(alive.length == 1 || random_chance(0.2)){
                    let talker = random_choice(alive);
                    return `${talker.name} tries to convince the doliks to leave. Somehow it works!`
                } else {
                    let talker = random_choice(alive);
                    var fodder = random_choice(alive);
                    while(fodder.name == talker.name){
                        fodder = random_choice(alive);
                    }
                    talker.status = "Dead";
                    fodder.status = "Dead"
                    return `${talker.name} tries to convince the doliks to leave. It Fails! They loudly synthesize the word "ELIMINATE" as they murder ${talker.name} and ${fodder.name}.`
                }
            }]]),
        new SpaceEvent("Planet Plague", "An encounter with an asteroid causes your ship to take on foreign bacteria. It infects your crew",
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
            }]]),
        new SpaceEvent("Wormhole", "You spot a wormhole in front of you.",
            [["Enter it", function(ship, party){
                var sign = random_int(2);
                let diff = 100 + random_int(100);
                if(sign == 0){
                    ship.distance += diff
                    return `You find your ship transported ${diff} lightyears further along your trip`;
                } else {
                    ship.distance -= diff
                    return `You find your ship transported ${diff} lightyears backwards along your path`;
                }
            }],
            ["Ignore it", function(ship, party){
                return `You pass by the wormhole, never knowing what secrets it might hold.`
            }]]),
        new SpaceEvent("Space Sheriff", "You see flashing lights and a siren coming up behind you in the mirror",
            [["Pull over", function(ship, party){
                if(random_chance(0.25)){
                    return `The officer speeds by you. He must be chasing someone ahead of you.`;
                } else {
                    let credits = Math.min(75, ship.credits);
                    ship.credits -= credits;
                    return `The officer tells you that your tailight is is out and fines you ${credits} credits.`;
                }
            }],
            ["Try to outrun him", function(ship, party){
                if(random_chance(0.25)){
                    return `You take off fast and manage to escape his pursuit.`
                } else {
                    let credits = Math.min(200, ship.credits);
                    ship.credits -= credits;
                    return `The sherrif pulls up to you and says, "Running from an officer is a serious offense. By the way, your tailight is out," as he hands you a fine for ${credits} credits.`
                }                
            }]]),
        new SpaceEvent("Lost Ship", "A ship in the distance looks like it needs help. You approach and they say they ran out of fuel.",
            [["Offer 10%", function(ship, party){
                ship.fuel -= 10;
                return "The ship is gracious that you help"
            }],
            ["You have no extra", function(ship, party){
                let hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                return `The crew on the other ship gets violent. Nothing major, but ${hurt.name} is now ${hurt.status}.`
            }]]),
        new SpaceEvent("Med-Outpost", "You arrive at the medical outpost. For 200 credits, they can heal your entire team.",
            [["Heal up", function(ship, party){
                party.forEach(element => {
                    element.status = getStatus(element.status, 1);
                });
                return "Your team feels a lot better now"
            }],
            ["Pass", function(ship, party){
                return `Your team is doing just fine, you assure them things will be alright.`
            }]]),
        new SpaceEvent("Aurora", "A fantasical light-show happens outside the windows of your ship, almost as if some magical being is present.",
            [["Try to make contact", function(ship, party){
                var i = random_int(100);
                var healed = getAliveMembers().find(el => el.status != "Good" && el.status != "Dead");
                if(i < 25 && healed){
                    healed.status = getStatus(healed.status, 1);
                    return `You don't notice anything outside changing, but ${healed.name} feels a bit better now.`
                } else if(i < 50){
                    ship.fuel = Math.min(100, ship.fuel + 30)
                } else if(i < 75){
                    ship.cargo += 10; 
                } else {
                    ship.credits += 100; 
                }
                return `You don't notice anything outside changing, but something feels different.`
            }]]),   
        new SpaceEvent("Rogue Karen", "A member of your crew is acting awfully suspicious...",
            [["What's going on?", function(ship, party){
                let karen = getAliveMembers().find(el =>el.name == "Karen");
                let kid = random_choice(getAliveMembers());

                if (getAliveMembers().length > 2){
                    while(kid.name == karen.name){
                        kid = random_choice(getAliveMembers());
                    }
                }
                
                if (karen != undefined){
                    karen.status = "Missing";
                    kid.status = "Missing";
                    ship.credits -= Math.floor(ship.credits * .5);
                    return `Oh no! Crewman Karen has stolen half of your hard-earned credits and claims ${kid.name} as a hostage. She hijacks an escape pod and disappears taking both with her. You should have seen it coming.`;
                }

                return `Oh it's just crewman ${kid.name} dancing around and being a goof.`;
            }]]),
        new SpaceEvent("Space Anomaly", "While traveling through a subspace field your scanners pick up a strange signal that cannot be decoded. ",
            [["Investigate it", function(ship, party){
                if (random_chance(.2)){
                    return "While approaching the anomaly, you and your crew suddenly hear a voice speak in your head. 'I thank you mortals for waking me from my long slumber. Behold as I now consume the loop of time. You will be remembered forever...'. The voice fades. You ponder your actions as you continue your journey.";
                }
                if (random_chance(.6)){
                    let warp_bonus = random_int(250);
                    ship.distance += warp_bonus;

                    return `Approaching the anomaly you and your crewmen find themselves losing control of the ship! Suddenly your ship is flung through a mysterious wormhole. Upon regaining control, you find yourself ${warp_bonus} lightyears closer to your destination!`;
                }
                loot = random_int();
                ship.credits += loot;
                return `Narrowing in on the anomaly reveals a cache of resources worth about ${loot} credits!`;
            }],
            ["Ignore it", function(ship, party){
                return "You ponder what secrets the anomaly might've held as you choose to safely direct your ship to continue on your journey.";
            }]]),
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
                        return `Your trip through the asteroid belt was nearly sucessfull except for a minor collision towards the end in which you lost ${lost} tons fo cargo`
                    } else {
                        let lost = Math.floor(ship.cargo * ((random_int(10)+10)/100)); // (11-20% of cargo)
                        ship.cargo -= lost;
                        return `A rogue asteroid slams into the cargo bay doors, you lose ${lost} tons of cargo in the collision.`
                    }
                }],
                ["Look for a new route", function(ship, party){
                    let days = random_int(20)+1;
                    let fuel = Math.floor(days/2);
                    ship.current_day += days
                    ship.fuel -= fuel;
                    return `You took ${days} days to find a safe route, and used some fuel in the process.`
                }],
                ["Hire a navigator", function(ship, party){
                    let charge = Math.min(random_int(75)+50, ship.credits);
                    return `You pay for the local taxi service to escort you across the belt. They do so without difficulty, but charge you ${charge} credits.`
                }]]);
}

function hostiles_event(){
    return new SpaceEvent("Hostile Area", "Your ship is reaches a hostile zone, full of marauders.",
        [["Try to fly through", function(ship, party){
            if(random_chance(0.33)){
                return "Your piloting mastery allowed you to navigate the area with no difficulties."
            } else if(random_chance(0.5)){
                let lost = Math.floor(ship.cargo * ((random_int(10)+2)/100)); // (2-11% of cargo)
                ship.cargo -= lost;
                return `Your trip through the hostile zone was mostly smooth, except for a minor conflict towards the end in which you lost ${lost} tons of cargo`
            } else {
                let lost = Math.floor(ship.cargo * ((random_int(10)+10)/100)); // (11-20% of cargo)
                ship.cargo -= lost;
                return `The marauders manage to hinder your voyage, you lost ${lost} tons of cargo during the trip.`
            }
        }],
        ["Look for a new route", function(ship, party){
            let days = random_int(20)+1;
            let fuel = Math.floor(days/2);
            ship.current_day += days
            ship.fuel -= fuel;
            return `You took ${days} days to find a safe route, and used some fuel in the process.`
        }],
        ["Hire a navigator", function(ship, party){
            let charge = Math.min(random_int(75)+50, ship.credits);

            ship.credits -= charge;
            return `You pay for the local taxi service to escort you across the hostile zone. They do so without difficulty, but charge you ${charge} credits.`

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