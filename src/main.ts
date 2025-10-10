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
incrementButton.textContent = "Develop Game";

incrementButton.addEventListener("click", () => {
  games += 1;
  counterLabel.textContent = `Games 🎮: ${games}`;
});

counterContainer.appendChild(counterLabel);
counterContainer.appendChild(incrementButton);
app.appendChild(counterContainer);

document.body.appendChild(app);

// Auto-increment: increase the counter by 1 every 1000ms (1 second)
const AUTO_INCREMENT_AMOUNT = 1;
const AUTO_INCREMENT_INTERVAL_MS = 1000;

const intervalId = setInterval(() => {
  games += AUTO_INCREMENT_AMOUNT;
  counterLabel.textContent = `Games 🎮: ${games}`;
}, AUTO_INCREMENT_INTERVAL_MS);

// Clear interval when the page is unloaded to avoid leaks in some environments
globalThis.addEventListener("unload", () => clearInterval(intervalId));
