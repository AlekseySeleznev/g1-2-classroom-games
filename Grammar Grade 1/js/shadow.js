// Database with emojis and their corresponding articles
const items = [
    { word: "apple", emoji: "🍎", article: "an" },
    { word: "cat", emoji: "🐱", article: "a" },
    { word: "car", emoji: "🚗", article: "a" },
    { word: "dog", emoji: "🐶", article: "a" },
    { word: "robot", emoji: "🤖", article: "a" },
    { word: "banana", emoji: "🍌", article: "a" },
    { word: "orange", emoji: "🍊", article: "an" },
    { word: "elephant", emoji: "🐘", article: "an" },
    { word: "umbrella", emoji: "☂️", article: "an" }
];

let currentItem = {};
let isCorrectAnswerYes = true;

// DOM Elements
const questionEl = document.getElementById("question");
const emojiEl = document.getElementById("item-emoji");
const feedbackEl = document.getElementById("feedback");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const btnNext = document.getElementById("btn-next");
const answerButtons = document.getElementById("answer-buttons");

// Initializes a new round
function startRound() {
    // Reset UI state
    emojiEl.classList.remove("revealed");
    feedbackEl.textContent = "";
    btnNext.style.display = "none";
    answerButtons.style.display = "flex";

    // Select a random item from the array
    currentItem = items[Math.floor(Math.random() * items.length)];
    emojiEl.textContent = currentItem.emoji;

    // 50% chance to generate a matching question or a trick question
    isCorrectAnswerYes = Math.random() > 0.5;

    if (isCorrectAnswerYes) {
        // Formulate a correct question using the specific article
        questionEl.textContent = `Is this ${currentItem.article} ${currentItem.word}?`;
    } else {
        // Find a different item to create a trick question
        let wrongItem;
        do { 
            wrongItem = items[Math.floor(Math.random() * items.length)]; 
        } while (wrongItem.word === currentItem.word);
        
        questionEl.textContent = `Is this ${wrongItem.article} ${wrongItem.word}?`;
    }
}

// Validates the user's input
function checkAnswer(userSaidYes) {
    // Reveal the emoji shadow and update buttons
    emojiEl.classList.add("revealed");
    answerButtons.style.display = "none";
    btnNext.style.display = "inline-block";

    // Provide feedback based on user action
    if (userSaidYes === isCorrectAnswerYes) {
        feedbackEl.textContent = "Excellent! ✨";
        feedbackEl.className = "correct";
    } else {
        feedbackEl.textContent = `Oops! This is ${currentItem.article} ${currentItem.word}.`;
        feedbackEl.className = "wrong";
    }
}

// Event Listeners
btnYes.addEventListener("click", () => checkAnswer(true));
btnNo.addEventListener("click", () => checkAnswer(false));
btnNext.addEventListener("click", startRound);

// Start the first round on load
startRound();