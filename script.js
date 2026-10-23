const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreVal = document.getElementById("score-val");
const overlay = document.getElementById("game-overlay");
const overlayText = document.getElementById("overlay-text");
const gameStage = document.getElementById("game-stage");
const fullscreenBtn = document.getElementById("fullscreen-btn");

let isJumping = false;
let isPlaying = false;
let score = 0;
let gameLoopInterval;
let cactusPosition = -20;
let cactusSpeed = 5;

// Inicializa ou reinicia o jogo
function startGame() {
    isPlaying = true;
    score = 0;
    cactusSpeed = 6;
    cactusPosition = 600;
    scoreVal.innerText = score;
    overlay.style.display = "none";
    
    // Reseta classes
    dino.classList.remove("jump");
    isJumping = false;

    // Loop principal do jogo executado a cada 16ms (~60fps)
    gameLoopInterval = setInterval(() => {
        moveCactus();
        checkCollision();
    }, 16);
}

// Controla o movimento do cacto
function moveCactus() {
    // Se estiver em tela cheia, o limite da tela muda dinamicamente
    const stageWidth = gameStage.clientWidth;
    
    cactusPosition -= cactusSpeed;
    
    if (cactusPosition < -20) {
        cactusPosition = stageWidth; // Renasce no final da tela
        score += 1;
        scoreVal.innerText = score;
        
        // Aumenta a velocidade gradualmente a cada obstáculo passado
        if (cactusSpeed < 15) cactusSpeed += 0.5;
    }
    
    cactus.style.left = cactusPosition + "px";
}

// Faz o dinossauro pular
function jump() {
    if (isJumping || !isPlaying) return;
    
    isJumping = true;
    dino.style.animation = "jump-anim 500ms linear";
    
    setTimeout(() => {
        dino.style.animation = "none";
        isJumping = false;
    }, 500);
}

// Checa se o dinossauro bateu no cacto
function checkCollision() {
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    const dinoLeft = parseInt(window.getComputedStyle(dino).getPropertyValue("left"));
    const dinoRight = dinoLeft + 40;
    
    const cactusLeft = cactusPosition;
    const cactusRight = cactusPosition + 20;
    const cactusHeight = 40;

    // Lógica de intersecção das caixas de colisão (Hitbox)
    if (cactusLeft < dinoRight && cactusRight > dinoLeft && dinoBottom < cactusHeight) {
        gameOver();
    }
}

// Finaliza a partida
function gameOver() {
    isPlaying = false;
    clearInterval(gameLoopInterval);
    overlayText.innerText = "Game Over! Pressione ESPAÇO";
    overlay.style.display = "flex";
}

// Ouvinte de teclado para comandos do jogador
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!isPlaying) {
            startGame();
        } else {
            jump();
        }
        // Evita que a página role para baixo ao apertar espaço
        event.preventDefault();
    }
});

// Ativa o modo Tela Cheia apenas no elemento do jogo
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        gameStage.requestFullscreen().catch(err => {
            alert(`Erro ao ativar tela cheia: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});
