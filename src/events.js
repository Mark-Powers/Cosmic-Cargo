var events = [];
var event_cooldown = [];
var karen_finale = false;

/**
 * Creates all established events and stores them in the events array
 */
function generate_events(){
    events = [];
    event_cooldown = [];
    karen_finale = false;
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
                    fodder.status = getStatus(fodder.status, -1);
                    return `${sick.name} catches the illness and is now feeling ${sick.status}. It spreads to ${fodder.name}, who is now ${fodder.status}`
                } else {
                    return `${sick.name} catches the illness and is now feeling ${sick.status}.`
                }
            }]]),
        new SpaceEvent("Engine Fault", "Your engine breaks down and requires repair.",
            [["Go on without it", function(ship, party){
                ship.speed -= 1;
                let injured = random_choice(getAliveMembers());
                injured.status = getStatus(injured.status, -1);
                return `The engine blow out hurt ${injured.name} and your speed has been impacted. It will take you longer to arrive.`
            }],
            ["Try to repair it", function(ship, party){
                var days = random_int(25)+1;
                ship.current_day += days;
                let injured = random_choice(getAliveMembers());
                injured.status = getStatus(injured.status, -1);
                return `The engine blow out hurt ${injured.name}. It took ${days} days but you manage to get the engine back in working order.`
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
                if(random_chance(0.1)){
                    return `You take off fast and manage to escape his pursuit.`
                } else {
                    let injured = random_choice(getAliveMembers());
                    injured.status = getStatus(injured.status, -1);
                    let credits = Math.min(200, ship.credits);
                    ship.credits -= credits;
                    return `The sheriff catches up to you and says, "Running from an officer is a serious offense. By the way, your taillight is out," as he hands you a fine for ${credits} credits.`
                }                
            }]]),
        new SpaceEvent("Lost Ship", "A ship in the distance looks like it needs help. You approach and they say they ran out of fuel.",
            [["Offer 10 fuel", function(ship, party){
                ship.fuel -= 10;
                return "The ship is gracious for your help"
            }],
            ["You have no extra", function(ship, party){
                let hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                return `The crew on the other ship gets violent. They attack and ${hurt.name} is now ${hurt.status}.`
            }]]),
        new SpaceEvent("Med-Outpost", "You arrive at the medical outpost. For 200 credits, they can heal your entire team.",
            [["Heal up", function(ship, party){
                getAliveMembers().forEach(element => {
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
        new SpaceEvent("Space Anomaly", "While traveling through a subspace field, your scanners pick up a strange signal that cannot be decoded.",
            [["Investigate it", function(ship, party){
                if (random_chance(.2)){
                    return "While approaching the anomaly, you and your crew hears a voice speak in your heads. 'I thank you mortals for waking me from my long slumber. I must now consume the loop of time. You will be remembered forever...'. The voice fades. You ponder your actions and continue your journey.";
                }
                if (random_chance(.6)){
                    let warp_bonus = random_int(250);
                    ship.distance += warp_bonus;

                    return `Approaching the anomaly you and your crewmen find yourselves losing control of the ship! The craft is flung through a wormhole. Upon regaining control, you find yourself ${warp_bonus} lightyears closer to your destination!`;
                }
                loot = random_int(200);
                ship.credits += loot;
                return `Narrowing in on the anomaly reveals a cache of resources worth about ${loot} credits!`;
            }],
            ["Ignore it", function(ship, party){
                return "You ponder what secrets the anomaly might've held as you choose to safely direct your ship to continue on your journey.";
            }]]),
        new SpaceEvent("Black Market", "While parked, a cloaked ship reveals itself to you. They seem to want your cargo, and are willing to pay handsomely for it.",
            [["Sell 5 Cargo", function(ship, party){
                if (ship.cargo >= 5){
                    ship.cargo -= 5;
                    ship.credits += 625;
                    return "As quick as it appeared, the ship cloaks and fades away. The exchange went without issue. 5 cargo for an easy 625 credit bonus. You just hope what you have left will be enough for the colony...";
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
                    return "As quickly as it appeared, the ship disappears. The exchange went without issue. 1 cargo for an easy 125 credit bonus.";
                }
                else {
                    return "Unfortunately, you don't have any cargo left to sell. Picking up on this the opposing ship quickly cloaks away...";
                }
            }],
            ["No thanks.", function(ship, party){
                return "As quickly as it appeared, the mysterious vessel disappears back into the abyss of space. Your ship's communications hub pings and a message appears: 'We'll be in touch...' .";
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
        new SpaceEvent("Snake", "A spectral snake comes through the ship's teleporter and interrupts your activities on the bridge.",
            [["Attack it", function(ship, party){
                if(getAliveMembers().some((el) => el.name == "Space Cat")){
                    return `Before you are able to land a blow on the snake, Space Cat calls out to the Snake 'Jimmy! I haven't seen you since college!' The two go into the galley and catch up over some drinks.`
                }
                return "With a swift kick to the snake's head, it collapses and dies a little too easily and standing over its corpse, you begin to realize that you are the true monster."
            }],
            ["Ignore it", function(ship, party){
                if(getAliveMembers().some((el) => el.name == "Space Cat")){
                    return `Space Cat calls out to the Snake 'Jimmy! I haven't seen you since college!' The two go into the galley and catch up over some drinks.`
                }
                var scared = random_choice(getAliveMembers());
                scared.status = getStatus(scared.status, -1);
                return `You ignore the snake, but it still scares ${scared.name} who is now ${scared.status}. ${scared.name} hates snakes.`
            }]]),
        new SpaceEvent("Droids", "A group of Class-C enforcement droids request to board.",
            [["Let them", function(ship, party){
                ship.cargo -= 3;
                return "The droids search your cargo for contraband. They look around and realize that this is not the ship they are looking for, though some cargo now seems to be missing."
            }],
            ["Deny their request", function(ship, party){
                var scared = random_choice(getAliveMembers());
                scared.status = getStatus(scared.status, -1);
                return `The droids get upset and call ${scared.name} mean names, who is now ${scared.status}.`
            }]]),
        new SpaceEvent("Comedian", "A wandering comedian enters into your path and you let her on the ship.",
            [["Talk to her", function(ship, party){
                var jokes = ["What's the deal with astronaut food? It's coarse and rough and irritating. That one is more of an observation.",
                 "You ever worry about aliens? Not me, I'm safe, I'd never get eaten. You know why? Cause I'd taste funny! Hah!",
                 "Where do astronauts leave their spaceships? At parking meteors",
                 "What did the astronaut see on his skillet? Unidentified FRYing objects. ",
                ]
                return random_choice(jokes);
            }],
            ["Ignore her", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                return `"What's your problem?" the comedian says and gives ${hurt.name} the punch line. They are now ${hurt.status}.`
            }]]),
        new SpaceEvent("Bounty Hunter", "A bounty hunter hails your ship and informs you that you are harboring a fugitive. He requests that you either give them up, or he will come on board.",
            [["Comply", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = "Missing";
                ship.credits += 150;
                return `You deliver ${hurt.name} to the hunter and they fly off into space, never to be seen again. You earn a few credits for not giving him a hard time`
            }],
            ["Refuse", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                let cargo = Math.min(random_int(5), ship.cargo) + 2;
                return `The bounty hunter boards your ship and picks a fight. ${hurt.name} becomes ${hurt.status} in the process. The rumble also takes out ${cargo} cargo.`
            }]]),
        new SpaceEvent("Mutiny", "Your crew demands higher wages, or else there will be a fight.",
            [["Pay them", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                var fodder = random_choice(getAliveMembers());
                while(fodder.name == hurt.name){
                    fodder = random_choice(getAliveMembers());
                }
                fodder.status = getStatus(fodder.status, -1);
                ship.credits -= Math.min(getAliveMembers().length * 40, ship.credits)
                return `${hurt.name} and ${fodder.name} get hurt in the commotion, but you settle it. Each member demands 40 credits, which you deliver.`
            }],
            ["Fight", function(ship, party){
                var hurt = random_choice(getAliveMembers());
                hurt.status = getStatus(hurt.status, -1);
                ship.credits -= Math.min(getAliveMembers().length * 15, ship.credits)
                return `Not all the crew is against you. ${hurt.name} joins your side and is injured in the spat. Their status is now ${hurt.status}. In the end, you settle things by paying each remaining crew member 15 credits.`
            }]]),
        new SpaceEvent("Mechanic", "An amateur mechanic offers to upgrade your ship, though he warns you that any official repairman will revert his changes if you go through with it.",
            [["Upgrade )200 credits)", function(ship, party){
                if(ship.credits < 200){
                    return "Sorry, you just don't have the cash."
                }
                ship.credits -= 200;
                ship.speed += 5;
                ship.rate = 3.0
                return "That baby should be traveling much faster now. You'll make it to wherever you are going months ahead of time."
            }],
            ["Leave", function(ship, party){
                return `Alright, your loss.`
            }]]),
        new SpaceEvent("Dysentery", "Someone in your party contracts dysentery.",
            [["Uh oh", function(ship, party){
                let hurt = random_choice(getAliveMembers());
                hurt.status = "Dead";
                return `${hurt.name} has died of dysentery.`
            }]]),
        new SpaceEvent("Event Horizon", "During your travels your navigation module attempts to guide your ship into the center of a black hole, claiming it as a shortcut.",
            [["Worth a shot!", function(ship, party){
                if (random_chance(.6)){
                    ship.speed -= 4;
                    ship.rate = 2.7;
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
                return "You choose not to risk your ship and find an alternative route.";
            }]]),
        new SpaceEvent("Asteroids", "An astroid shower rains down on your ship, causing severe damage!",
            [["This is troubling...", function(ship, party){
                ship.speed -= 1;
                ship.rate = 2.7;
                ship.cargo -= 1;
                let injured = random_choice(getAliveMembers());
                injured.status = getStatus(injured.status, -1);
                return `Damage report indicates the ship is moving slower, fuel is leaking, some cargo was damaged, and ${injured.name} got hurt too.`;
            }]]),
        new SpaceEvent("Make a Wish!", "You see a shooting star! Time to make a wish... I wish for...",
            [["Fuel!", function(ship, party){
                ship.fuel = Math.min(ship.fuel + 25, 100);
                return "It seems that star was perfect for fuel scooping! Your fuel reserves are full!";
            }],
            ["Credits!", function(ship, party){
                if (random_chance(.3)){
                    ship.credits += 100;
                    return "Your pocket seems oddly heavy. Reaching in you find a cool extra 100 credits! Score!"
                }

                let delay = random_int(10) + 5;
                ship.days += delay;
                return `The shooting star curses you for your greed. Systems on your ship have randomly shut down, delaying your progress by ${delay} days.`;
            }],
            ["A quick journey!", function(ship, party){
                let bonus_distance = random_int(100) + 10;
                ship.distance += bonus_distance;
                return `A lot of time seems to have passed in only a moment and you realize that you are ${bonus_distance} lightyears closer to the colony!`;
            }],
            ["Repairs!", function(ship, party){
                //party.forEach(element => {
                //    element.status = getStatus(element.status, 1);
                //});

                ship.speed = 10;
                ship.rate = 2.5;
                return "Your ship's damaged systems spring to life and seem to be working as normal!";
            }]]),
        new SpaceEvent("Space Whale", "Improbably, a majestic sperm whale is spawned into existence in front of you. Sadly, without oxygen it is doomed to die",
            [["Fascinating", function(ship, party){
                ship.days += 1;
                return "Struck in awe by the great beast, you don't notice your ship drifting from course, resulting in a delay of one day.";
            }]]),
        new SpaceEvent("Creature", "Your scanners detect the hulking mass of a tentacled monstrosity. It appears to be dead...",
            [["Investigate", function(ship, party){
                if (random_chance(.1)){
                    if (random_chance(.1)){
                        party.forEach(element => {
                            element.status = "Dead";
                        });wizaed

                        return "Oh no, you walked into a trap! The creature moves effortlessly through space and envelops your ship, you and your crew are helpless as you are brought to what looks like an orifice and swallowed. A dark abyss awaits you...";
                    }

                    ship.fuel -= 5;
                    return "Oh no, you fell for the beast's charade! The creature quickly reaches out to consume your ship, but you manage to engage warp just in time. Your ships's fuel reserves are significantly depleted.";
                }

                let bonus_credits = random_int(100) + 25;
                let bonus_cargo = random_int(2) + 1;
                ship.credits += bonus_credits; 
                return `The creature appears to be dead, though there are a lot of destroyed ships around it. You scavange what you can and find ${bonus_credits} credits and ${bonus_cargo} cargo!`;
            }],
            ["Leave it alone.", function(ship, party){
                return "You leave the strange beast alone and continue your travels. You notice on your scanners the anomaly has since disappeared...";
            }]]),
        new SpaceEvent("Investment", "At a rest stop, you and your crew are pulled to the side of the building by a shifty man who lets you in on the investment of a lifetime for only 100 credits!",
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
                let injured = random_choice(getAliveMembers());
                injured.status = getStatus(injured.status, -1);
                return `The man doesn't take this well and motions to his muscle to convince you. A brawl ensues leaving ${injured.name} ${injured.status}, but your credits safe!`;
            }]]),
        new SpaceEvent("Distress", "Your scanner picks up a distress beacon from a nearby planet. You investigate and find a colony that is experiencing famine and seeking cargo.",
            [["Spare 5", function(ship, party){
                ship.cargo -= 5;
                return "You give the colony 3 cargo to get by, and hope they can recover.";
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
                    return "The colonists desperately attempt to board your landed ship and seize control. Upon gaining entry, they find you are the only crew member. One colony is saved, yet another colony is lost...";
                }
            }]]),
        new SpaceEvent("Red Alert", "The 'RED ALERT' alarm suddenly roars to life! Your crewmen rush to the helm to investigate.",
            [["'Computer, status'", function(ship, party){
                if (random_chance(.50)){
                    let victim = random_choice(getAliveMembers());
                    victim.status = getStatus(victim.status, -1);

                    return `A small breach in the hull reveals a leak! Your crewmen manage to repair the leak before losing too much oxygen although ${victim.name} is not feeling so great.`;
                }

                if (random_chance(.50)){
                    let victim = random_choice(getAliveMembers());
                    victim.status = getStatus(victim.status, -1);
                    ship.cargo -= 1 + random_int(5);

                    return `It seems someone forgot to close the liftgate at the last stop... You manage to reseal it, but lose some cargo during the effort. ${victim.name} is not feeling so great.`;
                }
                let victim = random_choice(getAliveMembers());
                victim.status = getStatus(victim.status, -1);
                return `It seems someone forgot to close the liftgate at the last stop... You manage to successfully reseal it without losing any cargo. ${victim.name} feels a little sick after.`;

            }]]),
        new SpaceEvent("Space Cat", "While stopped for a break, you see a sight most odd. A cat, in a space suit, is floating around on a crate.",
            [["What...?", function(ship, party){
                ship.cargo += 1;
                if (party.length < 7 && random_chance(.3)){
                    party.push({
                        name: "Space Cat",
                        status: getStatus(""),
                    });
                    return "You decide to recruit the cat and gain a new crew member! You also scored an additional cargo!";
                }
                return "You take the crate and get 1 cargo. As you reach for the cat it waves goodbye, and flys off.";
            }]]),
        new SpaceEvent("The Wizard", "A video message appears on your ships console. What appears to be a man dressed as a wizard asks you to consider stopping at his moon workshop. Are you interested?",
            [["Well, alright.", function(ship, party){
                let lost_days = random_int(50) + 1;
                ship.days += lost_days;
                return `Arriving at the location, you quickly determine this is a tourist trap. While leaving, businessmen attempt to sell you timeshares for condos. Shrugging them off, you leave. However, due to time dialation you lost ${lost_days} days`;
            }],
            ["There's no time!", function(ship, party){
                let injured = random_choice(getAliveMembers());
                injured.status = getStatus(injured.status, -1);
                return `The wizard somehow sends a magic fireball through the radio, injuring ${injured.name}.`;
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
                        events.push(karens_revenge());
                        return `Oh no! Crewman Karen has stolen half of your hard-earned credits and claims ${kid.name}, the youngest of your crew, as a hostage. She hijacks an escape pod and disappears, taking her bounty and the kid with her. You should have seen it coming.`;
                    }

                    return `Oh, it's just crewman ${kid.name} dancing around and being a goof.`;
                }]]);
}

/**
 * Adds 'Revenge' event after 'Rouge Karen'
 */
function karens_revenge(){

    return new SpaceEvent("Karen's Revenge", "An armada of ships blocks your path and you're hailed. It is Karen. She demands your credits and her 'kids'",

                [["Surrender", function(ship, party){
                    if (getAliveMembers().length > 2){
                        let kid1 = random_choice(getAliveMembers());
                        let kid2 = random_choice(getAliveMembers());

                        while (kid1.name == kid2.name){
                            kid2 = random_choice(getAliveMembers());
                        }

                        kid1.status = "Missing";
                        kid2.status = "Missing";
                        ship.credits = 0;
                        karen_finale = true;
                        return `Giving in to her demands, you hand over ${kid1.name} and ${kid2.name} along with the rest of your credits. With a smirk, Karen and her aramda fly off. She will rue this day...`;
                    }
                    else if (getAliveMembers().length > 1){
                        let kid1 = random_choice(getAliveMembers());
                        kid1.status = "Missing";
                        ship.credits = 0;
                        karen_finale = true;
                        return `Giving in to her demands, you hand over ${kid1.name} along with the rest of your credits. With a smirk, Karen and her aramda fly off. She will rue this day...`;
                    }

                    karen_finale = true;
                    return `Seeing that her 'kids' are either dead or missing, Karen is happy enough with taking the rest of your credits. With a smirk, Karen and her aramda fly off. She will rue this day...`;
                }],
                ["Not without a fight!", function(ship, party){
                    if (random_chance(.2)){
                        let victim = random_choice(getAliveMembers());
                        victim.status = getStatus(victim.status, -1);
                        karen_finale = true;
                        return `Through your superior navigation skills, you manage to fly through the armada and take out a few of her ships! Though ${victim.name} is ${victim.status} after the attempt. Hopefully this is the last you see of Karen...`;
                    }
                    
                    let alive = getAliveMembers();
                    
                    for (i = 0; i < alive.length; i++){
                        alive[i].status = "Dead";
                    }

                    return "There are too many of them! The ship is overtaken as you succumb to Karen's assault. Your last sight is that of the commanding ship firing into your fuel storage. Never trust Karen.";
                }]]);
}

/**
 * Adds 'Karen's Requeim' event after 'Karen's Revenge' and only at 3000 lightyears
 */
function karen_requiem(){

    return new SpaceEvent("Karen's Requiem", "At your destination, you again find Karen's gang, only this time attacking the colony. Karen hails you, sparing them in exchange for all of your cargo.",

                [["This ends here!", function(ship, party){
                    if (talk_count >= 3){
                        ship.credits += 1000;
                        return "You are a cargo trucker. No more, no less. But that is exactly what you needed to be today. Grabbing your CB radio you message every nearby trucker. Soon, an army of trucks stands with you. Karen surrenders all she has for her life. The colony is saved.";
                    }
                    
                    let alive = getAliveMembers();
                    
                    for (i = 0; i < alive.length; i++){
                        alive[i].status = "Dead";
                    }

                    return "You are a cargo trucker. No more, no less. But that is exactly what you needed to be today. Grabbing your CB radio you message every nearby trucker in the sector... but no ones comes. Perhaps you didn't talk to enough truckers... You don't stand a chance.";
                }],
                ["Surrender the cargo...", function(ship, party){
                    ship.cargo = 0;
                    return "It is a hopeless situation. In exchange for your life you surrender your cargo. Karen smirks and leaves with her armada. You have no choice but to face the colony and deliver them the terrible news...";
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
    else if (events.length <= Math.floor(event_cooldown.length * .5)){
        events.push(event_cooldown.pop());
    }

    let event = random_choice(events);
    let event_index = events.indexOf(event);

    if (event.name != "Karen's Revenge"){
        event_cooldown.push(event);
    }

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