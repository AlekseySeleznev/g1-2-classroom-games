const wordsList = [
    "classroom", "table", "computer", "peg", "pencil case",
    "poster", "picture", "drawers", "cupboard", "CD player"
];

const TOTAL_WORDS = 10;
const TIME_PER_WORD = 40; 

let currentWordIndex = 0;
let timerInterval = null;
let timeLeft = 0;
let studentsPool = [];

function initStudents() {
    studentsPool = Array.from({length: 33}, (_, i) => i + 1);
}

function showScreen(screenId) {
    document.getElementById('screen-welcome').classList.add('hidden');
    document.getElementById('screen-dictation').classList.add('hidden');
    document.getElementById('screen-check-student').classList.add('hidden');
    document.getElementById('screen-check-word').classList.add('hidden');
    document.getElementById('screen-finish').classList.add('hidden');
    
    document.getElementById(screenId).classList.remove('hidden');
}

// --- УПРАВЛЕНИЕ СТРЕЛОЧКАМИ (Учитываем границы 1 и 10 слова) ---
function updateArrows(prevBtnId, nextBtnId) {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    // Если слово первое — левая стрелка исчезает
    prevBtn.disabled = (currentWordIndex === 0);
    // Если слово последнее — правая стрелка исчезает
    nextBtn.disabled = (currentWordIndex === TOTAL_WORDS - 1);
}

// --- ФАЗА 1: ДИКТАНТ ---
function startDictation() {
    initStudents(); 
    currentWordIndex = 0;
    showScreen('screen-dictation');
    loadDictationWord();
}

function loadDictationWord() {
    if (currentWordIndex >= TOTAL_WORDS) {
        clearInterval(timerInterval);
        currentWordIndex = 0; 
        startCheckPhase();
        return;
    }

    document.getElementById('dictation-title').innerText = `Look and write word #${currentWordIndex + 1}`;
    document.getElementById('dictation-img').src = `images/${currentWordIndex + 1}.jpg`;
    document.getElementById('dictation-counter').innerText = `Word ${currentWordIndex + 1} of ${TOTAL_WORDS}`;
    
    updateArrows('dict-prev', 'dict-next');

    // Настройка таймера
    timeLeft = TIME_PER_WORD * 10;
    const totalSteps = TIME_PER_WORD * 10;
    const bar = document.getElementById('timer-bar');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let percentage = (timeLeft / totalSteps) * 100;
        bar.style.width = percentage + '%';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentWordIndex++;
            loadDictationWord();
        }
    }, 100);
}

// Ручные стрелочки в диктанте
function prevDictationWord() {
    if (currentWordIndex > 0) {
        clearInterval(timerInterval);
        currentWordIndex--;
        loadDictationWord();
    }
}

function nextDictationWord() {
    if (currentWordIndex < TOTAL_WORDS - 1) {
        clearInterval(timerInterval);
        currentWordIndex++;
        loadDictationWord();
    } else if (currentWordIndex === TOTAL_WORDS - 1) {
        clearInterval(timerInterval);
        currentWordIndex = 0;
        startCheckPhase();
    }
}

// --- ФАЗА 2: ПРОВЕРКА ---
function startCheckPhase() {
    showScreen('screen-check-student');
    document.getElementById('student-number').innerText = "-";
    document.getElementById('check-student-counter').innerText = `Word ${currentWordIndex + 1} of ${TOTAL_WORDS}`;
    
    // Сброс кнопок рандомайзера в исходное состояние
    document.getElementById('btn-roll').classList.remove('hidden');
    document.getElementById('btn-reroll').classList.add('hidden');
    document.getElementById('btn-confirm-student').classList.add('hidden');
}

function rollStudent() {
    if (studentsPool.length === 0) {
        initStudents();
    }

    const display = document.getElementById('student-number');
    let counter = 0;
    
    // Скрываем все кнопки на время крутилки
    document.getElementById('btn-roll').classList.add('hidden');
    document.getElementById('btn-reroll').classList.add('hidden');
    document.getElementById('btn-confirm-student').classList.add('hidden');

    let intervalTime = 50;
    let rollInterval = function() {
        let tempRandom = Math.floor(Math.random() * 33) + 1;
        display.innerText = tempRandom;
        counter++;

        if (counter > 15) {
            const randomIndex = Math.floor(Math.random() * studentsPool.length);
            const chosenStudent = studentsPool[randomIndex];
            
            // Фиксируем номер на экране
            display.innerText = chosenStudent;
            display.setAttribute('data-chosen', chosenStudent); // Временно запоминаем номер
            
            // Показываем кнопки Reroll и OK вместо автоперехода
            document.getElementById('btn-reroll').classList.remove('hidden');
            document.getElementById('btn-confirm-student').classList.remove('hidden');
        } else {
            setTimeout(rollInterval, intervalTime += 20); 
        }
    };
    setTimeout(rollInterval, intervalTime);
}

// Подтверждение студента по кнопке OK
function confirmStudent() {
    // Окончательно удаляем выбранного студента из пула только при нажатии OK
    const chosen = parseInt(document.getElementById('student-number').getAttribute('data-chosen'));
    const indexInPool = studentsPool.indexOf(chosen);
    if (indexInPool !== -1) {
        studentsPool.splice(indexInPool, 1);
    }
    
    showCheckWordScreen();
}

function showCheckWordScreen() {
    showScreen('screen-check-word');
    document.getElementById('check-word-title').innerText = `Word #${currentWordIndex + 1}`;
    document.getElementById('check-img').src = `images/${currentWordIndex + 1}.jpg`;
    document.getElementById('answer-display').innerText = ""; 
    
    document.getElementById('btn-answer').classList.remove('hidden');
    
    updateArrows('check-prev', 'check-next');
}

function showAnswer() {
    const currentWordText = wordsList[currentWordIndex];
    document.getElementById('answer-display').innerText = currentWordText;
}

// Навигация стрелочками внутри проверки
function prevCheckWord() {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        startCheckPhase(); // Возврат к выбору студента для предыдущего слова
    }
}

function nextCheckWord() {
    if (currentWordIndex < TOTAL_WORDS - 1) {
        currentWordIndex++;
        startCheckPhase(); // Переход к выбору студента для следующего слова
    } else {
        showScreen('screen-finish'); // Окончание проверки
    }
}

function startDirectCheck() {
    initStudents();      
    currentWordIndex = 0; 
    startCheckPhase();    
}

function resetApp() {
    clearInterval(timerInterval);
    currentWordIndex = 0;
    initStudents();
    showScreen('screen-welcome');
}