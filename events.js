var events = [];
//test_events();

/**
 * Creates all established events and stores them in the events array
 */
function generate_events(){
    events = [
        new SpaceEvent("Testing in progress...", "The captain would like to know if this test was successfull...",
            [["Yes",function(ship, party){return "Hooray!"}],
            ["No",function(ship, party){return "Welp..."}]]),
        new SpaceEvent("Pirates", "Space pirates have boarded your ship! Fight?", 
            [["Yes",function(ship, party){return "Hooray!"}], 
            ["No",function(ship, party){return "Welp..."}]]),
        new SpaceEvent("Space Plague", "During your travels through a nebula, your ship took on foreign bacteria...",
            [["Ok..", function(ship, party){return "One of you starts to feel sick."}]]),
        new SpaceEvent("Engine Fault", "A part of your engine requires repairs, resulting in a delay.",
            [["This is a serious setback...", function(ship, party){return "This has set you back some time."}]])
    ];
}

/**
 * Preset event to call during specific days of travel
 */
function astroid_event(){
    return new SpaceEvent("Astroid Belt", "Your ship is approaching an astroid belt that is difficult to navigate.",
                [["Attempt to fly through", function(ship, party){return ""}],
                ["Look for a different route (lose fuel)", function(ship, party){return ""}],
                ["Wait for an opening (lose time)", function(ship, party){return ""}]]);
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