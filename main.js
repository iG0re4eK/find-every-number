const config = { side: 50, gap: 5 };

const game = document.getElementById("game");
const size = document.getElementById("size");
const initGameBtn = document.getElementById("initGameBtn");
const countNumbers = document.getElementById("countNumbers");
const rightNumbers = document.getElementById("rightNumbers");
const timer = document.getElementById("timer");
const restartGameBtn = document.getElementById("restartGameBtn");

const gameScore = document.querySelector(".game-score");
const shadow = document.querySelector(".shadow");

const countNumber = document.getElementById("countNumber");
const countTime = document.getElementById("countTime");
const countAverageTime = document.getElementById("countAverageTime");
const countMinTime = document.getElementById("countMinTime");
const countMaxTime = document.getElementById("countMaxTime");

let startTime = 0;
let lastCorrectTime = 0;
let timeOfThought = [];

let gridSize = size.value;
let currentNumbers = [0];
let gameOverStatus = false;
let gameStartStatus = true;
let second = 0;
let minute = 0;
let timerInterval = null;

const updateTimer = () => {
  second++;
  if (second === 60) {
    second = 0;
    minute++;
  }

  const formattedMinute = minute < 10 ? `0${minute}` : minute;
  const formattedSecond = second < 10 ? `0${second}` : second;
  timer.textContent = `${formattedMinute}:${formattedSecond}`;
};

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  second = 0;
  minute = 0;
  timer.textContent = "00:00";
}

function gameOver() {
  if (!gameOverStatus) {
    countNumber.textContent = gridSize * gridSize;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    const formattedSecond = second < 10 ? `0${second}` : second;
    countTime.textContent = `${formattedMinute}:${formattedSecond}`;

    const averageTime =
      timeOfThought.length > 0
        ? (
            timeOfThought.reduce((a, b) => a + b, 0) /
            timeOfThought.length /
            1000
          ).toFixed(2)
        : 0;

    const minTime =
      timeOfThought.length > 0
        ? (Math.min(...timeOfThought) / 1000).toFixed(2)
        : 0;

    const maxTime =
      timeOfThought.length > 0
        ? (Math.max(...timeOfThought) / 1000).toFixed(2)
        : 0;

    countAverageTime.textContent = `${averageTime} сек`;
    countMinTime.textContent = `${minTime} сек`;
    countMaxTime.textContent = `${maxTime} сек`;

    gameScore.classList.add("show");
    shadow.classList.add("show");
    gameOverStatus = true;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  return;
}

function getCurrentNumber(num) {
  const expectedNumber = currentNumbers.length;

  if (num === expectedNumber) {
    currentNumbers.push(num);
    rightNumbers.textContent = currentNumbers.length - 1;
    return true;
  }
  return false;
}

function generateNumbers(size) {
  let temp = [];
  for (let i = 0; i < size * size; i++) {
    temp.push(i + 1);
  }
  return temp;
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function init() {
  timeOfThought = [];
  startTime = 0;
  lastCorrectTime = 0;
  gameScore.classList.remove("show");
  shadow.classList.remove("show");
  gameOverStatus = false;
  gameStartStatus = true;
  resetTimer();
  currentNumbers = [0];
  gridSize = size.value;

  if (gridSize < 3 || gridSize > 10) {
    alert("Пожалуйста, выберите размер от 3 до 10.");
    return;
  }

  const numbers = generateNumbers(gridSize);
  countNumbers.textContent = numbers.length;
  rightNumbers.textContent = currentNumbers.length - 1;

  game.style.width = `${gridSize * (config.side + config.gap) - config.gap}px`;
  game.style.height = `${gridSize * (config.side + config.gap) - config.gap}px`;
  game.style.display = "grid";
  game.style.gridTemplateColumns = `repeat(${gridSize}, ${config.side}px)`;
  game.style.gap = `${config.gap}px`;

  game.innerHTML = "";

  while (numbers.length > 0) {
    const randomIndex = getRandomIndex(numbers);
    const square = document.createElement("div");
    square.className = "square";
    square.textContent = numbers[randomIndex];
    square.style.width = `${config.side}px`;
    square.style.height = `${config.side}px`;
    game.appendChild(square);
    numbers.splice(randomIndex, 1);
  }
}

document.addEventListener("DOMContentLoaded", init);

initGameBtn.addEventListener("click", init);
restartGameBtn.addEventListener("click", init);

game.addEventListener("click", (event) => {
  if (event.target.classList.contains("square") && !gameOverStatus) {
    if (gameStartStatus) {
      gameStartStatus = false;
      startTime = Date.now();
      lastCorrectTime = startTime;
      timerInterval = setInterval(updateTimer, 1000);
    }

    const num = parseInt(event.target.textContent);
    const currentTime = Date.now();

    if (getCurrentNumber(num)) {
      event.target.classList.add("hide");
      if (currentNumbers.length > 2) {
        const timeDelta = currentTime - lastCorrectTime;
        timeOfThought.push(timeDelta);
        lastCorrectTime = currentTime;
      }
    } else {
      event.target.classList.add("incorrect");
      event.target.addEventListener("animationend", () => {
        event.target.classList.remove("incorrect");
      });
    }

    if (currentNumbers.length - 1 === Number(countNumbers.textContent)) {
      gameOver();
    }
  }
});
