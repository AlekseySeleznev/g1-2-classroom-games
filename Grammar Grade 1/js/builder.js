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

// DOM Elements
const instructionEl = document.getElementById("instruction-text");
const emojiEl = document.getElementById("item-emoji");
const dropZone = document.getElementById("drop-zone");
const wordBank = document.getElementById("word-bank");
const feedbackEl = document.getElementById("feedback");
const btnNext = document.getElementById("btn-next");

let currentSequence = [];
let currentStep = 0; // Tracks which word index the user should click next

// Initializes a new round
function startRound() {
    // Reset zones and UI
    dropZone.innerHTML = "";
    wordBank.innerHTML = "";
    feedbackEl.textContent = "";
    btnNext.style.display = "none";
    currentStep = 0; // Reset the step counter

    // Select random item and define if it's a question or a statement
    const currentItem = items[Math.floor(Math.random() * items.length)];
    emojiEl.textContent = currentItem.emoji;
    const isQuestion = Math.random() > 0.5;

    // Generate the correct sequence array including the dynamic article
    if (isQuestion) {
        instructionEl.textContent = "Ask a question! 🕵️‍♂️";
        currentSequence = ["Is", "this", currentItem.article, currentItem.word, "?"];
    } else {
        instructionEl.textContent = "Tell me what it is! ☝️";
        currentSequence = ["This", "is", currentItem.article, currentItem.word, "."];
    }

    // Shuffle words to populate the word bank
    const shuffledWords = [...currentSequence].sort(() => Math.random() - 0.5);

    // Create clickable block for each word
    shuffledWords.forEach((word, index) => {
        const wordEl = document.createElement("div");
        wordEl.textContent = word;
        wordEl.className = "clickable-word";
        wordEl.id = `word-${Date.now()}-${index}`; // Ensures unique ID
        
        // Add click event listener to each word
        wordEl.addEventListener("click", () => handleWordClick(wordEl));

        wordBank.appendChild(wordEl);
    });
}

// Handles the logic when a word is clicked
function handleWordClick(clickedElement) {
    const clickedWord = clickedElement.textContent;
    const expectedWord = currentSequence[currentStep];

    // Check if the clicked word is the correct next word in the sequence
    if (clickedWord === expectedWord) {
        
        // Move element from word bank to the sentence zone
        dropZone.appendChild(clickedElement);
        
        // Remove pointer events so it cannot be clicked again
        clickedElement.style.pointerEvents = "none";
        clickedElement.style.cursor = "default";
        clickedElement.style.transform = "none"; // Reset hover effect
        
        currentStep++; // Advance to the next required word

        // Check if the sequence is complete
        if (currentStep === currentSequence.length) {
            feedbackEl.textContent = "Perfect! 🎉";
            feedbackEl.className = "correct";
            btnNext.style.display = "inline-block";
        }
    } else {
        // Wrong word clicked: trigger CSS shake animation
        clickedElement.classList.add("shake-error");
        
        // Remove the error class after the animation completes (400ms)
        setTimeout(() => {
            clickedElement.classList.remove("shake-error");
        }, 400); 
    }
}

// Event Listener for the next round button
btnNext.addEventListener("click", startRound);

// Start the first round on load
startRound();