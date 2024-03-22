// Dodgewater

let isGamePaused = false;

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('mainMenu');
    const gameScreen = document.getElementById('gameScreen');
    const player = document.getElementById('player');
    const waterDropsContainer = document.getElementById('waterDropsContainer');
    const timerDisplay = document.getElementById('timer');
    let gameInterval = null;
    let isGameActive = false;
    let gameTime = 0;
    let timerInterval = null;

    

    document.getElementById('startGame').addEventListener('click', () => {
        mainMenu.style.display = 'none';
        gameScreen.style.display = 'flex';
        startGame();
    });

    document.getElementById('exitGame').addEventListener('click', () => {
        exitGame();
    });

    document.getElementById('pauseGame').addEventListener('click', () => {
        if (!isGameActive) return;
        
        isGamePaused = !isGamePaused;
    
        if (isGamePaused) {
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            document.removeEventListener('keydown', movePlayer);
            document.getElementById('pauseGame').textContent = 'Resume Game';
        } else {
            resumeWaterDrops();
            gameInterval = setInterval(dropWaterDrops, 1000);
            timerInterval = setInterval(updateTimer, 1000);
            document.addEventListener('keydown', movePlayer);
            document.getElementById('pauseGame').textContent = 'Pause Game';
        }
    });
    
    

    function startGame() {
        isGamePaused = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        isGameActive = true;
        resetGame();
        document.addEventListener('keydown', movePlayer);
        gameInterval = setInterval(dropWaterDrops, 1000);
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById('pauseGame').textContent = 'Pause Game';
    }

    function exitGame() {
        isGameActive = false;
        mainMenu.style.display = 'flex';
        gameScreen.style.display = 'none';
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        document.removeEventListener('keydown', movePlayer);
        resetGame();
    }
    

    function updateTimer() {
        if (!isGameActive) return;
        gameTime++;
        timerDisplay.textContent = `Time: ${gameTime}s`;
    }

    let leftPressed = false;
    let rightPressed = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
        if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
        if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
    });

    function continuousMovement() {
        if (!isGameActive || isGamePaused) return;

        if (leftPressed) movePlayer('left');
        if (rightPressed) movePlayer('right');
    }

    function movePlayer(direction) {
        const playerWidth = player.offsetWidth;
        const gameScreenWidth = gameScreen.offsetWidth;
        const playerLeftPosition = player.offsetLeft;
        let newLeftPosition = playerLeftPosition;

        if (direction === 'left') {
            newLeftPosition = Math.max(playerLeftPosition - 50, 0);
        } else if (direction === 'right') {
            newLeftPosition = Math.min(playerLeftPosition + 50, gameScreenWidth - playerWidth);
        }

        player.style.left = `${newLeftPosition}px`;
    }

    setInterval(continuousMovement, 100);

let waterDrops = [];

function dropWaterDrops() {
    if (!isGameActive || isGamePaused) return;

    const appContainerWidth = document.querySelector('.app-container').offsetWidth;
    const waterDropWidth = 50;
    const maxLeftPosition = appContainerWidth - waterDropWidth;

    const waterDrop = document.createElement('div');
    waterDrop.classList.add('waterDrop');
    waterDrop.style.left = `${Math.floor(Math.random() * maxLeftPosition)}px`; 
    waterDropsContainer.appendChild(waterDrop);
    waterDrops.push(waterDrop);
    
        let waterDropInterval = setInterval(() => {
            if (!isGameActive || isGamePaused) {
                clearInterval(waterDropInterval);
                if (isGamePaused) return;
                waterDrop.remove();
                return;
            }
    
            let additionalDistance = Math.min(gameTime, 50);
    
            waterDrop.style.top = `${waterDrop.offsetTop + 10 + additionalDistance}px`;
    
            if (waterDrop.offsetTop > window.innerHeight) {
                waterDrop.remove();
                clearInterval(waterDropInterval);
            } else if (isCollision(player, waterDrop)) {
                alert('Game Over!');
                exitGame();
            }
        }, 50);
    }

    function moveWaterDrops(waterDrop) {
        let moveInterval = setInterval(() => {
            if (!isGameActive || isGamePaused) {
                clearInterval(moveInterval);
                return;
            }
    
            let additionalDistance = Math.min(gameTime, 50);
            waterDrop.style.top = `${waterDrop.offsetTop + 10 + additionalDistance}px`;
    
            if (waterDrop.offsetTop > window.innerHeight || !isGameActive) {
                clearInterval(moveInterval);
                waterDrop.remove();
                waterDrops = waterDrops.filter(s => s !== waterDrop);
            }
        }, 50);
    }
    function resumeWaterDrops() {
        waterDrops.forEach(waterDrop => moveWaterDrops(waterDrop));
    }
    
    
    
    

    
    
    

    function isCollision(player, waterDrop) {
        const playerRect = player.getBoundingClientRect();
        const waterDropRect = waterDrop.getBoundingClientRect();
        return !(
            playerRect.top > waterDropRect.bottom ||
            playerRect.right < waterDropRect.left ||
            playerRect.bottom < waterDropRect.top ||
            playerRect.left > waterDropRect.right
        );
    }

    function resetGame() {
        waterDropsContainer.innerHTML = '';
        player.style.left = '50%';
        gameTime = 0;
        timerDisplay.textContent = 'Time: 0s';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w') {
            if (!isGameActive) return;
            
            isGamePaused = !isGamePaused;
        
            if (isGamePaused) {
                clearInterval(gameInterval);
                clearInterval(timerInterval);
                document.removeEventListener('keydown', movePlayer);
                document.getElementById('pauseGame').textContent = 'Resume Game';
            } else {
                resumeWaterDrops();
                gameInterval = setInterval(dropWaterDrops, 1000);
                timerInterval = setInterval(updateTimer, 1000);
                document.addEventListener('keydown', movePlayer);
                document.getElementById('pauseGame').textContent = 'Pause Game';
            }
        } else if (e.key === 'Escape') {
            if (!isGameActive) return;
            
            exitGame();
        }
    });    
});
