const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuração do jogo
const box = 30; 
const canvasSize = 20;
canvas.width = box * canvasSize;
canvas.height = box * canvasSize;

// Estado do jogo
let snake, cpuSnake, food, direction, cpuDirection, score, gameMode, playerName;

// Inicialização do jogo com base no modo selecionado
function startGame(mode) {
  playerName = document.getElementById("playerName").value.trim() || "Jogador";
  gameMode = mode;
  snake = [{ x: 9 * box, y: 9 * box }];
  cpuSnake = mode === "vsCPU" ? [{ x: 5 * box, y: 5 * box }] : [];
  direction = "RIGHT";
  cpuDirection = "LEFT";
  score = 0;
  document.getElementById("score").innerText = `Pontuação: ${score}`;
  food = generateFood();
  document.getElementById("menu").style.display = "none";
  gameLoop();
}

// Gera nova comida
function generateFood() {
  return {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
  };
}

// Controle do jogador
document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Movimento da CPU em direção à comida
function moveCPU() {
  let head = { x: cpuSnake[0].x, y: cpuSnake[0].y };
  if (head.x < food.x) cpuDirection = "RIGHT";
  else if (head.x > food.x) cpuDirection = "LEFT";
  else if (head.y < food.y) cpuDirection = "DOWN";
  else if (head.y > food.y) cpuDirection = "UP";

  if (cpuDirection === "UP") head.y -= box;
  if (cpuDirection === "DOWN") head.y += box;
  if (cpuDirection === "LEFT") head.x -= box;
  if (cpuDirection === "RIGHT") head.x += box;

  cpuSnake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
  } else {
    cpuSnake.pop();
  }
}

// Lógica principal do jogo
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar a cobra do jogador
  ctx.fillStyle = "green";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Desenhar a cobra da CPU (caso esteja ativa)
  if (gameMode === "vsCPU") {
    ctx.fillStyle = "blue";
    cpuSnake.forEach(segment => {
      ctx.fillRect(segment.x, segment.y, box, box);
    });
  }

  // Desenhar a comida
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Movimentação da cobra do jogador
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // Verificar colisão com bordas ou corpo
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  // Verificar se comeu a comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = `Pontuação: ${score}`;
    food = generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);

  // Movimentação da CPU (se ativada)
  if (gameMode === "vsCPU") moveCPU();

  setTimeout(gameLoop, 150);
}

// Fim do jogo e salvamento no ranking
function endGame() {
  saveScore(playerName, score);
  displayRanking();
  alert(`Game Over! ${playerName}, sua pontuação foi: ${score}`);
  location.reload();
}

// Salvar pontuação no ranking
function saveScore(player, score) {
  let rankings = JSON.parse(localStorage.getItem("snakeRanking")) || [];
  rankings.push({ name: player, score: score });
  rankings.sort((a, b) => b.score - a.score);
  rankings = rankings.slice(0, 5);
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

// Exibir ranking ao carregar a página
window.onload = displayRanking;
