import "./style.css";

// Create a small app container instead of replacing the whole body.
const app = document.createElement("main");
app.className = "app";

// Counter UI
let games = 0;

const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const counterLabel = document.createElement("div");
counterLabel.className = "counter-label";
counterLabel.textContent = `Games 🎮: ${games}`;

const incrementButton = document.createElement("button");
incrementButton.className = "increment-button";
incrementButton.type = "button";
const clickIncrement = 1;
incrementButton.textContent = "Develop Game";

const buyDevButton = document.createElement("button");
buyDevButton.className = "buy-dev-button";
buyDevButton.type = "button";
let devCost = 10;
const devIncrement = 1;
const devCostScalar = 1.5;
buyDevButton.textContent = `Buy Dev (${devCost} Games)`;

incrementButton.addEventListener("click", () => {
  games += clickIncrement;
  counterLabel.textContent = `Games 🎮: ${games}`;
});

buyDevButton.addEventListener("click", () => {
  if (games >= devCost) {
    games -= devCost;
    UNITS_PER_SECOND += devIncrement;
    devCost = Math.ceil(devCost * devCostScalar);
    counterLabel.textContent = `Games 🎮: ${games}`;
    buyDevButton.textContent = `Buy Dev (${devCost} Games)`;
  }
});

counterContainer.appendChild(counterLabel);
counterContainer.appendChild(incrementButton);
counterContainer.appendChild(buyDevButton);
app.appendChild(counterContainer);

document.body.appendChild(app);

// Auto-increment using requestAnimationFrame so we add fractional amounts per frame
// and achieve a cumulative increase of 1 unit per second.
let UNITS_PER_SECOND = 0;

let lastTimestamp: number | null = null;
let rafId: number | null = null;

function tick(timestamp: number) {
  if (lastTimestamp === null) lastTimestamp = timestamp;
  const deltaMs = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  const deltaSeconds = deltaMs / 1000;
  games += UNITS_PER_SECOND * deltaSeconds;
  // Display with two decimal places to show fractional growth
  counterLabel.textContent = `Games 🎮: ${games.toFixed(2)}`;

  rafId = globalThis.requestAnimationFrame(tick);
}

rafId = globalThis.requestAnimationFrame(tick);

// Cancel the animation when the page unloads to avoid leaks
globalThis.addEventListener("unload", () => {
  if (rafId !== null) globalThis.cancelAnimationFrame(rafId);
});
