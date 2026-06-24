// База слов (вы можете легко добавлять сюда новые строчки)
const items = [
    { word: "apple", emoji: "🍎" },
    { word: "cat", emoji: "🐱" },
    { word: "car", emoji: "🚗" },
    { word: "dog", emoji: "🐶" },
    { word: "robot", emoji: "🤖" },
    { word: "banana", emoji: "🍌" }
];

let currentItem = {};
let isCorrectAnswerYes = true;

// Привязка к элементам из HTML
const questionEl = document.getElementById("question");
const emojiEl = document.getElementById("item-emoji");
const feedbackEl = document.getElementById("feedback");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const btnNext = document.getElementById("btn-next");
const answerButtons = document.getElementById("answer-buttons");

function startRound() {
    // Сброс интерфейса для нового раунда
    emojiEl.classList.remove("revealed");
    feedbackEl.textContent = "";
    btnNext.style.display = "none";
    answerButtons.style.display = "flex";

    // Выбор случайного предмета
    currentItem = items[Math.floor(Math.random() * items.length)];
    emojiEl.textContent = currentItem.emoji;

    // 50% шанс на правильный или каверзный вопрос
    isCorrectAnswerYes = Math.random() > 0.5;

    if (isCorrectAnswerYes) {
        questionEl.textContent = `Is this a ${currentItem.word}?`;
    } else {
        let wrongItem;
        do {
            wrongItem = items[Math.floor(Math.random() * items.length)];
        } while (wrongItem.word === currentItem.word);
        
        questionEl.textContent = `Is this a ${wrongItem.word}?`;
    }
}

function checkAnswer(userSaidYes) {
    // Показываем картинку и меняем кнопки
    emojiEl.classList.add("revealed");
    answerButtons.style.display = "none";
    btnNext.style.display = "inline-block";

    // Проверка ответа
    if (userSaidYes === isCorrectAnswerYes) {
        feedbackEl.textContent = "Excellent! ✨";
        feedbackEl.className = "correct";
    } else {
        feedbackEl.textContent = `Oops! This is a ${currentItem.word}.`;
        feedbackEl.className = "wrong";
    }
}

// Навешиваем слушатели событий на кнопки
btnYes.addEventListener("click", () => checkAnswer(true));
btnNo.addEventListener("click", () => checkAnswer(false));
btnNext.addEventListener("click", startRound);

// Запускаем первую игру при загрузке
startRound();