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
    { word: "umbrella", emoji: "☂️", article: "an" },
    { word: "ice cream", emoji: "🍦", article: "an" } // Added another 'an' example
];

// DOM Elements
const emojiEl = document.getElementById("item-emoji");
const wordEl = document.getElementById("item-word");
const feedbackEl = document.getElementById("feedback");
const btnA = document.getElementById("btn-a");
const btnAn = document.getElementById("btn-an");
const btnNext = document.getElementById("btn-next");
const sortingButtons = document.getElementById("sorting-buttons");

let currentItem = {};

// Initializes a new round
function startRound() {
    // Reset UI state
    feedbackEl.textContent = "";
    btnNext.style.display = "none";
    sortingButtons.style.display = "flex";
    
    // Reset visual effects if any
    emojiEl.classList.remove("shake-error");

    // Select a random item from the array
    currentItem = items[Math.floor(Math.random() * items.length)];
    emojiEl.textContent = currentItem.emoji;
    wordEl.textContent = currentItem.word;
}

// Validates the chosen article
function checkArticle(chosenArticle) {
    if (chosenArticle === currentItem.article) {
        // Correct answer
        sortingButtons.style.display = "none";
        btnNext.style.display = "inline-block";
        feedbackEl.textContent = `Correct! ${currentItem.article.toUpperCase()} ${currentItem.word}. 🎉`;
        feedbackEl.className = "correct";
    } else {
        // Wrong answer logic - trigger CSS shake animation on the emoji
        emojiEl.classList.add("shake-error");
        
        // Remove the error class after the animation completes (400ms)
        setTimeout(() => {
            emojiEl.classList.remove("shake-error");
        }, 400); 
    }
}

// Event Listeners for buckets and navigation
btnA.addEventListener("click", () => checkArticle("a"));
btnAn.addEventListener("click", () => checkArticle("an"));
btnNext.addEventListener("click", startRound);

// Start the first round on load
startRound();