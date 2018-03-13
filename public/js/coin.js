
// main.js
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// world
var world = document.querySelector("#world");
var eNum = document.querySelector("#num");
var block = document.querySelector("#block");

// コインの数
var coinNum = 0;

// コインのアニメーションをする
function coinAnime() {
    var ele = document.createElement("div");
    ele.setAttribute("class", "coin");

    world.appendChild(ele);

    setTimeout(function(){
        ele.remove();
    }, 500);
};

// コインの
var Sound = {
    status: "unready",
    src: {
        coin : "./sound/coin.mp3",
        up : "./sound/1up.wav"
    },
    buffer: {
        coin : null,
        up: null
    },
    init: function() {

        (function(){
            var request = new XMLHttpRequest();
            var url = Sound.src.coin;
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var onSuccess = function(buffer) {
                Sound.buffer.coin = buffer;
            }

            var onError = function(e) {
                console.log('ERROR', e)
            }

            // Decode asynchronously
            request.onload = function() { context.decodeAudioData(request.response, onSuccess, onError); }

            request.send();
        })();

        (function(){
            var request = new XMLHttpRequest();
            var url = Sound.src.up;
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var onSuccess = function(buffer) {
                Sound.buffer.up = buffer;
            }

            var onError = function(e) {
                console.log('ERROR', e)
            }

            // Decode asynchronously
            request.onload = function() { context.decodeAudioData(request.response, onSuccess, onError); }

            request.send();
        })();

    },
    play: function(type) {
        var buffer;
        switch(type){
            case 'coin' : buffer = Sound.buffer.coin; break;
            case 'up' : buffer = Sound.buffer.up; break;
         }
        playSound(buffer);
    }
};

Sound.init();

function shakeBlock() {
    block.classList.add("shake");

    setTimeout(function(){
        block.classList.remove("shake");
    }, 250);
}

var getFlag = true;

function getCoin() {
    if (getFlag) {
        getFlag = false;


        eNum.innerHTML = ++coinNum;
        shakeBlock();
        Sound.play('coin');
        coinAnime();
        interval = 50;
        if(coinNum % 10 === 0){
            setTimeout(function(){
                Sound.play('up');
            }, 200);
            var interval = 400;
            makeImage();
        }

        setTimeout(function() {
            getFlag = true
        }, interval);
    }
}

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer; // tell the source which sound to play
    source.connect(context.destination); // connect the source to the context's destination (the speakers)
    source.start(0); // play the source now
}

var eImages = document.querySelector('.images');
var canvas = document.querySelector('canvas');
function makeImage(){
    var src = canvas.toDataURL();
    var targetImage = document.querySelector('img');
    var eImg = document.createElement('img');
    eImg.setAttribute('src', src);

    eImages.insertBefore(eImg, targetImage);
}

window.addEventListener('keypress', getCoin);
