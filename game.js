// Initial setup
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const difficultyContainer = document.getElementById('difficulty-container');

let gameInterval;
let player;
let blocks = [];
let gameRunning = false;
let gameSpeed = 3;

// Canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player object
function Player() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 50;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
}

// Draw the player
Player.prototype.draw = function() {
    ctx.fillStyle = '#3498db'; // Blue color
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// Game block (falling object)
function Block() {
    this.x = Math.random() * (canvas.width - 30);
    this.y = -30;
    this.width = 30;
    this.height = 30;
    this.speed = gameSpeed;
}

// Draw the block
Block.prototype.draw = function() {
    ctx.fillStyle = 'red'; // Red color for the blocks
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// Start the game
function startGame() {
    gameRunning = true;
    player = new Player();
    blocks = [];
    gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    difficultyContainer.style.display = 'none';
}

// Update the game frame
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    // Add new blocks
    if (Math.random() < 0.02) {
        blocks.push(new Block());
    }

    // Move blocks
    blocks.forEach(block => {
        block.y += block.speed;
        block.draw();

        // Collision detection
        if (
            block.x < player.x + player.width &&
            block.x + block.width > player.x &&
            block.y < player.y + player.height &&
            block.y + block.height > player.y
        ) {
            endGame();
        }
    });

    // Remove off-screen blocks
    blocks = blocks.filter(block => block.y < canvas.height);

    // Player movement
    if (leftArrowPressed && player.x > 0) {
        player.x -= player.speed;
    }
    if (rightArrowPressed && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    restartButton.style.display = 'inline-block';
}

// Handle key events for player movement
let leftArrowPressed = false;
let rightArrowPressed = false;
window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') leftArrowPressed = true;
    if (event.key === 'ArrowRight') rightArrowPressed = true;
});
window.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft') leftArrowPressed = false;
    if (event.key === 'ArrowRight') rightArrowPressed = false;
});

// Restart the game
restartButton.addEventListener('click', function() {
    startGame();
    restartButton.style.display = 'none';
});

// Difficulty settings
difficultyButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.id === 'easy') {
            gameSpeed = 2;
        } else if (this.id === 'medium') {
            gameSpeed = 3;
        } else if (this.id === 'hard') {
            gameSpeed = 4;
        }
        startGame();
    });
});

// Start the game when the Start button is clicked
startButton.addEventListener('click', function() {
    startGame();
    difficultyContainer.style.display = 'none';
});
