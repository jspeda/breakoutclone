let ballX = 75;
let ballSpeedX = 5;
let ballY = 75;
let ballSpeedY = 7;
let canvas;
let canvasContext;

window.onload = function() {
  canvas = document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

}

const updateAll = () => {
  moveAll();
  drawAll();
}

const moveAll = () => {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX > canvas.width) {
    ballSpeedX *= -1;
  }

  if (ballX < 0) {
    ballSpeedX *= -1;
  }

  if (ballY > canvas.height) {
    ballSpeedY *= -1;
  }

  if (ballY < 0) {
    ballSpeedY *= -1;
  }
}

const drawAll = () => {
  colorRect(0,0, canvas.width, canvas.height, 'black');
  colorCircle(ballX,ballY, 10, 'pink');
}

const colorRect = (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

const colorCircle = (centerX,centerY, radius, fillColor) => {
  console.log(`x: ${ballX}, y: ${ballY}`);
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill();
}
