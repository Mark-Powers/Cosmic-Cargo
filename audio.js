var audio = {
    "bgm": new Audio("Assets/music.ogg"),
    "shop": new Audio("Assets/shop.ogg"),
    "endgame": new Audio("Assets/endgame.ogg"),
    "alert": new Audio("Assets/SoundEffects/Alert.wav"),
    "select": new Audio("Assets/SoundEffects/SelectNoise.wav"),
    "move": new Audio("Assets/SoundEffects/MoveCursor.wav"),
}
var music = ["bgm", "shop"]

function play_audio(sound, loop = false){
    var curr_audio = audio[sound];
    if(curr_audio != undefined){
        if(loop){
            curr_audio.addEventListener('ended', loop_audio_listener, false)
        } else {
            curr_audio.removeEventListener("ended", loop_audio_listener, false)
        }
        // play if paused or if not music
        if(curr_audio.paused || !music.includes(sound)){
            curr_audio.currentTime = 0;
            curr_audio.play();
        }
    }
}

function pause_audio(sound){
    var curr_audio = audio[sound];
    if(curr_audio != undefined){
        curr_audio.pause();
    }
}

function loop_audio_listener(){
    this.currentTime = 0;
    this.play();
}