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
  gameScore.classList.remove("show");
  shadow.classList.remove("show");
  gameOverStatus = false;
  gameStartStatus = true;
  resetTimer();
  currentNumbers = [0];
  const gridSize = size.value;

  if (gridSize < 3 || gridSize > 8) {
    alert("Пожалуйста, выберите размер от 3 до 8.");
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
      timerInterval = setInterval(updateTimer, 1000);
    }

    const num = parseInt(event.target.textContent);

    if (getCurrentNumber(num)) event.target.classList.add("hide");

    if (currentNumbers.length - 1 === Number(countNumbers.textContent)) {
      gameOver();
    }
  }
});
