var audio = {
    "bgm": new Audio("Assets/music.ogg"),
    "click": new Audio("Assets/click.ogg"),
    "shop": new Audio("Assets/shop.ogg"),
}

function play_audio(sound, loop = false){
    var curr_audio = audio[sound];
    if(curr_audio != undefined){
        if(loop){
            curr_audio.addEventListener('ended', loop_audio_listener, false)
        } else {
            curr_audio.removeEventListener("ended", loop_audio_listener, false)
        }
        if(curr_audio.paused){
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