let faceapi;
let video;
let detections;
let stars = []
let starSize = 10

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}


function setup() {

    createCanvas(1024, 768);
    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(RIGHT);
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    select('#status').html('Model Loaded');
    faceapi.detect(gotResults)

}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);
    image(video, 0, 0, width, height)
    if (detections) {
        if (detections.length > 0) {
            // console.log(detections)
            drawBox(detections)
            drawLandmarks(detections)
        }

    }
    faceapi.detect(gotResults)
}

function drawBox(detections) {
    for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight = alignedRect._box._height
        // 顔の面積を取得します
        setStarSize(detections[i]);

        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);
    }

}

function drawLandmarks(detections) {
    noFill();
    stroke(161, 95, 251)
    strokeWeight(2)

    for (let i = 0; i < detections.length; i++) {
        // const mouth = detections[i].parts.mouth;
        // const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        // const rightEyeBrow = detections[i].parts.rightEyeBrow;
        // const leftEyeBrow = detections[i].parts.leftEyeBrow;

        // drawPart(mouth, true);
        // drawPart(nose, false);
        // drawPart(leftEye, true);
        // drawPart(leftEyeBrow, false);
        // drawPart(rightEye, true);
        // drawPart(rightEyeBrow, false);
        drawStar(leftEye, "L")
        drawStar(rightEye, "R")
    }

}

// 星を作成するクラスです
// 参考：p5.js example https://p5js.org/examples/form-star.html
class Star {
    constructor(x, y, radius1, radius2, npoints, LR) {
        this.x = x
        this.y = y
        // 星を打ち上げる速度をランダムに決定
        this.vy = (Math.random() + 1) * -10
        this.radius1 = radius1
        this.radius2 = radius2
        this.npoints = npoints
        // 星の色をランダムに決定
        this.color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255)
        // 逆の目の方向に星が飛ばないように
        if (LR === "L") {
            this.angleX = Math.random() * -10
        } else {
            this.angleX = Math.random() * 10
        }
    }

    draw() {
        let angle = TWO_PI / this.npoints;
        let halfAngle = angle / 2.0;
        fill(this.color)
        noStroke()
        // 星のシェイプを描画
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius2;
            let sy = this.y + sin(a) * this.radius2;
            vertex(sx, sy);
            sx = this.x + cos(a + halfAngle) * this.radius1;
            sy = this.y + sin(a + halfAngle) * this.radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);

        // 星を回転させながら落とす
        this.vy += 3
        this.y += this.vy
        this.x += this.angleX
    }
}

// 目の中心からStarを発生させます
function drawStar(eye, LR) {
    const center = getCenter(eye)
    const star = new Star(center.avgX, center.avgY, starSize / 3, starSize, 5, LR)
    stars.push(star)
    stars.forEach(star => {
        star.draw()
    })
    if (stars.length > 100) stars.shift()
}

// 顔の面積を星の大きさに変換します
function setStarSize(detection) {
    const alignedRect = detection.alignedRect;
    const boxWidth = alignedRect._box._width
    const boxHeight = alignedRect._box._height
    starSize = boxHeight / 10
}

// 複数の座標の中心を取得する関数です
function getCenter(arr) {
    const sumX = arr.reduce((sum, item) => sum + item._x, 0)
    const sumY = arr.reduce((sum, item) => sum + item._y, 0)
    const avgX = sumX / arr.length
    const avgY = sumY / arr.length
    return {avgX, avgY}
}


