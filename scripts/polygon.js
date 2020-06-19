
'use strict';


var triangle = {};
triangle.running = false;
triangle.canvas = document.getElementById('js-canvas-triangle');
triangle.ctx = triangle.canvas.getContext('2d');
triangle.ctx.lineCap = 'round';
triangle.canvasData = triangle.ctx.getImageData(0, 0, triangle.canvas.width, triangle.canvas.height);
triangle.vertices = [
          {'x': 100,'y': 400},
          {'x': 400,'y': 100},
          {'x': 700,'y': 400}
        ];
triangle.epochs = 1000;


var rectangle = {};
rectangle.running = false;
rectangle.canvas = document.getElementById('js-canvas-rectangle');
rectangle.ctx = rectangle.canvas.getContext('2d');
rectangle.ctx.lineCap = 'round';
rectangle.canvasData = rectangle.ctx.getImageData(0, 0, rectangle.canvas.width, rectangle.canvas.height);
rectangle.vertices = [
          {'x': 250,'y': 400},
          {'x': 550,'y': 400},
          {'x': 550,'y': 100},
          {'x': 250,'y': 100}
        ];
rectangle.epochs = 1000;


var pentagon = {};
pentagon.running = false;
pentagon.canvas = document.getElementById('js-canvas-pentagon');
pentagon.ctx = pentagon.canvas.getContext('2d');
pentagon.ctx.lineCap = 'round';
pentagon.canvasData = pentagon.ctx.getImageData(0, 0, pentagon.canvas.width, pentagon.canvas.height);
pentagon.vertices = [
          {'x': 200,'y': 225},
          {'x': 300,'y': 400},
          {'x': 500,'y': 400},
          {'x': 600,'y': 225},
          {'x': 400,'y': 100}
        ];
pentagon.epochs = 1000;


function getCursorPosition(event, canvas){
  var rect = canvas.getBoundingClientRect();
  var x = Math.floor(event.clientX - rect.left);
  var y = Math.floor(event.clientY - rect.top);
  console.log("x: " + x + " y: " + y);

  return {'x':x,'y':y}
}


function calcMidpoint(p1,p2){
  var midX = (p1.x+p2.x)/2;
  var midY = (p1.y+p2.y)/2;
  var midP = {'x':midX, 'y':midY};

  return midP;
}


function calcSlope(p1, p2) {
  return ( p2.y - p1.y ) / ( p2.x - p1.x );
}


// Calculate points moving from full line back to midpoint
// Assumes p1 is starting point and p2 is ending point
// Example:
// 1. *----*
// 2. *--- *
// 3. *--  *
function calcWaypoints(p1, p2, limit) {
  var waypoints = [];
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  for (var j = 0; j < limit; j++) {
      var x = p2.x - dx * j / limit;
      var y = p2.y - dy * j / limit;
      waypoints.push({
          'x': x,
          'y': y
      });
  }
  return (waypoints);
}


function drawByPoints(canvas, ctx, pointsArr, clear) {
  if (clear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  var pointsArrLen = pointsArr.length;

  ctx.beginPath();
  ctx.moveTo(pointsArr[0].x, pointsArr[0].y);
  for (var i = 1; i < pointsArrLen; i++) {
    ctx.lineTo(pointsArr[i].x, pointsArr[i].y);
  }
  ctx.lineTo(pointsArr[0].x, pointsArr[0].y);
  ctx.stroke();
}


// Define pixel
function drawPixel (canvas, ctx, canvasData, x, y, r, g, b, a) {
  var index = (x + y * canvas.width) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}


// Update canvas with new changes
function updateCanvas(ctx, canvasData) {
  ctx.putImageData(canvasData, 0, 0);
}


function run(point, polygonObj) {
  // Pixel color
  let r = 72;
  let g = 143;
  let b = 224;
  let a = 255;
  //console.log(polygonObj);
  if( !polygonObj.running ) {
    polygonObj.running = true;

    console.log('Epochs: '+polygonObj.epochs);
    var currentPoint = point;

    for (var i = 0; i < polygonObj.epochs; i++) {
      drawPixel(polygonObj.canvas, polygonObj.ctx, polygonObj.canvasData, currentPoint.x, currentPoint.y, r, g, b, a);

      var randomPolygonPoint = polygonObj.vertices[Math.floor(Math.random() * polygonObj.vertices.length)];
      currentPoint = calcMidpoint(currentPoint, randomPolygonPoint);
      var currentX = Math.floor(currentPoint.x);
      var currentY = Math.floor(currentPoint.y);
      currentPoint = {'x':currentX, 'y':currentY};
      //console.log(currentPoint);
    }
    updateCanvas(polygonObj.ctx, polygonObj.canvasData);
    drawByPoints(polygonObj.canvas, polygonObj.ctx, polygonObj.vertices, false);

    polygonObj.running = false;
  }
}



$('#js-btn-drawTriangle').click(function(event) {
  event.preventDefault();
  let numVertices = triangle.vertices.length;
  for (var i = 0; i < numVertices; i++) {
    triangle.vertices[i].x = Math.floor($('#js-input-triangle-x'+i).val());
    triangle.vertices[i].y = Math.floor($('#js-input-triangle-y'+i).val());
  }

  drawByPoints(triangle.canvas, triangle.ctx, triangle.vertices, true);
  });

  $('#js-canvas-triangle').click(function(event) {
  event.preventDefault()
  console.log(event);

  var mousePoint = getCursorPosition(event.originalEvent, triangle.canvas);

  triangle.epochs = $('#js-input-triangle-epochs').val();

  console.log(mousePoint);

  run(mousePoint, triangle);
});


$('#js-btn-drawRectangle').click(function(event) {
  event.preventDefault();

  let numVertices = rectangle.vertices.length;
  for (var i = 0; i < numVertices; i++) {
    rectangle.vertices[i].x = Math.floor($('#js-input-rectangle-x'+i).val());
    rectangle.vertices[i].y = Math.floor($('#js-input-rectangle-y'+i).val());
  }

  drawByPoints(rectangle.canvas, rectangle.ctx, rectangle.vertices, true);
});


$('#js-canvas-rectangle').click(function(event) {
  event.preventDefault()
  console.log(event);

  var mousePoint = getCursorPosition(event.originalEvent, rectangle.canvas);

  rectangle.epochs = $('#js-input-rectangle-epochs').val();

  console.log(mousePoint);

  run(mousePoint, rectangle);
});


$('#js-btn-drawPentagon').click(function(event) {
  event.preventDefault();

  let numVertices = pentagon.vertices.length;
  for (var i = 0; i < numVertices; i++) {
    pentagon.vertices[i].x = Math.floor($('#js-input-pentagon-x'+i).val());
    pentagon.vertices[i].y = Math.floor($('#js-input-pentagon-y'+i).val());
  }

  drawByPoints(pentagon.canvas, pentagon.ctx, pentagon.vertices, true);
});


$('#js-canvas-pentagon').click(function(event) {
  event.preventDefault()
  console.log(event);

  var mousePoint = getCursorPosition(event.originalEvent, pentagon.canvas);

  pentagon.epochs = $('#js-input-pentagon-epochs').val();

  console.log(mousePoint);

  run(mousePoint, pentagon);
});


drawByPoints(triangle.canvas, triangle.ctx, triangle.vertices, true);
drawByPoints(rectangle.canvas, rectangle.ctx, rectangle.vertices, true);
drawByPoints(pentagon.canvas, pentagon.ctx, pentagon.vertices, true);
