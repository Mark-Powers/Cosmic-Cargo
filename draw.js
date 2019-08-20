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
        case "status":
            draw_status();
            break;
        case "gameover":
            // background
            color(3);
            ctx.fillRect(0, 0, width, height);
            // game over text
            color(1);
            ctx.fillRect(28, 33, 100, 20);
            font(16, "Game over!", 30, 50);
            break;
        case "win":
            color(3);
            ctx.fillRect(0, 0, width, height);
            // game over text
            font(16, "You've arrived!", 3, 12);
            font(10, "Score:", 3, 24);
            font(10, `${getAliveMembers().length} alive members * 400`, 7, 34);
            font(10, `${ship.cargo} tons of cargo * 100`, 7, 44);
            font(10, `${ship.credits} credits`, 7, 54);
            font(10, `Took ${ship.current_day} days (${10*(100-ship.current_day)})`, 7, 64);
            let total = getAliveMembers().length*400 + ship.cargo*100 + ship.credits + (10*(100-ship.current_day));
            font(10, `Total: ${total}`, 20, 120);
            break;

    }
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
    font(25, "PROJECT 71", 4, 20);
    font(12, "A space trucking game", 7, 30);
    font(12, "(press any key)", 30, height - 20);
}
function draw_main(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    // map rectangle
    color(1)
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.rect(1, 1, width-2, height/2);
    ctx.stroke();
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
    font(10, `Day ${ship.current_day}`, 3, 82);
    font(10, `${ship.distance}/${ship.end_distance} lightyears`, 3, 139);
}
function draw_event(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    if(eventResult == undefined){
        font(16, `${currentEvent.name}`, 5, 13);
        font(12, `${currentEvent.desc}`, 5, 25, true);
        let choices = get_choices(currentEvent)
        var i = 0;
        for(let choice of choices){
            font(10, choice, 10, 100 + 10*i);
            if(selectedEventChoice == i){
                font(10, `>`, 4, 100 + 10*i);
            }
            i++;
        }
    } else {
        font(12, `${eventResult}`, 5, 11, true);
        font(12, "(press any key)", 26, height - 8);
    }
}
function draw_status(){
    // background
    color(3);
    ctx.fillRect(0, 0, width, height);
    // person list
    var i = 0;
    for(let person of party){
        font(10, person.name, 15, 15 + 12*i);
        font(10, person.status, 100, 15 + 12*i);
        i++;
    }
    
    font(10, `Cargo: ${ship.cargo} tons`, 15, 106);
    font(10, `Credits: ${ship.credits}`, 15, 118);
    font(10, `Fuel: ${ship.fuel}%`, 15, 130);
    font(10, `Day ${ship.current_day}%`, 15, 142);
    font(10, `${ship.distance}/${ship.end_distance}`, 115, 142);
}

function font(size, what, x, y, wrap = false) {
    ctx.font = size + "px Courier";
    color(2);
    if(wrap){
        var parts = what.match(/.{1,21}\W/g); // Match up to 22 characters, making sure to not end a line mid word
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