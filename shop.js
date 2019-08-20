var names = ["Johnney's", "Clarney's", "The Mysterious", "The Belt-line", "Astro's", "Solar Star's", "Randel's"];
var descriptors = ["Galactic Truck Stop!", "World of Wonders!", "Gas and Grill", "Land of the Lost!", "Sunken Astroid", "Spitoon", "Diner and More!"];
test_shops();

/**
 * Creates a shop object with a randomized name and unit prices for each resource
 * @Constructor
 */
function Shop(){
    this.name = generate_name();
    this.fuel_unit_price = calculate_price(1, 3, 2);
    this.prices = [this.fuel_unit_price] //Organized in order of resource: fuel, ...
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
 * Returns an array containing the unit prices of each resources
 * Organized by the following: fuel, ...
 * @param {*} shop 
 */
function get_prices(shop){
    return shop.prices;
}

/**
 * Generates a new shop and prompts the user for inputs
 */
function go_shopping(){
    return new Shop();
}

/**
 * Calculates cost of listed purchases from this shop
 * @param {Shop} shop - A shop object
 * @param {Array} resources - An array containing resources in the order of:
 * fuel, ...
 */
function calculate_cost(shop, resources){
    let total_cost = 0;
    for (i = 0; i < resources.length; i++){
        total_cost += (shop.prices[i] * resources[i]);
    }

    return total_cost;
}

/**
 * If the current credits owned by the player is greater than the cost, subtract
 * the cost from the credits and return true, otherwise return false
 * @param {Ship} ship - The Ship object which contains a reference to credits
 * @param {int} cost - The total cost as calculated through the calculate_cost method
 */
function confirm_purchase(ship, cost){
    if (ship.credits >= cost){
        ship.credits -= cost;
        return true;
    }
    return false;
}

/**
 * Just quickly tests shop logic to demonstrate it working
 */
function test_shops(){
    console.log("Test generating a shop");
    var shop = go_shopping();
    console.log(shop);
    console.log("Test calculate_price");
    var cost = calculate_cost(shop, [10]);
    console.log(cost);
    console.log("Test confirm_purchase");
    ship = {
        fuel: 100,
        cargo: 50,
        credits: 1000
    };
    console.log(confirm_purchase(ship, cost));
}