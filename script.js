// Get a reference to the document body
const { body } = document;

// Create a canvas element and get its 2D rendering context
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Set the canvas dimensions
const canvasWidth = 500;
const canvasHeight = 700;

// Get the screen width
const screenWidth = window.screen.width;

// Calculate the canvas position to center it horizontally
const canvasPosition = screenWidth / 2 - canvasWidth / 2;

// Check if the user is on a mobile device
const isMobile = window.matchMedia('(max-width: 600px)');

// Create a container for the game over message
const gameOverEl = document.createElement('div');

// Paddle settings
const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

// Ball settings
let ballX = 250;
let ballY = 350;
const ballRadius = 5;

// Speed and trajectory settings
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Set initial speed values based on whether it's a mobile device
if (isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

// Score tracking
let playerScore = 0;
let computerScore = 0;
const winningScore = 7;
let isGameOver = true;
let isNewGame = true;

// Function to render everything on the canvas
function renderCanvas() {
  // Fill the canvas with a pink background
  context.fillStyle = 'pink';
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set the drawing color to white

  // Draw the player's paddle (bottom)
  context.fillStyle = 'white';
  context.fillRect(paddleBottomX, canvasHeight - 20, paddleWidth, paddleHeight);

  // Draw the computer's paddle (top)
  context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

  // Draw a dashed center line
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, canvasHeight / 2);
  context.lineTo(canvasWidth, canvasHeight / 2);
  context.strokeStyle = 'grey';
  context.stroke();

  // Draw the ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  // Display the scores
  context.font = '32px Courier New';
  context.fillText(playerScore, 20, canvasHeight / 2 + 50);
  context.fillText(computerScore, 20, canvasHeight / 2 - 30);
}

// Function to create the canvas element
function createCanvas() {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  body.appendChild(canvas);
  renderCanvas();
}

// Function to reset the ball to the center
function ballReset() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  speedY = -3;
  paddleContact = false;
}

// Function to move the ball
function ballMove() {
  ballY += -speedY;
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

// Function to handle ball boundaries and collisions
function ballBoundaries() {
  // Bounce off the left wall
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Bounce off the right wall
  if (ballX > canvasWidth && speedX > 0) {
    speedX = -speedX;
  }
  // Check for collision with the player's paddle (bottom)
  if (ballY > canvasHeight - paddleDiff) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;
      if (playerMoved) {
        speedY -= 1;
        if (speedY < -5) {
          speedY = -5;
          computerSpeed = 6;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > canvasHeight) {
      // Reset the ball and add to the computer's score
      ballReset();
      computerScore++;
    }
  }
  // Check for collision with the computer's paddle (top)
  if (ballY < paddleDiff) {
    if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      if (playerMoved) {
        speedY += 1;
        if (speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
    } else if (ballY < 0) {
      // Reset the ball and add to the player's score
      ballReset();
      playerScore++;
    }
  }
}

// Function to control computer paddle movement
function computerAI() {
  if (playerMoved) {
    if (paddleTopX + paddleDiff < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}

// Function to display the game over message
function showGameOverEl(winner) {
  canvas.hidden = true;
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  const title = document.createElement('h1');
  title.textContent = `${winner} Wins!`;
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'startGame()');
  playAgainBtn.textContent = 'Play Again';
  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);
}

// Function to check if the game is over
function gameOver() {
  if (playerScore === winningScore || computerScore === winningScore) {
    isGameOver = true;
    const winner = playerScore === winningScore ? 'Player 1' : 'Computer';
    showGameOverEl(winner);
  }
}

// Function to animate the game
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();
  if (!isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

let selectedDifficulty = ''; // Variable to store the selected difficulty

// Function to show the difficulty selection modal
function showDifficultyModal() {
  const modal = document.getElementById('difficulty-modal');
  modal.style.display = 'block';

  // Add event listeners to the difficulty buttons
  document.getElementById('easy-btn').addEventListener('click', function () {
    selectedDifficulty = 'easy';
    modal.style.display = 'none';
    startGame(); // Start the game with the selected difficulty
  });

  document.getElementById('medium-btn').addEventListener('click', function () {
    selectedDifficulty = 'medium';
    modal.style.display = 'none';
    startGame(); // Start the game with the selected difficulty
  });

  document.getElementById('hard-btn').addEventListener('click', function () {
    selectedDifficulty = 'hard';
    modal.style.display = 'none';
    startGame(); // Start the game with the selected difficulty
  });
}


// Function to start the game and set up event listeners
function startGame() {
  if (isGameOver && !isNewGame) {
    body.removeChild(gameOverEl);
    canvas.hidden = false;
  }
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;
  ballReset();
  createCanvas();
  animate();

  // Add an event listener to track mouse movement for the player's paddle
  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    // Compensate for canvas being centered
    paddleBottomX = e.clientX - canvasPosition - paddleDiff;
    if (paddleBottomX < paddleDiff) {
      paddleBottomX = 0;
    }
    if (paddleBottomX > canvasWidth - paddleWidth) {
      paddleBottomX = canvasWidth - paddleWidth;
    }
    // Hide the cursor
    canvas.style.cursor = 'none';
  });

  if (selectedDifficulty === 'easy') {
    // Adjust game settings for easy difficulty
    speedY = -1;
    speedX = speedY;
    computerSpeed = 2;
  } else if (selectedDifficulty === 'medium') {
    // Adjust game settings for medium difficulty
    speedY = -1.5;
    speedX = speedY;
    computerSpeed = 3;
  } else if (selectedDifficulty === 'hard') {
    // Adjust game settings for hard difficulty
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
  }
}

// Function to display the game over message and difficulty selection modal
function showGameOverEl(winner) {
  canvas.hidden = true;
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  const title = document.createElement('h1');
  title.textContent = `${winner} Wins!`;
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'startGame()');
  playAgainBtn.textContent = 'Play Again';
  const selectDifficultyBtn = document.createElement('button');
  selectDifficultyBtn.setAttribute('onclick', 'showDifficultyModal()');
  selectDifficultyBtn.textContent = 'Select Difficulty';
  gameOverEl.append(title, playAgainBtn, selectDifficultyBtn);
  body.appendChild(gameOverEl);
}


// Start the game when the page loads
startGame();
showDifficultyModal();
