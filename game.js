const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2 - 15, y: canvas.height - 60, width: 30, height: 30 };
let missiles = [];
let keys = {};
let speed = 4;
let spawnRate = 800;
let missileInterval;
let animationId;
let isGameOver = false;
let difficulty = "medium";
let score = 0;

function selectDifficulty(level) {
  difficulty = level;
  switch (level) {
    case "easy": speed = 2; spawnRate = 1500; break;
    case "medium": speed = 4; spawnRate = 1000; break;
    case "hard": speed = 6; spawnRate = 600; break;
  }
  document.getElementById("startBtn").style.display = "inline-block";
}

function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawMissile(missile) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(missile.x, missile.y);
  ctx.lineTo(missile.x + 10, missile.y + 20);
  ctx.lineTo(missile.x - 10, missile.y + 20);
  ctx.closePath();
  ctx.fill();
}

function spawnMissile() {
  let count = difficulty === "hard" ? 10 : difficulty === "medium" ? 6 : 3;
  for (let i = 0; i < count; i++) {
    let x = Math.random() * (canvas.width - 20) + 10;
    missiles.push({ x: x, y: -Math.random() * 300 });
  }
}

function updateGame() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  score += 1;
  document.getElementById("scoreBoard").innerText = "Score: " + score;

  if ((keys["ArrowLeft"] || keys["a"]) && player.x > 0) player.x -= 6;
  if ((keys["ArrowRight"] || keys["d"]) && player.x + player.width < canvas.width) player.x += 6;

  drawPlayer();

  missiles.forEach((missile, index) => {
    missile.y += speed;
    drawMissile(missile);
    if (
      missile.x > player.x &&
      missile.x < player.x + player.width &&
      missile.y + 20 > player.y &&
      missile.y < player.y + player.height
    ) {
      endGame();
    }

    if (missile.y > canvas.height) {
      missiles.splice(index, 1);
    }
  });

  animationId = requestAnimationFrame(updateGame);
}

function startGame() {
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("difficultyPage").style.display = "none";
  player.x = canvas.width / 2 - 15;
  missiles = [];
  isGameOver = false;
  score = 0;
  document.getElementById("scoreBoard").innerText = "Score: 0";
  missileInterval = setInterval(spawnMissile, spawnRate);
  updateGame();
}

function restartGame() {
  clearInterval(missileInterval);
  cancelAnimationFrame(animationId);
  startGame();
}

function endGame() {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(missileInterval);
  document.getElementById("restartBtn").style.display = "block";
}

window.addEventListener("keydown", e => (keys[e.key] = true));
window.addEventListener("keyup", e => (keys[e.key] = false));


