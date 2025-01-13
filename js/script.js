const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Tamanho de cada célula
const canvasSize = 20; // Quantidade de células no canvas (20x20)
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * canvasSize) * box,
  y: Math.floor(Math.random() * canvasSize) * box,
};
let score = 0;

// Carregar imagens
const snakeImg = new Image();
snakeImg.src = "images/snake.png";

const foodImg = new Image();
foodImg.src = "images/food.png";

// Controle da cobra
document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Salvar pontuação no ranking
function saveScore(playerName, score) {
  let rankings = JSON.parse(localStorage.getItem("snakeRanking")) || [];
  
  rankings.push({ name: playerName, score: score });
  rankings.sort((a, b) => b.score - a.score);
  rankings = rankings.slice(0, 5); // Manter apenas os 5 melhores
  localStorage.setItem("snakeRanking", JSON.stringify(rankings));
}

// Exibir ranking
function displayRanking() {
  let rankings = JSON.parse(localStorage.getItem("snakeRanking")) || [];
  const rankingDiv = document.getElementById("ranking");
  rankingDiv.innerHTML = "<h3>Ranking dos Melhores Jogadores</h3>";
  
  if (rankings.length === 0) {
    rankingDiv.innerHTML += "<p>Nenhuma pontuação registrada ainda.</p>";
  } else {
    rankings.forEach((player, index) => {
      rankingDiv.innerHTML += `<p>${index + 1}. ${player.name} - ${player.score} pontos</p>`;
    });
  }
}

// Exibir o ranking ao carregar a página
displayRanking();

// Desenhar a comida
function drawFood() {
  ctx.drawImage(foodImg, food.x, food.y, box, box);
}

// Desenhar a cobra
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);
  }
}

// Desenhar o canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();

  let head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  if (
    head.x < 0 ||
    head.x >= canvasSize * box ||
    head.y < 0 ||
    head.y >= canvasSize * box ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(game);
    const playerName = prompt("Fim de jogo! Digite seu nome:");
    saveScore(playerName || "Jogador", score);
    displayRanking();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = `Pontuação: ${score}`;
    food = {
      x: Math.floor(Math.random() * canvasSize) * box,
      y: Math.floor(Math.random() * canvasSize) * box,
    };
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

let game = setInterval(draw, 100);
