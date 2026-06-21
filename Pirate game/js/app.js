/* ==========================================================================
   КОНФИГУРАЦИЯ И НАСТРОЙКИ ИГРЫ
   ========================================================================== */
const CONFIG = {
    level2Duration: 30000, // Таймер на Уровне 2: 30 секунд
    level3Duration: 10000, // Таймер на Уровне 3: 10 секунд
    imageExtension: 'png', 

    audioPath: 'assets/audio/',
    imagePath: 'assets/images/',

    // Настройки громкости музыки (от 0.0 до 1.0)
    bgMusicVolumeDefault: 0.2, 
    bgMusicVolumeMuted: 0.05,  

    // Названия файлов карточек и соответствующих им плакатов инструкций
    cards: [
        { id: 'STORM', audio: 'storm.mp3', actionFile: 'action_storm.png' },
        { id: 'GOLD', audio: 'gold.mp3', actionFile: 'action_gold.png' },
        { id: 'SHARK', audio: 'shark.mp3', actionFile: 'action_shark.png' },
        { id: 'PIRATES', audio: 'pirates.mp3', actionFile: 'action_pirates.png' },
        { id: 'ISLAND', audio: 'island.mp3', actionFile: 'action_island.png' },
        { id: 'FREEZE', audio: 'freeze.mp3', actionFile: 'action_freeze.png' }
    ]
};

/* ==========================================================================
   ИГРОВАЯ ЛОГИКА
   ========================================================================== */
let currentLevel = 1;
let scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
let timerInterval = null;
let lastSelectedCard = null;
let isBgMusicPlaying = false;
let currentActiveCard = null; 

// Индекс для строго последовательного перебора карточек на Level 1
let learningIndex = 0;

const sfxPlayer = document.getElementById('game-audio-player');
const bgMusicPlayer = document.createElement('audio');

bgMusicPlayer.loop = true;
bgMusicPlayer.volume = CONFIG.bgMusicVolumeDefault;

function startBgMusic() {
    if (!isBgMusicPlaying) {
        bgMusicPlayer.src = CONFIG.audioPath + 'ambient.mp3';
        bgMusicPlayer.play().then(() => {
            isBgMusicPlaying = true;
        }).catch(e => console.log("Ambient file missing / browser autoplay restriction"));
    }
}

