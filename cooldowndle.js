let attempts = 0;
let allowed_attempts = 4;

import { ABILITIES } from "./abilities.js";

let abilityName;
let abilityImage;
let abilityCooldown;

const gameState = JSON.parse(localStorage.getItem("state")) || {
    gameNumber: -1,
    guesses: [],
    hasWon: false,
  };

const startDay = new Date("03/17/2024");
const gameNumber = getGameNumber();
const input = document.getElementById("answer-input");
const guessbutton = document.getElementById("guess-button");


intialize();

//TODO: Jax, Elise, Jayce, Asol, Yuumi, Nidalee, Kled, Fizz, Hwei
function intialize() {
    if (gameState.gameNumber !== gameNumber) {
        gameState.gameNumber = gameNumber;
        gameState.guesses = [];
        gameState.hasWon = false;
        localStorage.setItem("state", JSON.stringify(gameState));
    }
    Math.seedrandom(getGameNumber())
    let i = Math.floor(Math.random(getGameNumber()) * ABILITIES.length);
    abilityName = ABILITIES[i].split(";")[0];
    abilityCooldown = ABILITIES[i].split(";")[1];
    abilityImage = "./icons/" + abilityName + ".webp";
    document.addEventListener("keypress", e => enter(e));
    document.getElementById("ability-image").src = abilityImage;
    document.getElementById("ability-name").innerText = abilityName;
    guessbutton.onclick = () => confirm();
}
 
function confirm() {
    let guess = input.value;
    console.log(guess);
    input.value = "";
    if (guess.length > 0 && !isNaN(guess)) {
        let guessContainer = document.createElement("div");
        guessContainer.innerText = guess;
        guessContainer.classList.add("revealed-answer");
        let arrowContainer = document.createElement("div");
        arrowContainer.classList.add("revealed-arrow");
        arrowContainer.innerText = guess == abilityCooldown ? "✔" : guess < abilityCooldown ? "↑" : "↓";
        let textfield = document.querySelectorAll(".answer-style")[attempts];
        textfield.classList.add("flip-out");
        setTimeout(() => {
            textfield.append(...[guessContainer, arrowContainer]);
            guessContainer.classList.add("flip-in");
            textfield.classList.add("transparent-background");
        }, 750);
        attempts++;
        if (+guess == abilityCooldown) {
            endGame("Victory");
            return;
        }
    }
    if (attempts == allowed_attempts) endGame("Defeat");
}

function endGame(msg) {
    let text = document.getElementById("ability-name");
    text.classList.add("flip-out");
    setTimeout(() => {
        text.innerText = msg;
        text.classList.add("flip-in");
    }, 750);
    input.disabled = true;
    guessbutton.disabled = true;
}

function enter(event) {
    if (event.key == "enter") confirm();
}

function getGameNumber() {
    const currDate = new Date();
    let timeDiff = currDate.getTime() - startDay.getTime();
    let dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff);
}