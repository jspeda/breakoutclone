let ballX = 75;
let ballSpeedX = 5;
let ballY = 75;
let ballSpeedY = 7;

const brickW = 80;
const brickH = 20;
const brickGap = 2;
const brickCols = 10;
const brickRows = 14;

let bricksLeft = 0;

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

  // ballX = mouseX;
  // ballY = mouseY;
  // ballSpeedX = 4;
  // ballSpeedY = -4;
}

const brickReset = () => {
  bricksLeft = 0;

  for (var i = 0; i < 3 * brickCols; i++) {
    brickGrid[i] = false;
  }

  for (var i = 3 * brickCols; i < brickCols * brickRows; i++) {
    brickGrid[i] = true;
    bricksLeft++;
  }
};

window.onload = function() {
  canvas = document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  window.addEventListener('mousemove', updateMousePos);

  const start = document.querySelector('.start');

  const handler = (e) => {
    start.parentNode.removeChild(start);
    brickReset();
    ballReset();
    setInterval(updateAll, 1000/framesPerSecond);
    e.target.removeEventListener(e.tyle, arguments.callee);
  }

  start.addEventListener('click', handler)
}

const updateAll = () => {
  moveAll();
  drawAll();
}

const ballReset = () => {
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

const ballMove = () => {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX > canvas.width && ballSpeedX > 0) {
    ballSpeedX *= -1;
  }

  if (ballX < 0 && ballSpeedX < 0) {
    ballSpeedX *= -1;
  }

  if (ballY > canvas.height) {
    ballReset();
    brickReset();
  }

  if (ballY < 0 && ballSpeedY < 0) {
    ballSpeedY *= -1;
  }
}

const isBrickAtColRow = (col, row) => {
  if (col >= 0 && col < brickCols &&
      row >= 0 && row < brickRows) {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
      }
  else {
    return false;
  }
}

const ballBrickHandling = () => {
  let ballBrickCol = Math.floor(ballX / brickW);
  let ballBrickRow = Math.floor(ballY / brickH);
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
  // colorText(`${mouseBrickCol}, ${mouseBrickRow} : ${brickIndexUnderMouse}`, mouseX,mouseY, 'yellow');

  if (ballBrickCol >= 0 && ballBrickCol < brickCols &&
      ballBrickRow >= 0 && ballBrickRow < brickRows) {

        if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
          brickGrid[brickIndexUnderBall] = false;
          bricksLeft--;
          console.log(bricksLeft);

          let prevBallX = ballX - ballSpeedX;
          let prevBallY = ballY - ballSpeedY;
          let prevBrickCol = Math.floor(prevBallX / brickW);
          let prevBrickRow = Math.floor(prevBallY / brickH);

          let bothTestsFailed = true;

          if (prevBrickCol != ballBrickCol) {
            if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
              ballSpeedX *= -1;
              bothTestsFailed = false;
            }
          }

          if (prevBrickRow != ballBrickRow) {
            if (isBrickAtColRow(ballBrickCol, ballBrickRow) == false) {
              ballSpeedY *= -1;
              bothTestsFailed = false;
            }
          }

          if (bothTestsFailed) {
            ballSpeedX *= -1;
            ballSpeedY *= -1;
          }
        }
  }
}

const ballPaddleHandling = () => {
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

      if (bricksLeft == 0) {
        brickReset();
      }
    }
}

const moveAll = () => {
  ballMove();
  ballBrickHandling();
  ballPaddleHandling();
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
          brickW-brickGap, brickH-brickGap, 'pink')
      }
    })
  }
}

const drawAll = () => {
  colorRect(0,0, canvas.width, canvas.height, 'black');
  colorCircle(ballX,ballY, 10, '#24aadb');
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
