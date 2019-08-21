var audio_bg_music = new Audio("Assets/music.ogg");
var audio_click = new Audio("Assets/click.ogg");

function play_audio(sound, loop = false){
    var curr_audio;
    switch(sound){
        case "bgm":
            curr_audio = audio_bg_music;
            break;
        case "click":
            curr_audio = audio_click;
            break;
    }
    if(curr_audio != undefined){
        if(loop){
            curr_audio.addEventListener('ended', loop_audio_listener, false)
        } else {
            curr_audio.removeEventListener("ended", loop_audio_listener, false)
        }
        curr_audio.play();
    }
}

function loop_audio_listener(){
    this.currentTime = 0;
    this.play();
}