function random_choice(arr){
    return arr[random_int(arr.length)];
}

function random_int(max) {
    return Math.floor(Math.random() * max);
}

function random_chance(percentage_of_success){
    return Math.random() < percentage_of_success;
}

function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = random_int(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}