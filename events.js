var events = [];
var event_cooldown = [];

/**
 * Creates all established events and stores them in the events array
 */
function generate_events(){
    events = [];
    event_cooldown = [];
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
        new SpaceEvent("Planet Plague", "An encounter with an asteroid causes your ship to take on foreign bacteria which infects your crew",
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
                    return `The officer tells you that your taillight is is out and fines you ${credits} credits.`;
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
            [["Offer 10 fuel", function(ship, party){
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
        new SpaceEvent("Space Anomaly", "While traveling through a subspace field your scanners pick up a strange signal that cannot be decoded. ",
            [["Investigate it", function(ship, party){
                if (random_chance(.2)){
                    return "While approaching the anomaly, you and your crew suddenly hear a voice speak in your head. 'I thank you mortals for waking me from my long slumber. I must now consume the loop of time. You will be remembered forever...'. The voice fades. You ponder your actions and continue your journey.";
                }
                if (random_chance(.6)){
                    let warp_bonus = random_int(250);
                    ship.distance += warp_bonus;

                    return `Approaching the anomaly you and your crewmen find themselves losing control of the ship! Suddenly your ship is flung through a wormhole. Upon regaining control, you find yourself ${warp_bonus} lightyears closer to your destination!`;
                }
                loot = random_int(200);
                ship.credits += loot;
                return `Narrowing in on the anomaly reveals a cache of resources worth about ${loot} credits!`;
            }],
            ["Ignore it", function(ship, party){
                return "You ponder what secrets the anomaly might've held as you choose to safely direct your ship to continue on your journey.";
            }]]),
        new SpaceEvent("Black Market", "While parked, a cloaked ship suddenly reveals itself to you. They seem to want your cargo, and are willing to pay handsomely for it.",
            [["Sell 5 Cargo", function(ship, party){
                if (ship.cargo >= 5){
                    ship.cargo -= 5;
                    ship.credits += 625;
                    return "As quick as it appeared, the ship suddenly cloaks. The exchange went without issue. 5 cargo for an easy 625 credit bonus. You just hope what you have left will be enough for the colony...";
                }
                else if (ship.cargo <= 0){
                    return "Unfortunately, you don't have any cargo left to sell. Picking up on this the opposing ship quickly cloaks away...";
                }
                else {
                    remaining_cargo = ship.cargo;
                    bonus_credits = remaining_cargo * 125;
                    ship.cargo -= remaining_cargo;
                    ship.credits += bonus_credits;
                    return `While you didn't have quite enough cargo, the visitors were still more than happy to make a trade. In exchange for the rest of your cargo you recieved ${bonus_credits} credits!`;
                }
            }],
            ["Sell 1 Cargo", function(ship, party){
                if (ship.cargo >= 1){
                    ship.cargo -= 1;
                    ship.credits += 125;
                    return "As quick as it appeared, the ship suddenly cloaks. The exchange went without issue. 1 cargo for an easy 125 credit bonus.";
                }
                else {
                    return "Unfortunately, you don't have any cargo left to sell. Picking up on this the opposing ship quickly cloaks away...";
                }
            }],
            ["Thanks, but no thanks.", function(ship, party){
                return "As quick as it appeared, the ship suddenly cloaks. While relieved that no conflict occured, a new anonymous message in your ship's inbox containing 'We'll be in touch' leaves you a little shaken.";
            }]]),
        new SpaceEvent("Comet", "A comet flies towards your ship.",
            [["Engage the shields", function(ship, party){
                ship.speed -= 1
                return "The sheilds get overloaded by the collision and the surge takes one of your engines offline."
            }],
            ["Take it head on", function(ship, party){
                var hit = random_choice(getAliveMembers());
                hit.status = getStatus(hit.status, -1);
                return `The collision shakes up ${hit.name} who now is ${hit.status}.`
            }]]),
        new SpaceEvent("Snakes", "A spectral snake comes through the ships teleporter and interrupts your activities on the bridge.",
            [["Attack it", function(ship, party){
                ship.speed -= 1
                return "The sheilds get overloaded by the collision and the surge takes one of your engines offline."
            }],
            ["Ignore it", function(ship, party){
                var scared = random_choice(getAliveMembers());
                scared.status = getStatus(scared.status, -1);
                return `You ignore the snake, but it still scares ${scared.name} who now is ${scared.status}. ${scared.name} hates snakes.`
            }]]),
        new SpaceEvent("Droids", "A group of Class-C encforment droids request to be boarded.",
            [["Talk to them", function(ship, party){
                ship.cargo -= 3;
                return "The droids search your cargo for contraband. They look around and realize this is not the ship they are looking for, though some cargo now seems to be missing."
            }],
            ["Deny their request", function(ship, party){
                var scared = random_choice(getAliveMembers());
                scared.status = getStatus(scared.status, -1);
                return `The droids get upset, and call ${scared.name} mean names, who now is ${scared.status}.`
            }]]),
        new SpaceEvent("Wandering comic", "A wandering comedian enters into your path and you let her on the ship.",
            [["Talk to her", function(ship, party){
                var jokes = ["What's the deal with astronaut food? It's coarse and rough and irritating. That one is more of an observation.",
                 "You ever worry about aliens? Not me, I'm safe, I'd never get eaten. You know why? Cause I'd taste funny! Hah!",
                 "I don't have any material, sorry"]
                return random_choice(jokes);
            }],
            ["Ignore her", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                return `"What's your problem?" the comedian says and gives ${hurt.name} the punch line, they are now feeling ${hurt.status}.`
            }]]),
        new SpaceEvent("Bounty Hunter", "A bounty hunter hails your ship and informs you that you are harboring a fugitive. He requests that you either give them up, or he will come on board.",
            [["Comply with his orders", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = "Missing";
                ship.credits += 150;
                return `You deliver ${hurt.name} to the hunter and they fly off into space, never to be seen again. You earn a few credits for not giving him a hard time`
            }],
            ["Refuse", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                let cargo = Math.min(random_int(5), ship.cargo);
                return `The bounty hunter board your ship and you start to brawl. ${hurt.name} becomes ${hurt.status} in the process. The tumble also takes out ${cargo} cargo.`
            }]]),
        new SpaceEvent("Mutiny", "Your crew demands higher wages, or else there will be a fight.",
            [["Pay them", function(ship, party){
                ship.credits -= Math.min(getAliveMembers().length * 40, ship.credits)
                return "Each member demands 40 credits payment right now, which you deliver."
            }],
            ["Fight", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                ship.credits -= Math.min(getAliveMembers().length * 15, ship.credits)
                return `Not all the crew is against you. ${hurt.name} joins your side and becomes ${hurt.name} in the spat. In the end, you settle things by paying each crew member 15 credits.`
            }]]),
        new SpaceEvent("Amatuer mechanic", "An amateur mechanic offers to upgrade you ship, though he warns you that any official repairman will revert his changes if you go through with it.",
            [["Upgrade )300 credits)", function(ship, party){
                if(ship.credits < 300){
                    return "Sorry, you just don't have the cash."
                }
                ship.credits -= 300;
                ship.speed += 5;
                return "That baby should be traveling much faster now. You'll make it to where ever you are going months ahead of time."
            }],
            ["Leave", function(ship, party){
                return `Alright, your loss.`
            }]]),
        new SpaceEvent("Dysentery", "Someone in your party contracts dysentery.",
            [["Uh oh", function(ship, party){
                let hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                return `${hurt.name} is now ${hurt.status} from dysentery.`
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
 * Returns 'Rogue Karen' event if Karen is in the party
 */
function return_karen(){
    return new SpaceEvent("Rogue Karen", "A member of your crew is acting awfully suspicious...",
                [["What's going on?", function(ship, party){
                    let karen = getAliveMembers().find(el =>el.name == "Karen");
                    let kid = random_choice(getAliveMembers());

                    if (getAliveMembers().length > 2){
                        while(kid.name == "Karen"){
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
                }]]);
}

/**
 * Returns a random event from the events array
 * Removes the chosen event from the events array and puts it in the event_cooldown array
 * Once the length of the events array is less than or equal to the length of the cooldown array
 * the events array is refilled with the elements within the event_cooldown array.
 * The event_cooldown array is then reset
 */
function get_event(){
    if (events.length <= 0){
        events = events.concat(event_cooldown);
        event_cooldown = [];
    }
    else if (events.length <= event_cooldown.length){
        events = events.concat(event_cooldown);
        event_cooldown = [];
    }

    let event = random_choice(events);
    let event_index = events.indexOf(event);
    event_cooldown.push(event);

    if (event_index != -1){
        events.splice(event_index, 1);
    }

    return event;
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