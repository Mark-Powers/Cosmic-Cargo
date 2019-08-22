var names = ["Johnny's", "Clarney's", "The Mysterious", "The Belt-line", "Astro's", "Solar Star's", "Randal's", "Mitchard's"];
var descriptors = ["Galactic Truck Stop!", "World of Wonders!", "Gas and Grill", "Land of the Lost!", "Sunken Astroid", "Spitoon", "Diner and More!", "Pool Party", "Restaurant at the End of the Universe"];
var trucker_talk = ["I would be wary of pirates around these parts. Good folk have been getting robbed as of late.",
                    "You new around here? Haven't seen you around these parts.",
                    "I used to be a trucker like you, until I took a torpedo to the wing.",
                    "It's a harsh life out in space. Never know what day might be your last out here.",
                    "How do you do? I'm the owner of this here establishment. Good to see a friendly face.",
                    "Beware of people named Karen. Maybe you'll understand when you're old like me. Ha!",
                    "Look kid, are you going to buy something?",
                    "Hackers are nerdy, pasty, tubby, little geeks with triple thick glasses... Should be easy to catch if you're looking for one",
                    "Buzz off.",
                    "Space age technology and we're still clinging to our CB radios. Heh. Imagine that.",
                    "Hey we got a rule around these parts! The new guy pays first round!"]

/**
 * Creates a shop object with a randomized name and unit prices for each resource
 * @Constructor
 */
function Shop(ship){
    this.name = generate_name();
    this.fuel_price = calculate_price(1, 3, 2) * (100 - Math.floor(ship.fuel));
    this.message = generate_trucker_message();
}

/**
 * Generates a fun name for the shop object
 */
function generate_name(){
    let name = names[Math.floor(Math.random() * names.length)];
    let desc = descriptors[Math.floor(Math.random() * descriptors.length)];
    return name + " " + desc;
}

/**
 * Calculates out a semi-random value for the price of 1 unit of a resource
 * @param {int} min - The minimum value of the resource
 * @param {int} max - The maximum value of the resource
 * @param {int} modifier - A value multiplied against a random value and added to the unit price
 */
function calculate_price(min, max, modifier){
    return Math.floor((Math.random() * (max - min + 1) + min) + (Math.random() * modifier));
}

/**
 * Randomly chooses the 'talk' option message for this stop
 */
function generate_trucker_message(){
    return random_choice(trucker_talk);
}

/**
 * If the current credits owned by the player is greater than the cost, subtract
 * the cost from the credits and return true, otherwise return false
 * @param {Ship} ship - The Ship object which contains a reference to credits
 * @param {int} cost - The total cost as calculated through the calculate_cost method
 */
function purchase_fuel(ship, shop){
    if (ship.fuel == 100){
        return "Your ship is currently full of fuel."
    }

    if (ship.credits >= shop.fuel_price){
        ship.credits -= shop.fuel_price;
        ship.fuel = 100;
        return `You refuel your ship. You have ${ship.credits} credits remaining!`;
    }
    return "You do not have enough credits to refuel your ship!";
}

/**
 * Flavor text of talking with a trucker at this shop
 * @param {Shop} shop - The current shop the player is at
 */
function truck_talk(shop){
    return shop.message;
}

/**
 * The player leaves the shop
 */
function leave(){
    return "You leave the stop.";
}

function shop_choices(shop){
    return [`Refuel )${shop.fuel_price} credits)`, "Talk", "Leave"];
}