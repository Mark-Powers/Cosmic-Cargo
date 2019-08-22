function draw() {
    switch(gameState){
        case "title":
            draw_title();
            break;
        case "main":
            draw_main();
            break;
        case "event":
            draw_event();
            break;
        case "shop":
            draw_shop();
            break;
        case "status":
            draw_status();
            break;
        case "event_result":
            draw_event_result();
            break;
        case "shop_result":
            draw_shop_result();
            break;
        case "options":
            draw_options();
            break;
        case "gameover":
            draw_gameover();
            break;
        case "win":
            draw_win();
            break;
        case "setup":
            draw_setup();
            break;
    }
}
function draw_setup(){
    color(3);
    ctx.fillRect(0, 0, width, height);
    var names = party.reduce( (acc, el) => {
        if(acc == ""){
            return el.name
        } else {
            return `${acc}, ${el.name}`
        }
    }, "")
    let text = `You are a space trucker in the distant year 2019. Your latest mission: transport essential cargo from Replaris to a new colony on Octilion. Without your ship of goods within the next year, everyone there will die. Your team includes ${names}.`;
    font(8, text, 3, 7, true);
    font(8, ")press any key)", 30, height - 10);
}
function draw_win(){
    color(3);
    ctx.fillRect(0, 0, width, height);
    // game over text
    font(12, "You've arrived!", 3, 12);
    font(8, "Score:", 3, 24);
    font(8, `${getAliveMembers().length} alive members * 400`, 3, 34);
    font(8, `${ship.cargo} tons of cargo * 100`, 3, 44);
    font(8, `${ship.credits} credits`, 3, 54);
    font(8, `Took ${ship.current_day} days )${10*(350-ship.current_day)})`, 3, 64);
    var total = getAliveMembers().length*400 + ship.cargo*100 + ship.credits + (10*(350-ship.current_day));
    font(8, `Total: ${total}`, 3, 120);
}
function draw_gameover(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    // game over text
    font(12, "Game over!", 3, 12);
    let allDead = getAliveMembers().length == 0;
    if(allDead){
        font(8, "Your crew all died", 3, 24);
    } else {
        font(8, "You ran out of fuel", 3, 24);
    }
    font(8, "Score:", 3, 44);
    font(8, `${ship.credits} credits`, 3, 54);
    font(8, `Took ${ship.current_day} days`, 3, 64);
    var total = ship.credits + ship.current_day;
    font(8, `Total: ${total}`, 3, 120);
}
function draw_stars(w, h){
    color(1);
    for(var x = 0; x < w; x++){
        for(var y = 0; y < h; y++){
            let chance = 1; // chance% of drawing a star
            if(random_chance(0.01)){
                ctx.fillRect(x, y, 1, 1);
            } 
        }
    }
}
function draw_title(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    // stars
    draw_stars(width, height);
    // title
    font(13, "COSMIC CARGO", 5, 20);
    font(8, "A space trucking game", 3, 30);
    // Only display this if the game is loaded
    if(imagesLoaded){
        font(8, ")press any key)", 27, height - 20);
    }
}
function draw_main(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    // ship rectangle
    draw_stars(width, height/2);
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.rect(1, height/2, width-2, height/2 -1);
    ctx.stroke();
    // ship
    if(t % 6 < 3){
        ctx.drawImage(images["ship1"], 20, 28); 
    } else {
        ctx.drawImage(images["ship2"], 20, 28); 
    }
    // map
    ctx.drawImage(images["map"], 0, height/2); 
    // map rectangle
    color(1)
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.rect(1, 1, width-2, height/2);
    ctx.stroke();
    // Day and distance notification
    font(8, `Day ${ship.current_day}`, 3, 82);
    font(8, `${Math.floor(ship.fuel)}% Fuel`, 3, 129);
    font(8, `${ship.distance}/${ship.end_distance} lightyears`, 3, 139);
    // map progress
    color(0);
    ctx.lineWidth = "1";
    // Draw dashed
    ctx.setLineDash([2])
    ctx.beginPath();
    ctx.moveTo(9, 104)
    ctx.lineTo(43, 92)
    ctx.lineTo(76, 112)
    ctx.lineTo(98, 81)
    ctx.lineTo(147, 103)
    ctx.stroke();
    // Draw solid on top
    let progress = ship.distance / ship.end_distance;
    ctx.setLineDash([0])
    ctx.beginPath();
    ctx.moveTo(9, 104)
    var shipCoords = [-20, -20];
    if(progress < 0.25){
        shipCoords = line_to_from_progress(progress, 9, 104, 43, 92);
        
    } else {
        ctx.lineTo(43, 92)
        if (progress < 0.5){
            shipCoords = line_to_from_progress(progress - .25, 43, 92, 76, 112);
        }
        else {
            ctx.lineTo(76, 112)
            if(progress < 0.75){
                shipCoords = line_to_from_progress(progress - .5, 76, 112, 98, 81);
            } else {
                ctx.lineTo(98, 81)
                shipCoords = line_to_from_progress(progress - .75, 98, 81, 147, 103);
            }   
        }        
    }
    ctx.stroke();
    draw_ship_indicator(shipCoords);
}
function draw_ship_indicator(coords){
    ctx.beginPath();
    ctx.arc(coords[0], coords[1], 1.5, 0, 2 * Math.PI);
    ctx.fill();
}
function line_to_from_progress(norm_progress, x1, y1, x2, y2){
    var  newX = x1 + (x2-x1)*4*norm_progress
    var  newY = y1 + (y2-y1)*4*norm_progress
    ctx.lineTo(newX, newY)
    return [newX, newY]
}
function draw_event(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    font(12, `${currentEvent.name}`, 5, 13);
    font(8, `${currentEvent.desc}`, 5, 25, true);
    let choices = get_choices(currentEvent)
    var i = 0;
    for(let choice of choices){
        font(8, choice, 10, 100 + 10*i);
        if(selectedChoice == i){
            font(8, `~`, 4, 100 + 10*i);
        }
        i++;
    }
}
function draw_options(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    font(12, `Adjust volume`, 5, 13);

    let music_volume = `${audio[music[0]].volume*100}`.replace(/\.\d*/,"")
    let sfx_volume = `${audio[sfx[0]].volume*100}`.replace(/\.\d*/,"")
    font(8, `MUSIC: ${(music_volume)}`, 10, 22);
    if(selectedChoice == 0){
        font(8, `~`, 4, 22);
    }
    font(8, `SFX: ${sfx_volume}`, 10, 32);
    if(selectedChoice == 1){
        font(8, `~`, 4, 32);
    }
}
function draw_status(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    // person list
    var i = 0;
    for(let person of party){
        font(8, person.name, 15, 15 + 12*i);
        font(8, person.status, 100, 15 + 12*i);
        i++;
    }
    
    font(8, `Cargo: ${ship.cargo} tons`, 15, 106);
    font(8, `Credits: ${ship.credits}`, 15, 118);
    font(8, `Fuel: ${Math.floor(ship.fuel)}%`, 15, 130);
    font(8, `Day ${ship.current_day}`, 15, 142);
    font(8, `${ship.distance}/${ship.end_distance}`, 100, 142);
}
function draw_shop(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    font(12, "Shop", 5, 13);
    font(8, `Welcome to ${currentShop.name}! Enjoy your stay!`, 5, 25, true);
    let choices = shop_choices(currentShop);
    var i = 0;
    for(let choice of choices){
        font(8, choice, 10, 100 + 10*i);
        if(selectedChoice == i){
            font(8, `~`, 4, 100 + 10*i);
        }
        i++;
    }
}
function draw_event_result(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    font(8, `${eventResult}`, 5, 11, true);
    font(8, ")press any key)", 26, height - 8);
}
function draw_shop_result(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    font(8, `${shopResult}`, 5, 11, true);
    font(8, ")press any key)", 26, height - 8);
}

function font(size, what, x, y, wrap = false) {
    ctx.font = size + "px Gameboy";
    color(2);
    if(wrap){
        // Match up to 22 characters, making sure to not end a line mid word
        var parts = what.match(/.{1,21}\b/g); 
        parts.forEach((element, i) => {
            ctx.fillText(element.trim(), x, y + i*size);
        });
    } else {
        ctx.fillText(what, x, y);
    }
}
function color(c) {
    var color = "";
    switch (c){
        case 0:
            color = "#FA0000";
            break;
        case 1:
            color = "#b4b4b4";
            break;
        case 2:
            color = "#fafafa";
            break;
        case 3:
            color = "#000000";
            break;
    }
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}
function loadImages(imagefiles) {
    loadcount = 0;
    loadtotal = imagefiles.length;
    imagesLoaded = false;
 
    // Load the images
    var loadedimages = [];
    for (var i=0; i<imagefiles.length; i++) {
        // Create the image object
        var image = new Image();
 
        // Add onload event handler
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                // Done loading
                imagesLoaded = true;
            }
        };
        image.src = imagefiles[i];
        loadedimages[i] = image;
    }
    return loadedimages;
}