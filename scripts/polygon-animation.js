
'use strict';

var frameCount = 0;
var animateCtx = null;
var animateIndex = null;
var animateStartPoint = null;
var animateMidpoint = null;
var animatePoints = null;
var animateCanvasWidth = null;
var animateCanvasHeight = null;
var animateSpeeds = [100, 50, 25, 10, 5];
var animateSpeedIndex = 0;

var animatedtriangle = {};
animatedtriangle.running = true;
animatedtriangle.canvas_lower = document.getElementById('js-canvas-triangle-example-lower');
animatedtriangle.ctx_lower = animatedtriangle.canvas_lower.getContext('2d');
animatedtriangle.ctx_lower.lineCap = "round";
animatedtriangle.canvasData_lower = animatedtriangle.ctx_lower.getImageData(0, 0, animatedtriangle.canvas_lower.width, animatedtriangle.canvas_lower.height);
animatedtriangle.canvas_upper = document.getElementById('js-canvas-triangle-example-upper');
animatedtriangle.ctx_upper = animatedtriangle.canvas_upper.getContext('2d');
animatedtriangle.ctx_upper.lineCap = "round";
animatedtriangle.canvasData_upper = animatedtriangle.ctx_upper.getImageData(0, 0, animatedtriangle.canvas_upper.width, animatedtriangle.canvas_upper.height);
animatedtriangle.vertices = [
          {'x': 100,'y': 350},
          {'x': 400,'y': 50},
          {'x': 700,'y': 350}
        ];
animatedtriangle.epochs = 5000;


function runAnimatedTriangle() {
  var xMin = 100;
  var xMax = 700;
  var yMin = null;
  var yMax = 350;
  var xRand = null;
  var yRand = null;

  xRand = Math.floor(Math.random() * (xMax - xMin)) + xMin;

  var p_1 = animatedtriangle.vertices[0];
  var p_2 = animatedtriangle.vertices[1];
  var p_3 = animatedtriangle.vertices[2];

  var slope_1 = calcSlope( p_1, p_2 );
  var yMin_1 = slope_1*(xRand - p_1.x) + p_1.y;

  // we don't really need to check this because this line is just the inverse of the other, but why not
  var slope_2 = calcSlope( p_2, p_3 );
  var yMin_2 = slope_2*(xRand - p_2.x) + p_2.y;

  if ( yMin_1 >= yMin_2 ){
    yMin = yMin_1;
  } else {
    yMin = yMin_2;
  }

  yRand = Math.floor(Math.random() * (yMax - yMin)) + yMin;

  console.log('points');
  console.log(animatedtriangle.vertices);
  console.log('xRand: '+xRand);
  console.log('yMin: '+yMin)
  console.log('yRand: '+yRand)


  // There are two canvas elements on top of eachother.
  // lower canvas has all static data: triangle and points.
  // upper canvas handles animation.

  // Draw Triangle
  drawByPoints(animatedtriangle.canvas_lower, animatedtriangle.ctx_lower, animatedtriangle.vertices, false);
  animatedtriangle.ctx_lower.fillStyle = '#e69af7';

  // Draw the Random Starting point. It's 3x3 pixel rectangle vs 1x1 so it's ease to see;
  animatedtriangle.ctx_lower.fillRect(xRand-2,yRand-2,4,4);

  // Set color for all other points
  animatedtriangle.ctx_lower.fillStyle = '#488fe0';

  var currentPoint = {'x':xRand, 'y':yRand};
  var randomPolygonVertex = animatedtriangle.vertices[Math.floor(Math.random() * animatedtriangle.vertices.length)];

  var midpoint = calcMidpoint(currentPoint, randomPolygonVertex);

  animateCtx = animatedtriangle.ctx_upper;
  animateIndex = 0;
  animateStartPoint = randomPolygonVertex;
  animateMidpoint = midpoint;
  animatePoints = calcWaypoints(midpoint, currentPoint, 100);
  animateCanvasWidth = animatedtriangle.canvas_upper.width;
  animateCanvasHeight = animatedtriangle.canvas_upper.height;

  // Animation line color
  animateCtx.strokeStyle = '#37f1ac';
  animate();

}


function animateTriangleExample() {

  animatedtriangle.ctx_lower.fillRect(animateMidpoint.x,animateMidpoint.y,1,1);


  if ( animatedtriangle.running && (animateIndex < animatedtriangle.epochs)) {
    animateIndex++;
    var randomPolygonVertex = animatedtriangle.vertices[Math.floor(Math.random() * animatedtriangle.vertices.length)];
    var currentPoint = animateMidpoint;
    var midpoint = calcMidpoint(animateMidpoint, randomPolygonVertex);
    animateStartPoint = randomPolygonVertex;
    animateMidpoint = midpoint;
    animatePoints = calcWaypoints(midpoint, currentPoint, animateSpeeds[animateSpeedIndex]);
    animate();
  } else {
    $('#js-canvas-triangle-example-upper').addClass('invisible');
  }
}


function animate() {
    if (frameCount < animatePoints.length) {
        requestAnimationFrame(animate);
    } else {
      frameCount = 0;
      animateTriangleExample();
    }

    animateCtx.clearRect(0, 0, animateCanvasWidth, animateCanvasHeight);

    animateCtx.font = "30px Arial";
    animateCtx.fillText(animateIndex,10,33);
    var speed = 100/animateSpeeds[animateSpeedIndex];
    animateCtx.fillText('x '+speed,animateCanvasWidth-65,33);
    // draw a line segment from the last waypoint
    // to the current waypoint
    animateCtx.beginPath();
    //ctx.moveTo(points[t - 1].x, points[t - 1].y);
    animateCtx.moveTo(animateStartPoint.x, animateStartPoint.y);
    animateCtx.lineTo(animatePoints[frameCount].x, animatePoints[frameCount].y);
    animateCtx.stroke();
    animateCtx.closePath();
    // increment "t" to get the next waypoint
    frameCount++;
}


$('#js-btn-triangle-animated-play').click(function(event) {
  event.preventDefault();
  if (!animatedtriangle.running) {
    animatedtriangle.running = true;
    animateTriangleExample();
    $('#js-canvas-triangle-example-upper').removeClass('invisible');
  }
});

$('#js-btn-triangle-animated-pause').click(function(event) {
  event.preventDefault();
  if (animatedtriangle.running) {
    animatedtriangle.running = false;
  }
});

$('#js-btn-triangle-animated-step-backward').click(function(event) {
  event.preventDefault();
  if (animateSpeedIndex > 0) {
    animateSpeedIndex--;
  }
});

$('#js-btn-triangle-animated-step-forward').click(function(event) {
  event.preventDefault();
  if (animateSpeedIndex < animateSpeeds.length-1) {
    animateSpeedIndex++;
  }
});

runAnimatedTriangle();
