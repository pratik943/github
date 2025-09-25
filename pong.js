const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 12, paddleHeight = 90;
const ballRadius = 10;

// Paddle positions
let leftPaddleY = canvas.height/2 - paddleHeight/2;
let rightPaddleY = canvas.height/2 - paddleHeight/2;

// Ball position & velocity
let ballX = canvas.width/2, ballY = canvas.height/2;
let ballSpeedX = 5, ballSpeedY = 3;

// Scores
let playerScore = 0, computerScore = 0;

// Mouse control
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - paddleHeight/2;
  leftPaddleY = Math.max(0, Math.min(canvas.height-paddleHeight, leftPaddleY));
});

// Keyboard control
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') {
    leftPaddleY = Math.max(0, leftPaddleY - 30);
  }
  if (e.key === 'ArrowDown') {
    leftPaddleY = Math.min(canvas.height - paddleHeight, leftPaddleY + 30);
  }
});

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); // Left paddle
  ctx.fillRect(canvas.width-paddleWidth, rightPaddleY, paddleWidth, paddleHeight); // Right paddle

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  ctx.fill();

  // Draw center line
  ctx.strokeStyle = "#555";
  ctx.setLineDash([6]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  moveBall();
  moveComputer();
  updateScoreboard();
  requestAnimationFrame(draw);
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom wall collision
  if (ballY-ballRadius < 0 || ballY+ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle collision
  if (ballX-ballRadius < paddleWidth) {
    if (ballY > leftPaddleY && ballY < leftPaddleY+paddleHeight) {
      ballSpeedX = -ballSpeedX;
      // add spin based on hit position
      let hitPos = (ballY - (leftPaddleY + paddleHeight/2)) / (paddleHeight/2);
      ballSpeedY += hitPos * 2;
    } else if (ballX-ballRadius < 0) {
      // Computer scores
      computerScore++;
      resetBall();
    }
  }

  // Right paddle collision
  if (ballX+ballRadius > canvas.width-paddleWidth) {
    if (ballY > rightPaddleY && ballY < rightPaddleY+paddleHeight) {
      ballSpeedX = -ballSpeedX;
      let hitPos = (ballY - (rightPaddleY + paddleHeight/2)) / (paddleHeight/2);
      ballSpeedY += hitPos * 2;
    } else if (ballX+ballRadius > canvas.width) {
      // Player scores
      playerScore++;
      resetBall();
    }
  }
}

function moveComputer() {
  // Simple AI: follow the ball
  let target = ballY - paddleHeight/2;
  if (rightPaddleY < target) {
    rightPaddleY += Math.min(6, target - rightPaddleY);
  } else if (rightPaddleY > target) {
    rightPaddleY -= Math.min(6, rightPaddleY - target);
  }
  // Clamp position
  rightPaddleY = Math.max(0, Math.min(canvas.height-paddleHeight, rightPaddleY));
}

function resetBall() {
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = (Math.random() > 0.5 ? 5 : -5);
  ballSpeedY = (Math.random()-0.5) * 6;
}

function updateScoreboard() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
}

// Start game
draw();