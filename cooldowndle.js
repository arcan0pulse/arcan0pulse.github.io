let attempts = 0;
let allowed_attempts = 4;

import { ABILITIES } from "./abilities.js";

let abilityName;
let abilityImage;
let abilityCooldown;

const gameState = JSON.parse(localStorage.getItem("state")) || {
    gameNumber: -1,
    guesses: [],
    hasWon: false
};

const startDay = new Date("03/17/2024");
const gameNumber = getGameNumber();
const input = document.getElementById("answer-input");
const guessbutton = document.getElementById("guess-button");
const infobutton = document.getElementById("info-button")


intialize();

// Initialized the website and game board, picks an ability based on the day
function intialize() {
    Math.seedrandom(getGameNumber())
    let i = Math.floor(Math.random(getGameNumber()) * ABILITIES.length);
    abilityName = ABILITIES[i].split(";")[0];
    abilityCooldown = +ABILITIES[i].split(";")[1];
    abilityImage = "./icons/" + abilityName + ".webp";
    if (gameState.gameNumber !== gameNumber) {
        gameState.gameNumber = gameNumber;
        gameState.guesses = [];
        localStorage.setItem("state", JSON.stringify(gameState));
    } else {
         gameState.guesses.forEach(guess => {
             updateBoard(guess);
         });
         if (gameState.hasWon) endGame("Victory");
         else if (gameState.guesses.length == 4) endGame("Defeat");
    }
    document.addEventListener("keypress", e => enter(e));
    document.getElementById("ability-image").src = abilityImage;
    document.getElementById("ability-name").innerText = abilityName;
    guessbutton.onclick = () => submitGuess();
    infobutton.onclick = () => switchInfo();
}

// Accepts input from text field
function submitGuess() {
    let guess = input.value;
    input.value = "";
    if (guess.length > 0 && !isNaN(guess)) {
        updateBoard(guess);
        updateStorage(guess);
        if (+guess == abilityCooldown) {
            endGame("Victory");
            return;
        }
    }
    if (attempts == allowed_attempts) endGame("Defeat");
}

// Updates board with a made guess
function updateBoard(guess) {
    let guessContainer = document.createElement("div");
    guessContainer.innerText = guess;
    guessContainer.classList.add("revealed-answer");
    let arrowContainer = document.createElement("div");
    arrowContainer.classList.add("revealed-arrow");
    arrowContainer.innerText = guess < abilityCooldown ? "↑" : guess > abilityCooldown ? "↓" : "✔";
    let textfield = document.querySelectorAll(".answer-style")[attempts];
    textfield.classList.add("flip-out");
    setTimeout(() => {
        textfield.append(...[guessContainer, arrowContainer]);
        guessContainer.classList.add("flip-in");
        textfield.classList.add("transparent-background");
    }, 750);
    attempts++;
}

// Writes guess into local storage
function updateStorage(guess) {
    gameState.guesses.push(guess);
    localStorage.setItem("state", JSON.stringify(gameState));
}

// Ends game in win or loss
function endGame(msg) {
    document.getElementById("timer").style.visibility = "visible";
    gameState.hasWon = msg == "Victory" ? true : false;
    localStorage.setItem("state", JSON.stringify(gameState));
    let text = document.getElementById("ability-name");
    text.classList.add("flip-out");
    setTimeout(() => {
        text.innerText = msg;
        text.classList.add("flip-in");
    }, 750);
    input.disabled = true;
    guessbutton.disabled = true;
}

// Handle enter key press
function enter(event) {
    if (event.key == "Enter") submitGuess();
}

// Shows or hides info container
function switchInfo() {
    document.getElementById("info-container").style.display =
        document.getElementById("info-container").style.display == "none" ?
            "flex" : "none";
    document.getElementById("image-card").style.display =
        document.getElementById("image-card").style.display == "none" ?
                "flex" : "none";
        
}

// Calculates number of days since startDay has passed (based on UTC)
function getGameNumber() {
    const currDate = new Date();
    let timeDiff = currDate.getTime() - startDay.getTime();
    let dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff);
}

// Function to calculate time until midnight UTC
function getTimeUntilMidnightUTC() {
    var now = new Date();
    var midnightUTC = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        24, // Hour for midnight
        0,  // Minute
        0,  // Second
        0   // Millisecond
    );
    var timeUntilMidnight = midnightUTC - now;
    return timeUntilMidnight;
}

// Function to format milliseconds into hh:mm:ss
function formatTime(milliseconds) {
    var hours = Math.floor(milliseconds / (1000 * 60 * 60));
    var minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return hours + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
}

// Function to update the timer display
function updateTimer() {
    var timeUntilMidnight = getTimeUntilMidnightUTC();
    if (timeUntilMidnight <= 0) {
        clearInterval(timer);
        document.getElementById('timer').innerText = "It's midnight UTC now!";
    } else {
        document.getElementById('timer').innerText = "Time until Reset: " + formatTime(timeUntilMidnight);
    }
}

// Update the timer display initially
updateTimer();

// Start the timer to update the display every second
var timer = setInterval(updateTimer, 1000);