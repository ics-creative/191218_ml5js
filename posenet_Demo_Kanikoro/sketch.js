// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let kanikoro

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  kanikoro = loadImage("./kanikoro.png")

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  drawKanikoroR()
  drawKanikoroL()
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// 右手のかにクリームコロッケ
function drawKanikoroR() {
  console.log(poses)
  for(let i = 0; i < poses.length; i++) {
    const rightWrist = poses[i].pose.rightWrist
    const rightWristVector = createVector(rightWrist.x, rightWrist.y)
    const rightElbow = poses[i].pose.rightElbow
    const rightElbowVector = createVector(rightElbow.x, rightElbow.y)
    const rightHandVector = createVector(rightWristVector.x - rightElbowVector.x, rightWristVector.y - rightElbowVector.y)

    const dx = rightWristVector.x - rightElbowVector.x
    const dy = rightWristVector.y - rightElbowVector.y

    const angle = atan(-dx/dy)
    push()
    translate(rightWrist.x + rightHandVector.x /10, rightWrist.y + rightHandVector.y/10)
    rotate(angle)
    image(kanikoro, -75, -150, 150, 250)
    pop()
  }
}

// 左手のかにクリームコロッケ
function drawKanikoroL() {
  for(let i = 0; i < poses.length; i++) {

    const leftWrist = poses[i].pose.leftWrist
    const leftWristVector = createVector(leftWrist.x, leftWrist.y)
    const leftElbow = poses[i].pose.leftElbow
    const leftElbowVector = createVector(leftElbow.x, leftElbow.y)

    const leftHandVector = createVector(leftWristVector.x - leftElbowVector.x, leftWristVector.y - leftElbowVector.y)

    const dx = leftWristVector.x - leftElbowVector.x
    const dy = leftWristVector.y - leftElbowVector.y

    const angle = atan(-dx/dy)

    push()
    translate(leftWrist.x + leftHandVector.x /10, leftWrist.y + leftHandVector.y/10)
    rotate(angle)
    image(kanikoro, -75, -150, 150, 250)
    pop()
  }
}
