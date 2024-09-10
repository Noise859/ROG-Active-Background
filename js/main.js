let audioCanvas = null;
let audioCanvas2 = null;
let audioCanvasCtx = null;
let audioCanvasCtx2 = null;
var lAudio = new Array(192);
var lHAudio = new Array(192);
var rAudio = new Array(192);
var rHAudio = new Array(192);
var smooth = new Array(128);
var avgVolBassArray = new Array(60);
var avgVolBassPointer = 0;
var avgVolBassInt = 0;
var avgVolBass = 0;
var logo = document.getElementById("container2");
var enLogo = false;
var circulatory = 5;


// CHANGEABLE VARS

var enLogoVal = .111;
var bMulti = .5;
var bReactivity = .3;


var audioArrayLmao;
for(i=0;i<lHAudio.length;i++){
    lHAudio[i]=0;
    rHAudio[i]=0;
}
function wallpaperAudioListener(audioArray) {
    audioArrayLmao = audioArray;
    audioArray.map(function(garbage, indexval){
        if(indexval == 0){
            smooth[indexval] = audioArray[indexval];
        }else if(indexval == 127){
            smooth[indexval] = (audioArray[indexval-1] + audioArray[indexval])/2;
        }
        else if(indexval == 63){
            smooth[indexval] = (audioArray[indexval-1] + audioArray[indexval])/2;
        }   
        else if(indexval == 64){
            smooth[indexval] = audioArray[indexval];
        }  
        else{
            smooth[indexval] = (audioArray[indexval-1] + 2 * audioArray[indexval] + audioArray[indexval+1])/4;
        }
    });
    audioCanvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
    audioCanvasCtx.fillStyle = 'rgba(18, 33, 49,.7)';

    audioCanvasCtx2.clearRect(0, 0, audioCanvas2.width, audioCanvas2.height);
    audioCanvasCtx2.fillStyle = 'rgba(235, 46, 74,.7)';

    var barWidth = 1+Math.round(1.0 / 192.0 * audioCanvas.width);
    var halfCount = audioArray.length / 2;
    
    for(var i=0;i<halfCount;i++){
        lAudio[i+96]=smooth[i];
        lAudio[i+32]=smooth[63-i];
        if(i<32){
            lAudio[i]=smooth[32+i];
            lAudio[i+159]=smooth[64-i]
        }   
    }
    for(var i=0;i<halfCount;i++){
        rAudio[i+96]=smooth[i+64];
        rAudio[i+32]=smooth[127-i];
        if(i<32){
            rAudio[i]=smooth[96+i];
            rAudio[i+159]=smooth[128-i]
        }   
    }
    for (var i = 0; i < lAudio.length; ++i) {
        var height = audioCanvas.height * Math.min(lAudio[i], 1);
        if(height>lHAudio[i]){
            lHAudio[i] = height;
        }
        else {
            lHAudio[i]-=2*Math.sqrt(lHAudio[i])*(1+bReactivity);
        }
        audioCanvasCtx.fillRect(barWidth * i, 0, barWidth, lHAudio[i]*bMulti);
    }

    for (var i = 0; i < rAudio.length; ++i) {
        var height = audioCanvas2.height * Math.min(rAudio[i], 1);
        if(height>rHAudio[i]){
            rHAudio[i] = height;
        }
        else {
            rHAudio[i]-=2*Math.sqrt(rHAudio[i])*(1+bReactivity);
        }
        audioCanvasCtx2.fillRect(barWidth * i, window.innerHeight-rHAudio[i]*bMulti, barWidth, rHAudio[i]*bMulti);
    }
    avgVolBassInt = (audioArrayLmao[0] + audioArrayLmao[1] + audioArrayLmao[2] + audioArrayLmao[3] 
        + audioArrayLmao[64] + audioArrayLmao[65] + audioArrayLmao[66] + audioArrayLmao[67])/8;
    if(avgVolBassInt > avgVolBass*1.5 && (audioArrayLmao[0] > .15 || audioArrayLmao[64] > .15 || audioArrayLmao[1] > .25 || audioArrayLmao[65] > .25)) {
        if(!enLogo) {
            enLogo = true;
            logo.style.transform = "scale(" + (1 + enLogoVal) + ")";
        }
    }
    if(enLogo) {
        if(enLogoVal < .001) {
            enLogo = false;
            enLogoVal = .111;
        }
        else {
            if(enLogoVal - Math.sqrt(enLogoVal)*.03 > 0) {
                enLogoVal -= Number(Math.sqrt(enLogoVal)*.175);
            }
            logo.style.transform = "scale(" + (1 + enLogoVal) + ")";
        }
    }
    if(avgVolBassPointer < avgVolBassArray.length-1) {
        avgVolBassPointer++;
    }
    else {
        avgVolBassPointer = 0;
    }
    avgVolBassArray[avgVolBassPointer] = avgVolBassInt;
    for(var i = 0; i<avgVolBassArray.length;i++){
        if(avgVolBassArray[i] > 0){
            avgVolBass += avgVolBassArray[i];
        }
    }
    avgVolBass = avgVolBass/avgVolBassArray.length;
}

window.onload = function() {
    audioCanvas = document.getElementById('AudioCanvas');
    audioCanvas.height = window.innerHeight;
    audioCanvas.width = Math.sqrt(window.innerHeight*window.innerHeight+window.innerWidth*window.innerWidth);
    audioCanvas.style.transform = "rotate(" + (180/Math.PI * Math.atan(9/16)) + "deg)";
    if(screen.width/screen.height != (16/9)) {
        audioCanvas.style.top = "calc(" + (screen.width) * (screen.width/screen.height)  + "px + 2.5vh";
    }
    audioCanvasCtx = audioCanvas.getContext('2d');

    audioCanvas2 = document.getElementById('AudioCanvas2');
    audioCanvas2.height = window.innerHeight;
    audioCanvas2.width = Math.sqrt(window.innerHeight*window.innerHeight+window.innerWidth*window.innerWidth);
    audioCanvas2.style.transform = "rotate(" + (180/Math.PI * Math.atan(9/16)) + "deg)";
    audioCanvas2.style.left = -1*(audioCanvas2.width - window.innerWidth) +  "px";
    if(screen.width/screen.height != (16/9)) {
        audioCanvas2.style.top = "calc(" + (screen.width) * (-screen.width/screen.height)  + "px - 2.5vh";
    }
    audioCanvasCtx2 = audioCanvas2.getContext('2d');


    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
};