function changeLevel(lvl) {
    currentLevel = lvl;
    document.querySelectorAll('.level-selector button').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-lvl${lvl}`).classList.add('active');
    
    if (currentLevel === 1) {
        learningIndex = 0;
    }
    
    resetStage();
}

function resetStage() {
    clearInterval(timerInterval);
    sfxPlayer.pause();
    sfxPlayer.loop = false;
    currentActiveCard = null;
    
    if (isBgMusicPlaying) bgMusicPlayer.volume = CONFIG.bgMusicVolumeDefault;

    document.getElementById('timer-container').style.display = 'none';
    document.getElementById('status-screen').style.display = 'flex';
    document.getElementById('layout-split').style.display = 'none';
    document.getElementById('layout-single').style.display = 'none';
    
    const mainBtn = document.getElementById('btn-main-action');
    mainBtn.style.display = 'block';
    mainBtn.style.backgroundColor = '#ff9f43';
    mainBtn.innerText = "START ROUND";
    mainBtn.setAttribute("onclick", "triggerRound()");
    
    if (currentLevel === 1) {
        document.getElementById('status-title').innerText = "LEVEL 1: LEARN";
        document.getElementById('status-sub').innerText = "Card on the left, Kid instructions on the right. Ordered mode.";
    } else if (currentLevel === 2) {
        document.getElementById('status-title').innerText = "LEVEL 2: SPYGLASS RUN";
        document.getElementById('status-sub').innerText = "Mystery fragment! 25% of the card is visible. 30s timer.";
    } else if (currentLevel === 3) {
        document.getElementById('status-title').innerText = "LEVEL 3: BLIND LISTEN";
        document.getElementById('status-sub').innerText = "Audio ONLY! Guess by sound, then see the answer.";
    }
}

function getNextCard() {
    if (currentLevel === 1) {
        let chosen = CONFIG.cards[learningIndex];
        learningIndex++;
        if (learningIndex >= CONFIG.cards.length) {
            learningIndex = 0; 
        }
        return chosen;
    } else {
        let available = CONFIG.cards.filter(c => c !== lastSelectedCard);
        if (available.length === 0) available = CONFIG.cards;
        let chosen = available[Math.floor(Math.random() * available.length)];
        lastSelectedCard = chosen;
        return chosen;
    }
}

function triggerRound() {
    startBgMusic(); 
    document.getElementById('btn-main-action').style.display = 'none';
    
    currentActiveCard = getNextCard();

    if (isBgMusicPlaying) bgMusicPlayer.volume = CONFIG.bgMusicVolumeMuted;

    if (currentLevel === 1) {
        playSFX(currentActiveCard.audio, false);
        showContentSplit(currentActiveCard); 
        endRound();
    } else if (currentLevel === 2) {
        runReadySetGo(() => {
            playSFX(currentActiveCard.audio, true);
            showContentSingle(currentActiveCard); 
            
            // Накладываем случайную маску "подзорной трубы" (25% видимости)
            applySpyglassMask();
            
            showForceAnswerButton();
            
            startVisualTimer(CONFIG.level2Duration, () => {
                handleRoundEndAuto();
            });
        });
    } else if (currentLevel === 3) {
        runReadySetGo(() => {
            playSFX(currentActiveCard.audio, true);
            showBlindScreen(); 
            
            showForceAnswerButton();
            
            startVisualTimer(CONFIG.level3Duration, () => {
                handleRoundEndAuto();
            });
        });
    }
}

// ГЕНЕРАЦИЯ СЛУЧАЙНЫХ 25% ВИДИМОСТИ (Маска подзорной трубы)
function applySpyglassMask() {
    const img = document.querySelector('#card-holder-center .card-image');
    if (!img) return;

    // Включаем темный фон-обертку вокруг картинки
    img.classList.add('spyglass-mode');

    // Окошко должно быть 50% по ширине и 50% по высоте (что дает ровно 25% площади)
    // Генерируем случайную начальную координату X и Y от 0 до 50%
    const randomX = Math.floor(Math.random() * 51);
    const randomY = Math.floor(Math.random() * 51);

    const xMin = randomX;
    const xMax = randomX + 50;
    const yMin = randomY;
    const yMax = randomY + 50;

    // Применяем CSS обрезку через полигон координат (полигональная маска)
    img.style.clipPath = `polygon(${xMin}% ${yMin}%, ${xMax}% ${yMin}%, ${xMax}% ${yMax}%, ${xMin}% ${yMax}%)`;
}

// Полное удаление маски перед показом сплит-ответа
function removeSpyglassMask() {
    const img = document.querySelector('#card-holder-center .card-image');
    if (img) {
        img.classList.remove('spyglass-mode');
        img.style.clipPath = 'none';
    }
}

function showForceAnswerButton() {
    const mainBtn = document.getElementById('btn-main-action');
    mainBtn.style.display = 'block';
    mainBtn.style.backgroundColor = '#2ecc71'; 
    mainBtn.innerText = "🎯 ACTION COMPLETED! SHOW ANSWER";
    mainBtn.setAttribute("onclick", "forceRoundEnd()");
}

function handleRoundEndAuto() {
    stopSFX(); 
    removeSpyglassMask();
    if (currentActiveCard) showContentSplit(currentActiveCard);
    endRound(); 
}

function forceRoundEnd() {
    clearInterval(timerInterval);
    document.getElementById('timer-container').style.display = 'none';
    
    stopSFX(); 
    removeSpyglassMask();
    if (currentActiveCard) showContentSplit(currentActiveCard);
    endRound();
}

function playSFX(filename, shouldLoop) {
    sfxPlayer.pause();
    sfxPlayer.src = CONFIG.audioPath + filename;
    sfxPlayer.loop = shouldLoop; 
    sfxPlayer.play().catch(e => console.log("SFX file missing in assets/audio/"));
}

function stopSFX() {
    sfxPlayer.pause();
    sfxPlayer.loop = false;
}

function renderVisualFile(fullPath, filenameWithoutPath, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = fullPath;
    img.className = 'card-image';
    
    img.onerror = function() {
        container.innerHTML = `<div class="image-placeholder">${filenameWithoutPath.toUpperCase()}<br><span style="font-size:24px;color:#a0a5b0;">File missing</span></div>`;
    };
    
    container.appendChild(img);
}

function showContentSplit(card) {
    document.getElementById('status-screen').style.display = 'none';
    document.getElementById('layout-single').style.display = 'none';
    document.getElementById('layout-split').style.display = 'flex';
    
    const cardPath = `${CONFIG.imagePath}${card.id.toLowerCase()}.${CONFIG.imageExtension}`;
    renderVisualFile(cardPath, `${card.id}.${CONFIG.imageExtension}`, 'card-holder-left');
    
    const actionBox = document.querySelector('.split-box:not(.split-left)');
    actionBox.innerHTML = '';
    
    const actionImg = document.createElement('img');
    actionImg.src = `${CONFIG.imagePath}${card.actionFile}`;
    actionImg.className = 'card-image';
    actionImg.onerror = function() {
        actionBox.innerHTML = `<div class="image-placeholder">${card.actionFile.toUpperCase()}<br><span style="font-size:24px;color:#a0a5b0;">File missing</span></div>`;
    };
    actionBox.appendChild(actionImg);
}

function showContentSingle(card) {
    document.getElementById('status-screen').style.display = 'none';
    document.getElementById('layout-split').style.display = 'none';
    document.getElementById('layout-single').style.display = 'flex';
    
    const cardPath = `${CONFIG.imagePath}${card.id.toLowerCase()}.${CONFIG.imageExtension}`;
    renderVisualFile(cardPath, `${card.id}.${CONFIG.imageExtension}`, 'card-holder-center');
}

function showBlindScreen() {
    document.getElementById('layout-split').style.display = 'none';
    document.getElementById('layout-single').style.display = 'none';
    document.getElementById('status-screen').style.display = 'flex';
    document.getElementById('status-title').innerText = "👂 LISTEN! 👂";
    document.getElementById('status-sub').innerText = "Listen closely and show the action!";
}

function runReadySetGo(callback) {
    const statusScreen = document.getElementById('status-screen');
    const title = document.getElementById('status-title');
    const sub = document.getElementById('status-sub');
    
    document.getElementById('layout-split').style.display = 'none';
    document.getElementById('layout-single').style.display = 'none';
    
    statusScreen.style.display = 'flex';
    sub.innerText = "Get into positions!";
    title.innerText = "READY...";
    
    setTimeout(() => {
        title.innerText = "SET...";
        setTimeout(() => {
            title.innerText = "GO!!!";
            setTimeout(() => {
                callback();
            }, 600);
        }, 1000);
    }, 1000);
}

function startVisualTimer(duration, onEndCallback) {
    const timerContainer = document.getElementById('timer-container');
    const timerBar = document.getElementById('timer-progress');
    
    timerContainer.style.display = 'block';
    timerBar.style.width = '100%';
    
    let startTime = Date.now();
    
    timerInterval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let percentage = 100 - (elapsed / duration * 100);
        
        if (percentage <= 0) {
            clearInterval(timerInterval);
            timerBar.style.width = '0%';
            timerContainer.style.display = 'none';
            onEndCallback();
        } else {
            timerBar.style.width = percentage + '%';
        }
    }, 30);
}

function endRound() {
    if (isBgMusicPlaying) bgMusicPlayer.volume = CONFIG.bgMusicVolumeDefault;
    
    const mainBtn = document.getElementById('btn-main-action');
    mainBtn.style.display = 'block';
    mainBtn.style.backgroundColor = '#ff9f43';
    mainBtn.innerText = "NEXT ROUND";
    mainBtn.setAttribute("onclick", "triggerRound()");
}

function addPoint(teamNum) {
    scores[teamNum]++;
    document.getElementById(`s${teamNum}`).innerText = scores[teamNum];
}

function resetScores() {
    if (confirm("Reset all team scores back to 0?")) {
        scores = { 1: 0, 0: 0, 3: 0, 4: 0 }; // Фикс дефолтных ключей
        scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
        for(let i=1; i<=4; i++) {
            document.getElementById(`s${i}`).innerText = 0;
        }
    }
}