let ballX = 75;
let ballSpeedX = 5;
let ballY = 75;
let ballSpeedY = 7;

const brickW = 80;
const brickH = 20;
const brickGap = 2;
const brickCols = 10;
const brickRows = 14;

let brickGrid = [];

let canvas, canvasContext;

let mouseX, mouseY;

const paddleWidth = 100;
const paddleThickness = 10;
const paddleDistFromEdge = 60;
let paddleX = 400;

const updateMousePos = (e) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  mouseX = e.clientX - rect.left - root.scrollLeft;
  mouseY = e.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - paddleWidth / 2;
}

const brickReset = () => {
  for (var i = 0; i < brickCols * brickRows; i++) {
    brickGrid[i] = true;
  }
  // brickGrid[10] = false;
};

window.onload = function() {
  canvas = document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', updateMousePos);

  brickReset();
}

const updateAll = () => {
  moveAll();
  drawAll();
}

const ballReset = () => {
  ballX = canvas.width/2;
  ballY = canvas.height/2;
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
    ballReset();
    ballSpeedY *= -1;
  }

  if (ballY < 0) {
    ballSpeedY *= -1;
  }

  let ballBrickCol = Math.floor(ballX / brickW);
  let ballBrickRow = Math.floor(ballY / brickH);
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
  // colorText(`${mouseBrickCol}, ${mouseBrickRow} : ${brickIndexUnderMouse}`, mouseX,mouseY, 'yellow');

  if (brickIndexUnderBall >= 0 &&
      brickIndexUnderBall < brickCols * brickRows) {
        brickGrid[brickIndexUnderBall] = false;
      }

  let paddleTopEdgeY = canvas.height - paddleDistFromEdge;
  let paddleBottomEdgeY = paddleTopEdgeY + paddleThickness;
  let paddleLeftEdgeX = paddleX;
  let paddleRightEdgeX = paddleX + paddleWidth;

  if (
      ballY > paddleTopEdgeY && // below top
      ballY < paddleBottomEdgeY && // above bottom
      ballX > paddleLeftEdgeX && // right of left edge
      ballX < paddleRightEdgeX // left of right edge
    ) {
      ballSpeedY *= -1;

      let centerOfPaddleX = paddleX + paddleWidth / 2;
      let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
      ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    }
}

const rowColToArrayIndex = (col, row) => {
  return col + brickCols * row;
}

const drawBricks = () => {

for (let eachRow = 0; eachRow < brickRows; eachRow++) {
  brickGrid.map((brick, index) => {
    let arrayIndex = rowColToArrayIndex(index, eachRow);
    if (brickGrid[arrayIndex]) {
      colorRect(brickW*index, brickH*eachRow,
        brickW-brickGap, brickH-brickGap, 'blue')
    }
  })
}
  // brickGrid.map((brick, index) => {
  //   if (brickGrid[index]) {
  //     colorRect(brickW*index,0, brickW-brickGap,brickH, 'blue')
  //   }
  // })
}

const drawAll = () => {
  colorRect(0,0, canvas.width, canvas.height, 'black');
  colorCircle(ballX,ballY, 10, 'pink');
  colorRect(paddleX,(canvas.height - paddleDistFromEdge), paddleWidth, paddleThickness, 'white');

  drawBricks();
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

const colorText = (showWords, textX,textY, fillColor) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX,textY);
}
