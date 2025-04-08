
        // Lista de canciones para el juego (10 ejemplos)
        const gameMusicList = [
            'canciones/nobody.mp3',
            'canciones/telepatia.mp3',
            'canciones/youlose.mp3',
            'canciones/lovemyway.mp3',
            'canciones/oblivion.mp3',
            'canciones/invisible.mp3',
            'canciones/thelook.mp3',
            'canciones/360.mp3',
            'canciones/debaser.mp3',
            'canciones/balloon.mp3'
        ];

        // Lista de fondos para el juego (10 ejemplos)
        const backgroundImages = [
            'fondos/sportin2.png',
            'fondos/Lago_ranco.jpg',
            'fondos/polloshermano.png',
            'fondos/3.jpeg',
            'fondos/4.jpeg',
            'fondos/5.jpeg',
            'fondos/6.jpeg',
            'fondos/7.jpg',
            'fondos/8.png',
            'fondos/sf.jpg'
        ];

        const config = {
    initialSpeed: 1.5,
    speedIncrease: 0.8,
    speedIncreaseInterval: 30000,
    baseSpawnInterval: 1500,
    minSpawnInterval: 400,
    beerPoints: 20,
    eristoffPoints: -25,
    lifePoints: 1,
    beerMissPenalty: -15,
    maxLives: 5,
    difficultyThresholds: [100, 250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000],
    avatarMoodThresholds: {
        veryHappy: 50,
        happy: 20,
        neutral: 0,
        sad: -10,
        angry: -20
    },
    baseProbabilities: {
        mistralnegra: 0.60,
        eskudoroja: 0.05,
        eristoff: 0.20,
        doragua: 0.007,
        cumpleto: 0.001,
        cogollo: 0.0003
    },
    difficultyIncrease: {
        eristoff: 0.08,
        doragua: 0.002,
        cumpleto: 0.0004,
        cogollo: 0.001
    },
    lifeAdjustment: {
        cumpleto: 0.05
    },
    bonusDuration: { min: 10000, max: 20000 },
    bonusSpawnInterval: 200,
    cooldownDuration: 4000,
    cooldownSpeedMultiplier: 0.7,
    cooldownWarningTime: 5000
}; // <-- ¡No agregues nada después de esta línea!

        // Estado del juego
        const gameState = {
            score: 0,
            lives: config.maxLives,
            speed: config.initialSpeed,
            isGameOver: false,
            isGamePaused: false,
            objects: [],
            lastSpawnTime: 0,
            lastSpeedIncreaseTime: 0,
            lastMoodChange: 0,
            difficultyLevel: 1,
            spawnInterval: config.baseSpawnInterval,
            playerName: "",
            gameStartTime: 0,
            musicEnabled: true,
            isBonusActive: false,
            originalSpeed: 0,
            originalSpawnInterval: 0,
            isCooldownActive: false,
            discoLights: [],
            lastTastyShow: 0,
            currentMusicIndex: 0,
            cooldownWarningShown: false
        };

        // Elementos del DOM
        const mainMenu = document.getElementById('main-menu');
        const startBtn = document.getElementById('start-btn');
        const scoresBtn = document.getElementById('scores-btn');
        const scoreboard = document.getElementById('scoreboard');
        const backBtn = document.getElementById('back-btn');
        const scoresBody = document.getElementById('scores-body');
        const playerNameInput = document.getElementById('player-name-input');
        const nameInput = document.getElementById('name-input');
        const nameSubmit = document.getElementById('name-submit');

        const gameContainer = document.getElementById('game-container');
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');
        const difficultyElement = document.getElementById('difficulty');
        const messageBox = document.getElementById('message-box');
        const messageText = document.getElementById('message-text');
        const gameOverScreen = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const restartBtn = document.getElementById('restart-btn');
        const menuBtn = document.getElementById('menu-btn');
        const avatar = document.getElementById('avatar');
        const avatarContainer = document.getElementById('avatar-container');
        const toggleMusicBtn = document.getElementById('toggle-music');
        const bonusScreen = document.getElementById('bonus-screen');
        const bonusTitle = document.getElementById('bonus-title');
        const bonusSubtitle = document.getElementById('bonus-subtitle');
        const endBonusScreen = document.getElementById('end-bonus-screen');
        const endBonusTitle = document.getElementById('end-bonus-title');
        const endBonusSubtitle = document.getElementById('end-bonus-subtitle');
        const tastyCharacter = document.getElementById('tasty-character');
        const cooldownBar = document.getElementById('cooldown-bar');
        const cooldownProgress = document.getElementById('cooldown-progress');
        const clockIcon = document.getElementById('clock-icon');

        // Elementos de audio
        const menuMusic = document.getElementById('menu-music');
        const gameMusic = document.getElementById('game-music');
        const clickSound = document.getElementById('click-sound');
        const beerCatchSound = document.getElementById('beer-catch-sound');
        const badClickSound = document.getElementById('bad-click-sound');
        const lifeUpSound = document.getElementById('life-up-sound');
        const beerMissSound = document.getElementById('beer-miss-sound');
        const gameOverSound = document.getElementById('game-over-sound');
        const bonusSound = document.getElementById('bonus-sound');
        const tastySound = document.getElementById('tasty-sound');
        const clockTickSound = document.getElementById('clock-tick-sound');

        // Tipos de objetos
        const objectTypes = [
            {
                type: 'mistralnegra',
                image: 'mistralice.png',
                baseWeight: config.baseProbabilities.mistralnegra
            },
            {
                type: 'eskudoroja',
                image: 'escudo.png',
                baseWeight: config.baseProbabilities.eskudoroja
            },
            {
                type: 'eristoff',
                image: 'vodka.png',
                baseWeight: config.baseProbabilities.eristoff
            },
            {
                type: 'doragua',
                image: 'dorada.png',
                baseWeight: config.baseProbabilities.doragua
            },
            {
                type: 'cumpleto',
                image: 'completo.png',
                baseWeight: config.baseProbabilities.cumpleto
            },
            {
                type: 'cogollo',
                image: 'cogollo.png',
                baseWeight: config.baseProbabilities.cogollo
            }
        ];

        // Inicializar el juego
        function initGame() {
            gameState.score = 0;
            gameState.lives = config.maxLives;
            gameState.speed = config.initialSpeed;
            gameState.isGameOver = false;
            gameState.isGamePaused = false;
            gameState.objects = [];
            gameState.lastSpawnTime = 0;
            gameState.lastSpeedIncreaseTime = Date.now();
            gameState.lastMoodChange = 0;
            gameState.difficultyLevel = 1;
            gameState.spawnInterval = config.baseSpawnInterval;
            gameState.gameStartTime = Date.now();
            gameState.isBonusActive = false;
            gameState.isCooldownActive = false;
            gameState.lastTastyShow = 0;
            gameState.currentMusicIndex = 0;
            gameState.cooldownWarningShown = false;

            // Limpiar objetos existentes
            document.querySelectorAll('.falling-object').forEach(el => el.remove());

            // Limpiar luces de discoteca
            gameState.discoLights.forEach(light => light.remove());
            gameState.discoLights = [];

            // Resetear avatar
            updateAvatarMood();

        

            // Actualizar UI
            updateUI();
            gameOverScreen.style.display = 'none';
            bonusScreen.style.display = 'none';
            endBonusScreen.style.display = 'none';
            tastyCharacter.style.display = 'none';
            cooldownBar.style.display = 'none';
            clockIcon.style.display = 'none';

            // Configurar música del juego (aleatoria)
            gameState.currentMusicIndex = Math.floor(Math.random() * gameMusicList.length);
            gameMusic.src = gameMusicList[gameState.currentMusicIndex];

            // Configurar fondo inicial
            gameContainer.style.backgroundImage = `url('${backgroundImages[0]}')`;

            // Iniciar música del juego
            if (gameState.musicEnabled) {
                gameMusic.play().catch(e => console.log("No se pudo reproducir música automáticamente:", e));
            }

            // Iniciar bucle del juego
            requestAnimationFrame(gameLoop);
        }

        // Bucle principal del juego
        function gameLoop(timestamp) {
            if (gameState.isGameOver || gameState.isGamePaused) {
                // Si el juego está pausado o terminado, solo solicita el siguiente frame
                requestAnimationFrame(gameLoop);
                return;
            }

            // Mostrar personaje Tasty cada 2000 puntos
            if (gameState.score > 0 && gameState.score % 2000 === 0 &&
                timestamp - gameState.lastTastyShow > 5000) {
                showTastyCharacter();
                gameState.lastTastyShow = timestamp;
            }

            // Ajustar dificultad basada en el puntaje
            updateDifficulty();

            // Generar nuevos objetos
            if (timestamp - gameState.lastSpawnTime > gameState.spawnInterval) {
                spawnObject();
                gameState.lastSpawnTime = timestamp;
            }

            // Aumentar dificultad con el tiempo (excepto durante bonus o cooldown)
            if (!gameState.isBonusActive && !gameState.isCooldownActive &&
                timestamp - gameState.lastSpeedIncreaseTime > config.speedIncreaseInterval) {
                gameState.speed += config.speedIncrease;
                gameState.lastSpeedIncreaseTime = timestamp;
                showMessage(`¡La velocidad aumenta! (${gameState.speed.toFixed(1)})`, 'warning');
            }

            // Mover objetos
            moveObjects();

            // Verificar colisiones con el suelo
            checkFloorCollisions();

            // Verificar si debemos mostrar advertencia de cooldown
            if (!gameState.isBonusActive && !gameState.isCooldownActive && !gameState.cooldownWarningShown &&
                timestamp - gameState.lastSpeedIncreaseTime > config.speedIncreaseInterval - config.cooldownWarningTime) {
                showMessage("¡Prepárate! El descanso comienza pronto", 'info');
                gameState.cooldownWarningShown = true;
            }

            // Continuar el bucle
            requestAnimationFrame(gameLoop);
        }

        // Actualizar la dificultad del juego
        function updateDifficulty() {
            // Calcular nivel de dificultad basado en el puntaje
            const newLevel = config.difficultyThresholds.reduce((level, threshold, index) => {
                return gameState.score >= threshold ? index + 2 : level;
            }, 1);

            if (newLevel !== gameState.difficultyLevel) {
                gameState.difficultyLevel = newLevel;
                difficultyElement.textContent = `Nivel: ${gameState.difficultyLevel}`;

                // Ajustar intervalo de aparición (más rápido)
                gameState.spawnInterval = Math.max(
                    config.minSpawnInterval,
                    config.baseSpawnInterval - (gameState.difficultyLevel * 100)
                );

                // Cambiar fondo según el nivel
                const bgIndex = Math.min(gameState.difficultyLevel - 1, backgroundImages.length - 1);
                gameContainer.style.backgroundImage = `url('${backgroundImages[bgIndex]}')`;

                // Cambiar música cada 3 niveles después del nivel 10
                if (gameState.difficultyLevel >= 10 && (gameState.difficultyLevel - 10) % 3 === 0) {
                    changeGameMusic();
                }

                // Agregar luces de discoteca a partir del nivel 7
                if (gameState.difficultyLevel >= 7 && gameState.discoLights.length === 0) {
                    createDiscoLights();
                }

                // Ajustar velocidad de animación de luces según nivel
                if (gameState.discoLights.length > 0) {
                    const speed = Math.min(1 + (gameState.difficultyLevel - 7) * 0.2, 3);
                    gameState.discoLights.forEach(light => {
                        light.style.animationDuration = `${3 / speed}s`;
                    });
                }

                showMessage(`¡Subiste al nivel ${gameState.difficultyLevel}!`, 'bonus');
            }
        }

        // Cambiar la música del juego
        function changeGameMusic() {
            // Seleccionar una nueva canción diferente a la actual
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * gameMusicList.length);
            } while (newIndex === gameState.currentMusicIndex && gameMusicList.length > 1);

            gameState.currentMusicIndex = newIndex;
            gameMusic.src = gameMusicList[gameState.currentMusicIndex];

            if (gameState.musicEnabled) {
                gameMusic.play().catch(e => console.log("No se pudo cambiar la música:", e));
            }

            showMessage("¡Nueva música desbloqueada!", 'bonus');
        }

        // Crear luces de discoteca
        function createDiscoLights() {
            // Crear múltiples luces para efecto más intenso
            for (let i = 0; i < 3; i++) {
                const light = document.createElement('div');
                light.className = 'disco-light';
                light.style.animationDelay = `${i}s`;
                gameContainer.appendChild(light);
                gameState.discoLights.push(light);
            }
        }

        // Mostrar personaje Tasty
        function showTastyCharacter() {
            tastyCharacter.style.display = 'block';

            // Reproducir sonido
            if (gameState.musicEnabled) {
                tastySound.currentTime = 0;
                tastySound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
            }

            // Ocultar después de 1 segundo
            setTimeout(() => {
                tastyCharacter.style.display = 'none';
            }, 1000);
        }

        // Calcular probabilidades de los objetos según la dificultad y vidas
        function getCurrentProbabilities() {
            const livesLost = config.maxLives - gameState.lives;
            const probabilities = {};

            // Durante el bonus, solo aparecen cervezas buenas (excepto eristoff)
            if (gameState.isBonusActive) {
                probabilities.mistralnegra = 0.6;
                probabilities.eskudoroja = 0.02;
                probabilities.eristoff = 0.1; // Solo las normales, no doragua
                probabilities.doragua = 0;
                probabilities.cumpleto = 0;
                probabilities.cogollo = 0;
                return probabilities;
            }

            // Probabilidad base ajustada por nivel de dificultad
            probabilities.mistralnegra = Math.max(0.4,
                config.baseProbabilities.mistralnegra -
                (gameState.difficultyLevel * 0.02));

            probabilities.eskudoroja = Math.min(0.15,
                config.baseProbabilities.eskudoroja);

            probabilities.eristoff = Math.min(0.3,
                config.baseProbabilities.eristoff +
                (gameState.difficultyLevel * config.difficultyIncrease.eristoff));

            probabilities.doragua = Math.min(0.1,
                config.baseProbabilities.doragua +
                (gameState.difficultyLevel * config.difficultyIncrease.doragua));

            probabilities.cumpleto = Math.max(0.02,
                config.baseProbabilities.cumpleto +
                (gameState.difficultyLevel * config.difficultyIncrease.cumpleto) +
                (livesLost * config.lifeAdjustment.cumpleto));

            probabilities.cogollo = Math.min(0.1,
                config.baseProbabilities.cogollo +
                (gameState.difficultyLevel * config.difficultyIncrease.cogollo));

            return probabilities;
        }

        // Generar un nuevo objeto que cae
        function spawnObject() {
            const probabilities = getCurrentProbabilities();
            const totalWeight = Object.values(probabilities).reduce((sum, prob) => sum + prob, 0);
            let random = Math.random() * totalWeight;
            let selectedType;

            // Elegir tipo de objeto basado en probabilidades
            if (random < probabilities.mistralnegra) {
                selectedType = objectTypes.find(obj => obj.type === 'mistralnegra');
                random -= probabilities.mistralnegra;
            } else if (random < probabilities.mistralnegra + probabilities.eskudoroja) {
                selectedType = objectTypes.find(obj => obj.type === 'eskudoroja');
                random -= probabilities.eskudoroja;
            } else if (random < probabilities.mistralnegra + probabilities.eskudoroja + probabilities.eristoff) {
                selectedType = objectTypes.find(obj => obj.type === 'eristoff');
                random -= probabilities.eristoff;
            } else if (random < probabilities.mistralnegra + probabilities.eskudoroja + probabilities.eristoff + probabilities.doragua) {
                selectedType = objectTypes.find(obj => obj.type === 'doragua');
                random -= probabilities.doragua;
            } else if (random < probabilities.mistralnegra + probabilities.eskudoroja + probabilities.eristoff + probabilities.doragua + probabilities.cumpleto) {
                selectedType = objectTypes.find(obj => obj.type === 'cumpleto');
                random -= probabilities.cumpleto;
            } else {
                selectedType = objectTypes.find(obj => obj.type === 'cogollo');
            }

            // No spawnear cumpleto si no se han perdido vidas
            if (selectedType.type === 'cumpleto' && gameState.lives >= config.maxLives) {
                selectedType = objectTypes.find(obj => obj.type === 'mistralnegra');
            }

            // Crear elemento DOM
            const object = document.createElement('div');
            object.className = 'falling-object';
            object.dataset.type = selectedType.type;

            // Establecer imagen de fondo
            object.style.backgroundImage = `url('${selectedType.image}')`;

            // Posición horizontal aleatoria
            const maxX = gameContainer.clientWidth - 50;
            const x = Math.random() * maxX;

            object.style.left = `${x}px`;
            object.style.top = '-50px';

            // Añadir al contenedor del juego
            gameContainer.appendChild(object);

            // Añadir al array de objetos
            gameState.objects.push({
                element: object,
                type: selectedType.type,
                y: -70,
                x: x,
                width: 70,
                height: 70
            });

            // Evento de clic
            object.addEventListener('click', handleObjectClick);
        }

        // Mover todos los objetos hacia abajo
        function moveObjects() {
            const containerHeight = gameContainer.clientHeight;

            for (let i = gameState.objects.length - 1; i >= 0; i--) {
                const obj = gameState.objects[i];
                obj.y += gameState.speed;
                obj.element.style.top = `${obj.y}px`;

                // Rotación aleatoria para efecto visual
                if (Math.random() < 0.1) {
                    const rotation = (Math.random() * 20) - 10;
                    obj.element.style.transform = `rotate(${rotation}deg)`;
                }
            }
        }

        // Verificar si algún objeto ha tocado el suelo
        function checkFloorCollisions() {
            const containerHeight = gameContainer.clientHeight;

            for (let i = gameState.objects.length - 1; i >= 0; i--) {
                const obj = gameState.objects[i];

                if (obj.y > containerHeight) {
                    // Objeto ha llegado al suelo
                    if (obj.type === 'mistralnegra' && !gameState.isBonusActive) {
                        // Solo penalizar fuera del bonus
                        gameState.score += config.beerMissPenalty;
                        showMessage("¡SE TE ESTÁ CALLENDO LA CHELA! -5", 'warning');

                        if (gameState.musicEnabled) {
                            beerMissSound.currentTime = 0;
                            beerMissSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                        }

                        gameState.lives--;
                        updateUI();

                        if (!gameState.isBonusActive && !gameState.isCooldownActive) {
                            gameState.speed += 0.3;
                        }

                        avatarShake();
                        updateAvatarMood('angry');

                        if (gameState.lives <= 0) {
                            gameOver();
                        }
                    }

                    // Eliminar objeto (siempre)
                    obj.element.remove();
                    gameState.objects.splice(i, 1);
                }
            }
        }

        // Manejar clic en un objeto
        function handleObjectClick(event) {
            if (gameState.isGameOver || gameState.isGamePaused) return;

            const objectElement = event.currentTarget;
            const objIndex = gameState.objects.findIndex(obj => obj.element === objectElement);

            if (objIndex !== -1) {
                const obj = gameState.objects[objIndex];
                let mood = null;

                // Reproducir sonido de clic
                if (gameState.musicEnabled) {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                }

                switch (obj.type) {
                    case 'mistralnegra':
                        gameState.score += config.beerPoints;
                        showMessage("¡UNA SABROSA MISTRAL NEGRA! +20", 'normal');
                        mood = 'happy';
                        avatarJump();

                        // Reproducir sonido de captura
                        if (gameState.musicEnabled) {
                            beerCatchSound.currentTime = 0;
                            beerCatchSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                        }
                        break;

                    case 'eskudoroja':
                        gameState.score += config.beerPoints * 2; // Doble puntos
                        showMessage("¡SU ESCUDO TIBIA! +40", 'bonus');
                        mood = 'veryHappy';
                        avatarJump();

                        // Reproducir sonido de captura
                        if (gameState.musicEnabled) {
                            beerCatchSound.currentTime = 0;
                            beerCatchSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                        }
                        break;

                    case 'eristoff':
                        gameState.score += config.eristoffPoints;
                        gameState.lives--;
                        showMessage("¡TOMASTE COLONIA! -25 y -1 vida", 'danger');
                        mood = 'sad';
                        avatarShake();

                        // Reproducir sonido de error
                        if (gameState.musicEnabled) {
                            badClickSound.currentTime = 0;
                            badClickSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                        }

                        // Aumentar un poco la velocidad al perder vida
                        if (!gameState.isBonusActive && !gameState.isCooldownActive) {
                            gameState.speed += 0.3;
                        }

                        if (gameState.lives <= 0) {
                            gameOver();
                        }
                        break;

                    case 'doragua':
                        // Terminar el juego inmediatamente
                        showMessage("¡TOMASTE DORAGUA Y TE FUISTE A LA CHUCHA!", 'danger');
                        gameState.lives = 0;
                        updateUI();
                        mood = 'angry';
                        avatarShake();

                        // Reproducir sonido de error
                        if (gameState.musicEnabled) {
                            badClickSound.currentTime = 0;
                            badClickSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                        }

                        gameOver();
                        break;

                    case 'cumpleto':
                        if (gameState.lives < config.maxLives) {
                            gameState.lives += config.lifePoints;
                            showMessage("¡TE COMISTE UN COMPLETITO CON JUNA! +1 VIDA", 'bonus');
                            mood = 'celebrating';
                            avatarCelebrate();

                            // Reproducir sonido de vida ganada
                            if (gameState.musicEnabled) {
                                lifeUpSound.currentTime = 0;
                                lifeUpSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                            }
                        } else {
                            // Si ya tiene todas las vidas, dar puntos extras
                            gameState.score += config.beerPoints;
                            showMessage("¡Vidas completas! +10 puntos", 'normal');
                            mood = 'veryHappy';
                            avatarJump();

                            // Reproducir sonido de captura
                            if (gameState.musicEnabled) {
                                beerCatchSound.currentTime = 0;
                                beerCatchSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
                            }
                        }
                        break;

                    case 'cogollo':
                        // Activar modo bonus
                        startBonusMode();
                        break;
                }

                // Actualizar estado de ánimo del avatar
                if (mood) {
                    updateAvatarMood(mood);
                }

                // Eliminar objeto
                objectElement.remove();
                gameState.objects.splice(objIndex, 1);

                // Actualizar UI
                updateUI();
            }

            // Prevenir comportamiento por defecto
            event.preventDefault();
        }

        // Iniciar modo bonus
        function startBonusMode() {
            if (gameState.isBonusActive) return;

            // Pausar el juego
            gameState.isGamePaused = true;
            gameState.isBonusActive = true;
            gameState.originalSpeed = gameState.speed;
            gameState.originalSpawnInterval = gameState.spawnInterval;

            // Mostrar pantalla de bonus
            bonusScreen.style.display = 'flex';

            // Reproducir sonido de bonus
            if (gameState.musicEnabled) {
                bonusSound.currentTime = 0;
                bonusSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
            }

            // Esperar 5 segundos antes de empezar el bonus
            setTimeout(() => {
                bonusScreen.style.display = 'none';
                gameState.isGamePaused = false;

                // Configurar modo bonus (después de la pausa)
                gameState.speed = gameState.originalSpeed * 1.5; // Más rápido
                gameState.spawnInterval = config.bonusSpawnInterval; // Muchos objetos

                showMessage("¡BONUS ACTIVADO! APROVECHA DE TOMAR ANTES DE IRTE EN LA NO VERBAL ", 'bonus');

                // Duración aleatoria del bonus (10-15 segundos)
                const bonusDuration = Math.random() *
                    (config.bonusDuration.max - config.bonusDuration.min) +
                    config.bonusDuration.min;

                // Terminar bonus después del tiempo
                setTimeout(() => {
                    endBonusMode();
                }, bonusDuration);

            }, 5000); // 5 segundos de pausa para leer el mensaje
        }

        // Terminar modo bonus
        function endBonusMode() {
            if (!gameState.isBonusActive) return;
            clearAllObjects();  // <-- Esta es la línea nueva que debes agregar
            gameState.isBonusActive = false;
            gameState.isGamePaused = true;

            // Mostrar pantalla de fin de bonus
            endBonusScreen.style.display = 'flex';

            // Esperar 2 segundos antes de continuar
            setTimeout(() => {
                endBonusScreen.style.display = 'none';
                gameState.isGamePaused = false;

                // Restaurar velocidad y spawn interval originales
                gameState.speed = gameState.originalSpeed;
                gameState.spawnInterval = gameState.originalSpawnInterval;

                showMessage("¡Bonus terminado! Disfruta un pequeño descanso", 'info');

                // Activar tiempo de descanso después de un breve retraso
                setTimeout(() => {
                    startCooldown();
                }, 2000);
            }, 2000);
        }

        // Iniciar tiempo de descanso
        function startCooldown() {
    if (gameState.isCooldownActive) return;
    
    // Limpiar todos los objetos existentes    
    gameState.isCooldownActive = true;
    gameState.cooldownWarningShown = false;
    gameState.originalSpeed = gameState.speed;
    
    // Reducir velocidad durante el descanso
    gameState.speed = gameState.originalSpeed * config.cooldownSpeedMultiplier;
    
    showMessage("¡Tiempo de descanso! La velocidad se reduce", 'info');
    
    // Mostrar barra de cooldown y reloj
    cooldownBar.style.display = 'block';
    clockIcon.style.display = 'block';
    cooldownProgress.style.width = '100%';
    
    // Reproducir sonido de reloj
    if (gameState.musicEnabled) {
        clockTickSound.currentTime = 0;
        clockTickSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
    }
    
    // Animación de la barra
    const startTime = Date.now();
    const cooldownInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = 1 - (elapsed / config.cooldownDuration);
        
        if (remaining <= 0) {
            clearInterval(cooldownInterval);
            endCooldown();
            cooldownBar.style.display = 'none';
            clockIcon.style.display = 'none';
        } else {
            cooldownProgress.style.width = `${remaining * 100}%`;
        }
    }, 100);
    
    // Terminar cooldown después del tiempo
    setTimeout(() => {
        clearInterval(cooldownInterval);
        endCooldown();
        cooldownBar.style.display = 'none';
        clockIcon.style.display = 'none';
    }, config.cooldownDuration);
}

