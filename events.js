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
                    return `${sick.name} catches the illness and is now feeling ${sick.status}. It spreads to ${fodder.name}, who is now ${fodder.status}`
                } else {
                    return `${sick.name} catches the illness and is now feeling ${sick.status}.`
                }
            }]]),
        new SpaceEvent("Engine Fault", "Your engine breaks down and requires repair.",
            [["Go on without it", function(ship, party){
                ship.speed -= 1
                return "Your speed has been impacted. It will take you longer to arrive."
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
        new SpaceEvent("Space Sheriff", "You hear a siren and see flashing lights coming up behind you in the mirror",
            [["Pull over", function(ship, party){
                if(random_chance(0.25)){
                    return `The officer speeds by you. He must be chasing someone ahead of you.`;
                } else {
                    let credits = Math.min(75, ship.credits);
                    ship.credits -= credits;
                    return `The officer tells you that your taillight is out and fines you ${credits} credits.`;
                }
            }],
            ["Try to outrun him", function(ship, party){
                if(random_chance(0.25)){
                    return `You take off fast and manage to escape his pursuit.`
                } else {
                    let credits = Math.min(200, ship.credits);
                    ship.credits -= credits;
                    return `The sheriff pulls up to you and says, "Running from an officer is a serious offense. By the way, your taillight is out," as he hands you a fine for ${credits} credits.`
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
                return "Your team feels a lot better now."
            }],
            ["Pass", function(ship, party){
                return `Your team is doing just fine. You assure them things will be alright.`
            }]]),
        new SpaceEvent("Aurora", "A fantastical light-show happens outside the windows of your ship, almost as if some magical being is present.",
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
        new SpaceEvent("Space Anomaly", "While traveling through a subspace field your scanners pick up a strange signal that cannot be decoded.",
            [["Investigate it", function(ship, party){
                if (random_chance(.2)){
                    return "While approaching the anomaly, you and your crew suddenly hear a voice speak in your heads. 'I thank you mortals for waking me from my long slumber. I must now consume the loop of time. You will be remembered forever...'. The voice fades. You ponder your actions and continue your journey.";
                }
                if (random_chance(.6)){
                    let warp_bonus = random_int(250);
                    ship.distance += warp_bonus;

                    return `Approaching the anomaly you and your crewmen find yourselves losing control of the ship! Suddenly your ship is flung through a wormhole. Upon regaining control, you find yourself ${warp_bonus} lightyears closer to your destination!`;
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
                return "As quick as it appeared, the ship suddenly cloaks. While relieved that no conflict occurred, a new anonymous message in your ship's inbox containing 'We'll be in touch' leaves you a little shaken.";
            }]]),
        new SpaceEvent("Comet", "A comet flies towards your ship.",
            [["Engage the shields", function(ship, party){
                ship.speed -= 1
                return "The shields get overloaded by the collision and the surge takes one of your engines offline."
            }],
            ["Take it head on", function(ship, party){
                var hit = random_choice(getAliveMembers());
                hit.status = getStatus(hit.status, -1);
                return `The collision shakes up ${hit.name} who is now ${hit.status}.`
            }]]),
        new SpaceEvent("Snakes", "A spectral snake comes through the ship's teleporter and interrupts your activities on the bridge.",
            [["Attack it", function(ship, party){
                ship.speed -= 1
                return "The shields get overloaded by the collision and the surge takes one of your engines offline."
            }],
            ["Ignore it", function(ship, party){
                var scared = random_choice(getAliveMembers());
                scared.status = getStatus(scared.status, -1);
                return `You ignore the snake, but it still scares ${scared.name} who is now ${scared.status}. ${scared.name} hates snakes.`
            }]]),
        new SpaceEvent("Droids", "A group of Class-C enforcement droids request to board.",
            [["Talk to them", function(ship, party){
                ship.cargo -= 3;
                return "The droids search your cargo for contraband. They look around and realize that this is not the ship they are looking for, though some cargo now seems to be missing."
            }],
            ["Deny their request", function(ship, party){
                var scared = random_choice(getAliveMembers());
                scared.status = getStatus(scared.status, -1);
                return `The droids get upset and call ${scared.name} mean names, who is now ${scared.status}.`
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
                return `"What's your problem?" the comedian says and gives ${hurt.name} the punch line. They are now feeling ${hurt.status}.`
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
                return "Each member demands 40 credits as payment right now, which you deliver."
            }],
            ["Fight", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                ship.credits -= Math.min(getAliveMembers().length * 15, ship.credits)
                return `Not all the crew is against you. ${hurt.name} joins your side and becomes ${hurt.status} in the spat. In the end, you settle things by paying each crew member 15 credits.`
            }]]),
        new SpaceEvent("Amatuer mechanic", "An amateur mechanic offers to upgrade your ship, though he warns you that any official repairman will revert his changes if you go through with it.",
            [["Upgrade )200 credits)", function(ship, party){
                if(ship.credits < 200){
                    return "Sorry, you just don't have the cash."
                }
                ship.credits -= 200;
                ship.speed += 5;
                ship.rate = 2.2
                return "That baby should be traveling much faster now. You'll make it to wherever you are going months ahead of time."
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
        new SpaceEvent("Event Horizon", "During your travels your navigation module attempts to navigate your ship into the center of a black hole, claiming it as a shortcut.",
            [["Worth a shot!", function(ship, party){
                if (random_chance(.6)){
                    ship.speed -= 4;
                    ship.rate = 2.1;
                    cargo_loss = random_int(3) + 1;

                    if (ship.cargo > cargo_loss){
                        ship.cargo -= cargo_loss;
                        return `This is a disaster! Losing control, your ship bounces around the event horizon before successfully warping away. The engine is now severly damaged, fuel is leaking, and ${cargo_loss} cargo was lost.`;
                    }
                    
                    ship.cargo = 0;
                    return "This is a disaster! Losing control, your ship bounces around the event horizon before successfully warping away. The engine is now severly damaged, fuel is leaking, and all cargo was lost.";
                }

                let distance_bonus = random_int(300) + 100;
                ship.distance += distance_bonus;
                return `Somehow you successfully navigate through the event horizon! You find yourself ${distance_bonus} lightyears closer to your destination!`;
            }],
            ["Too risky.", function(ship, party){
                return "You (smartly) choose not to risk your ship and find an alternative route.";
            }]]),
        new SpaceEvent("Asteroid Shower", "An astroid shower rains down on your ship, causing severe damage!",
            [["This is troubling...", function(ship, party){
                ship.speed -= 1;
                ship.rate = 1.9;
                ship.cargo -= 1;

                return "Damage report indicates the ship is moving slower, fuel is leaking, and 1 crate of cargo was damaged.";
            }]]),
        new SpaceEvent("Make a Wish!", "You see a shooting star! Time to make a wish... I wish for...",
            [["Fuel!", function(ship, party){
                ship.fuel = 100;
                return "It seems that star was perfect for scouping fuel! Your fuel reserves are full!";
            }],
            ["Credits!", function(ship, party){
                if (random_chance(.3)){
                    ship.credits += 100;
                    return "Your pocket seems oddly heavy. Reaching in you find a cool extra 100 credits! Score!"
                }

                let delay = random(int) + 5;
                ship.days += delay;
                return `The shooting star curses you for your greed. Systems on your ship have randomly shut down, delaying your progress by ${delay} days.`;
            }],
            ["A quick journey!", function(ship, party){
                let bonus_distance = random_int(100) + 10;
                ship.distance += bonus_distance;
                return `Interestingly, following your wish a lot of time seems to have passed in a moment and you are ${bonus_distance} lightyears closer to the colony!`;
            }],
            ["Repairs.", function(ship, party){
                party.forEach(element => {
                    element.status = getStatus(element.status, 1);
                });

                ship.speed = 10;
                ship.rate = 1.7;
                return "Interestingly, following your wish your ship appears to be working as normal, and your crew is feeling a lot better!";
            }]]),
        new SpaceEvent("Space Whale", "A majestic space whale graces you with its presence while flying next to your ship!",
            [["Fascinating", function(ship, party){
                ship.days -= 1;
                return "Struck in awe by the whale, you don't notice your ship slowing down, resulting in a 1 day delay...";
            }]]),
        new SpaceEvent("Deceased Anomaly", "While crossing the sector your scanners come across a gigantic tentacled beast. It appears to be dead...",
            [["Investigate", function(ship, party){
                if (random_chance(.1)){
                    if (random_chance(.1)){
                        party.forEach(element => {
                            element.status = "Dead";
                        });

                        return "Oh no, you walked into its trap. The creature quickly reaches out to consume your ship, snatches it, and swallows. A dark abyss awaits you...";
                    }

                    ship.fuel -= 5;
                    return "Oh no, you walked into its trap. The creature quickly reaches out to consume your ship, but you manage to engage warp just in time. This has cost you significant fuel loss.";
                }

                let bonus_credits = random_int(100) + 25;
                let bonus_cargo = random_int(1) + 1;
                ship.credits += bonus_credits; 
                return `The creature appears to be dead, though there are a lot of destroyed ships around it. You scavange what you can and find ${bonus_credits} and ${bonus_cargo} cargo!`;
            }],
            ["Leave it alone.", function(ship, party){
                return "You leave the strange beast alone and continue your travels. You notice on your scanners the creature appears to have disappeared...";
            }]]),
        new SpaceEvent("Investment Opportunity", "At a rest stop, you and your crew are pulled to the side of the building by a shady man who speaks of the deal of a lifetime for only 100 credits!",
            [["Go on...", function(ship, party){
                if (ship.credits >= 100){
                    ship.credits -= 100;

                    if (random_chance(.5)){
                        let bonus_credits = random_int(100) + 50
                        ship.credits += bonus_credits + 100;
                        return `This deal is too good to pass up. You invest 100 credits and are told to give it some time. A few days later a message arrives revealing you are ${bonus_credits} credits richer.`;
                    }

                    return "This deal is too good to pass up. You invest 100 credits and are told to give it some time. You never hear back.";
                }

                ship.credits += 25;
                return "Realizing you are short on credits, the man takes pity on you for listening in on his presentation and gives you 25 credits";
            }],
            ["Not interested", function(ship, party){
                let injured = random_choice(alive);
                injured.status = getStatus(injured.status, -1);
                return `The man doesn't take this well and motions to his muscle to convince you. A brawl ensues leaving ${injured.name} feeling ${injured.status}, but your credits safe!`;
            }]]),
        new SpaceEvent("Distress Beacon", "Your scanner picks up a distress beacon on a nearby planet. You investigate and find a colony that is experiencing famine, and seeking cargo.",
            [["Maybe we can spare 1...", function(ship, party){
                ship.cargo -= 1;
                return "You give the colony 1 cargo to get by, and hope they can recover.";
            }],
            ["Others need our help more...", function(ship, party){
                let alive_party = getAliveMembers();

                if (alive_party.length >= 3){
                    let p1 = alive_party[0];
                    let p2 = alive_party[1];
                    let p3 = alive_party[2];
                    p1.status = getStatus(p1.status, -1);
                    p2.status = getStatus(p2.status, -1);
                    p3.status = getStatus(p3.status, -1);

                    return `The colonists despair and attack the grounded crewmen! ${p1.name}, ${p2.name}, and ${p3.name} are hurt while returning to the ship.`;
                }
                else if (alive_party.length >= 2){
                    let p1 = alive_party[0];
                    let p2 = alive_party[1];
                    p1.status = getStatus(p1.status, -1);
                    p2.status = getStatus(p2.status, -1);

                    return `The colonists despair and attack the grounded crewmen! ${p1.name}, and ${p2.name} are hurt while returning to the ship.`;
                }
                else {
                    return "The colonists desperately attempt to board your landed ship and seize control. Upon gaining entry, they find you are the only crew member. You stand no chance against their strength. One colony is saved, yet another colony is lost...";
                }
            }]]),
        new SpaceEvent("Red Alert", "The 'RED ALERT' alarm suddenly blares off! Your crewmen quickly approach the helm to investigate.",
            [["Computer, status report.", function(ship, party){
                if (random_chance(.25)){
                    let victim = random_choice(getAliveMembers());
                    victim.status = getStatus(victim.status, -1);

                    return `A small breach in the hull reveals a leak! Your crewmen manage to repair the leak before losing too much oxygen although ${victim.name} is suddenly not feeling so great.`;
                }

                if (random_chance(.25)){
                    ship.cargo -= 1;
                    return "It seems someone forgot to close the liftgate at the last stop... You manage to reclose it, but lose 1 cargo during the effort.";
                }

                return "It seems someone forgot to close the liftgate at the last stop... You manage to successfully reclose it without losing any cargo";
            }]]),
        new SpaceEvent("Space Cat", "While stopped for a break, you see the oddest sight. A cat, in a space suit, is floating around on a crate.",
            [["What...?", function(ship, party){
                ship.cargo += 1;

                if (party.length < 7){
                    party.push({
                        name: "Space Cat",
                        status: getStatus(""),
                    });

                    return "You decide to recruit the cat and gain a new crew member! You also scored an additional cargo!";
                }
                
                return "You take the crate and get 1 cargo. As you reach for the cat it waves goodbye, and flys off.";
            }]]),
        new SpaceEvent("It came from the Moon!", "A video message appears on your ships console. What appears to be a man dressed as a wizard asks you to consider stopping at his moon workshop.",
            [["Well, alright.", function(ship, party){
                let lost_days = random_int(50) + 1;
                ship.days += lost_days;
                return `Arriving at the location, you quickly determine this 'workshop' to be some sort of tourist trap. While leaving, a crowd of businessmen attempt to sell you timeshares for condos. Shrugging them off, you leave. However, due to time dialation on the planet you lost ${lost_days} days`;
            }],
            ["There's no time!", function(ship, party){
                return "You decide to stop another time.";
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
                        return `Your trip through the asteroid belt was nearly successful except for a minor collision towards the end in which you lost ${lost} tons of cargo`
                    } else {
                        let lost = Math.floor(ship.cargo * ((random_int(10)+10)/100)); // (11-20% of cargo)
                        ship.cargo -= lost;
                        return `A rogue asteroid slams into the cargo bay doors. You lose ${lost} tons of cargo in the collision.`
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
    return new SpaceEvent("Hostile Area", "Your ship reaches a hostile zone, full of marauders.",
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
                return `The marauders manage to hinder your voyage. You lost ${lost} tons of cargo during the trip.`
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
                        return `Oh no! Crewman Karen has stolen half of your hard-earned credits and claims ${kid.name} as a hostage. She hijacks an escape pod and disappears, taking both with her. You should have seen it coming.`;
                    }

                    return `Oh, it's just crewman ${kid.name} dancing around and being a goof.`;
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
    var event1 = new SpaceEvent("Testing in progress...", "The captain would like to know if this test was successful...", [["Yes",function(ship, party){return "Hooray!"}], ["No",function(ship, party){return "Welp..."}]]);
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