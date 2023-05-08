// main.js

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


(function() {

    var video = document.querySelector("video");
    var canvas = document.querySelector("canvas");
    var context = canvas.getContext('2d');
    var width = 400;
    var height = 300;
    var currentImageData = undefined;
    var prevImageData = undefined;
    var def;
    var DEFTHRESHOLD = 150;
    var playPoint;
    var PLAYTHRESHOLD = 150;

    var coinbox = {
        "width": 50,
        "height": 50,
        "x": 175,
        "y": 75
    };

    function onFrame() {
        context.drawImage(video, 0, 0, width, height);

        currentImageData = context.getImageData(0, 0, width, height);
        if (prevImageData) {
            var putImageData = context.getImageData(0, 0, width, height);
            var putPixel = putImageData.data;
            var prevPixel = prevImageData.data;
            playPoint = 0;
            for (var x = 0; x < height; x++) {
                for (var y = 0; y < width; y++) {
                    var i = (x + y * width) * 4;
                    var red, green, blue, alpha, def;
                    red = i + 0;
                    green = i + 1;
                    blue = i + 2;
                    alpha = i + 3;

                    if (
                        x >= 175 && y >= 75 &&
                        x <= 225 && y <= 125
                    ) {
                        var def = 0;
                        def += Math.abs(putPixel[red] - prevPixel[red]);
                        def += Math.abs(putPixel[green] - prevPixel[green]);
                        def += Math.abs(putPixel[blue] - prevPixel[blue]);

                        if (def >= DEFTHRESHOLD) {
                            playPoint++;
                        }
                    }

                }
            }
            if (playPoint >= PLAYTHRESHOLD) {
                getCoin();
            }
            context.putImageData(putImageData, 0, 0); // 画像の描画 
        }
        prevImageData = currentImageData;

        requestAnimationFrame(onFrame);
    }

    // get.UserMedia
    navigator.getUserMedia({
            'video': true,
            'audio': false
        },
        function(stream) {
            video.srcObject = stream;
        },
        function(error) {
            alert('エラー: ' + error);
        }
    );

    video.addEventListener('loadeddata', onFrame, false);
    
})();