// Función para limpiar todos los objetos
function clearAllObjects() {
    // Eliminar todos los elementos del DOM
    document.querySelectorAll('.falling-object').forEach(el => el.remove());
    
    // Limpiar el array de objetos
    gameState.objects = [];
    
    // Opcional: Efecto visual de limpieza
    const cleanEffect = document.createElement('div');
    cleanEffect.style.position = 'absolute';
    cleanEffect.style.top = '0';
    cleanEffect.style.left = '0';
    cleanEffect.style.width = '100%';
    cleanEffect.style.height = '100%';
    cleanEffect.style.background = 'rgba(255, 255, 255, 0.3)';
    cleanEffect.style.zIndex = '15';
    cleanEffect.style.animation = 'fadeOut 0.5s forwards';
    
    gameContainer.appendChild(cleanEffect);
    setTimeout(() => cleanEffect.remove(), 500);
}
        // Terminar tiempo de descanso
        function endCooldown() {
            if (!gameState.isCooldownActive) return;

            gameState.isCooldownActive = false;
            gameState.speed = gameState.originalSpeed;

            // Detener sonido de reloj
            clockTickSound.pause();

            showMessage("¡Fin del descanso! LA VELOCIDAD VUELCE A LA NORMALIDAD", 'info');
        }

        // Actualizar el estado de ánimo del avatar según la puntuación
        function updateAvatarMood(forcedMood = null) {
            const now = Date.now();

            // Evitar cambios demasiado rápidos
            if (now - gameState.lastMoodChange < 1000 && !forcedMood) {
                return;
            }

            let moodClass = 'avatar-neutral';

            if (forcedMood) {
                // Estado de ánimo forzado (para reacciones inmediatas)
                switch (forcedMood) {
                    case 'happy':
                        moodClass = 'avatar-happy';
                        break;
                    case 'sad':
                        moodClass = 'avatar-sad';
                        break;
                    case 'veryHappy':
                        moodClass = 'avatar-very-happy';
                        break;
                    case 'angry':
                        moodClass = 'avatar-angry';
                        break;
                    case 'celebrating':
                        moodClass = 'avatar-celebrating';
                        break;
                }
            } else {
                // Estado de ánimo basado en la puntuación
                if (gameState.score >= config.avatarMoodThresholds.veryHappy) {
                    moodClass = 'avatar-very-happy';
                } else if (gameState.score >= config.avatarMoodThresholds.happy) {
                    moodClass = 'avatar-happy';
                } else if (gameState.score <= config.avatarMoodThresholds.angry) {
                    moodClass = 'avatar-angry';
                } else if (gameState.score <= config.avatarMoodThresholds.sad) {
                    moodClass = 'avatar-sad';
                }
            }

            // Aplicar la clase correspondiente
            avatar.className = '';
            avatar.classList.add(moodClass);

            gameState.lastMoodChange = now;
        }

        // Mostrar mensaje en la UI con estilo según tipo
        function showMessage(text, type = 'normal') {
            messageText.textContent = text;

            // Eliminar clases anteriores
            messageBox.classList.remove('message-normal', 'message-warning', 'message-danger', 'message-bonus', 'message-info');

            // Añadir clase según el tipo
            switch (type) {
                case 'warning':
                    messageBox.classList.add('message-warning');
                    break;
                case 'danger':
                    messageBox.classList.add('message-danger');
                    break;
                case 'bonus':
                    messageBox.classList.add('message-bonus');
                    break;
                case 'info':
                    messageBox.classList.add('message-info');
                    break;
                default:
                    messageBox.classList.add('message-normal');
            }
        }

        // Actualizar la interfaz de usuario
        function updateUI() {
            scoreElement.textContent = `Puntos: ${gameState.score}`;

            // Actualizar vidas (usando emojis de corazón)
            livesElement.textContent = '🏳️‍🌈'.repeat(gameState.lives) + '♡'.repeat(config.maxLives - gameState.lives);

            // Actualizar estado de ánimo del avatar según la puntuación
            if (Date.now() - gameState.lastMoodChange > 2000) {
                updateAvatarMood();
            }
        }

        // Finalizar el juego
        function gameOver() {
            gameState.isGameOver = true;
            finalScoreElement.textContent = `Puntuación final: ${gameState.score}`;
            gameOverScreen.style.display = 'flex';

            // Reproducir sonido de game over
            if (gameState.musicEnabled) {
                gameOverSound.currentTime = 0;
                gameOverSound.play().catch(e => console.log("No se pudo reproducir sonido:", e));
            }

            // Detener música del juego
            gameMusic.pause();

            // Avatar triste al perder
            updateAvatarMood('sad');

            // Guardar puntuación
            if (gameState.playerName) {
                saveScore(gameState.playerName, gameState.score);
            }
        }

        // Guardar puntuación en localStorage
        function saveScore(name, score) {
            const scores = JSON.parse(localStorage.getItem('beerGameScores')) || [];
            const gameTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);

            scores.push({
                name: name,
                score: score,
                date: new Date().toLocaleDateString(),
                time: gameTime
            });

            // Ordenar por puntuación (mayor primero)
            scores.sort((a, b) => b.score - a.score);

            // Mantener solo las 10 mejores
            if (scores.length > 10) {
                scores.length = 10;
            }

            localStorage.setItem('beerGameScores', JSON.stringify(scores));
            updateScoreboard();
        }

        // Actualizar la tabla de puntuaciones
        function updateScoreboard() {
            const scores = JSON.parse(localStorage.getItem('beerGameScores')) || [];
            scoresBody.innerHTML = '';

            if (scores.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4">No hay puntuaciones guardadas</td>';
                scoresBody.appendChild(row);
                return;
            }

            scores.forEach((score, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.name}</td>
                <td>${score.score}</td>
                <td>${score.date}</td>
            `;
                scoresBody.appendChild(row);
            });
        }

        // Alternar música
        function toggleMusic() {
            gameState.musicEnabled = !gameState.musicEnabled;

            if (gameState.musicEnabled) {
                toggleMusicBtn.textContent = '🔊';
                // Reanudar música según la pantalla actual
                if (gameContainer.style.display === 'block') {
                    gameMusic.play().catch(e => console.log("No se pudo reanudar música:", e));
                } else if (mainMenu.style.display === 'flex') {
                    menuMusic.play().catch(e => console.log("No se pudo reanudar música:", e));
                }
            } else {
                toggleMusicBtn.textContent = '🔇';
                // Pausar toda la música
                gameMusic.pause();
                menuMusic.pause();
                clockTickSound.pause();
            }
        }

        // Animación del avatar: salto de alegría
        function avatarJump() {
            avatarContainer.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                avatarContainer.style.transform = 'translateY(0)';
            }, 300);
        }

        // Animación del avatar: sacudida de enojo/tristeza
        function avatarShake() {
            avatarContainer.style.transform = 'rotate(-10deg)';
            setTimeout(() => {
                avatarContainer.style.transform = 'rotate(10deg)';
                setTimeout(() => {
                    avatarContainer.style.transform = 'rotate(0)';
                }, 100);
            }, 100);
        }

        // Animación del avatar: celebración
        function avatarCelebrate() {
            avatarContainer.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                avatarContainer.style.transform = 'scale(1) rotate(-10deg)';
                setTimeout(() => {
                    avatarContainer.style.transform = 'scale(1.1) rotate(0)';
                    setTimeout(() => {
                        avatarContainer.style.transform = 'scale(1)';
                    }, 200);
                }, 200);
            }, 200);
        }

        // Event listeners para los botones del menú
        startBtn.addEventListener('click', () => {
            mainMenu.style.display = 'none';
            playerNameInput.style.display = 'flex';
        });

        scoresBtn.addEventListener('click', () => {
            mainMenu.style.display = 'none';
            scoreboard.style.display = 'flex';
            updateScoreboard();
        });

        backBtn.addEventListener('click', () => {
            scoreboard.style.display = 'none';
            mainMenu.style.display = 'flex';
        });

        restartBtn.addEventListener('click', () => {
            gameOverScreen.style.display = 'none';
            initGame();
        });

        menuBtn.addEventListener('click', () => {
            gameOverScreen.style.display = 'none';
            gameContainer.style.display = 'none';
            mainMenu.style.display = 'flex';

            // Detener música del juego y comenzar música del menú
            gameMusic.pause();
            clockTickSound.pause();
            if (gameState.musicEnabled) {
                menuMusic.play().catch(e => console.log("No se pudo reproducir música:", e));
            }
        });

        nameSubmit.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (name) {
                gameState.playerName = name;
                playerNameInput.style.display = 'none';
                gameContainer.style.display = 'block';

                // Detener música del menú
                menuMusic.pause();

                initGame();
            }
        });

        // Permitir enviar con Enter
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                nameSubmit.click();
            }
        });

        // Control de música
        toggleMusicBtn.addEventListener('click', toggleMusic);

        // Cargar el menú principal al inicio
        window.addEventListener('load', () => {
            mainMenu.style.display = 'flex';
            gameContainer.style.display = 'none';
            scoreboard.style.display = 'none';
            playerNameInput.style.display = 'none';

            // Iniciar música del menú
            menuMusic.volume = 0.5;
            menuMusic.play().catch(e => console.log("No se pudo reproducir música automáticamente:", e));
        });

        // Manejar redimensionamiento de la ventana
        window.addEventListener('resize', () => {
            // Ajustar posiciones de los objetos para mantener la proporción
            const containerWidth = gameContainer.clientWidth;

            gameState.objects.forEach(obj => {
                // Mantener la proporción en el eje X
                const ratio = obj.x / (containerWidth - obj.width);
                obj.x = ratio * (gameContainer.clientWidth - obj.width);
                obj.element.style.left = `${obj.x}px`;
            });
        });
    
