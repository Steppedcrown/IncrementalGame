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

// Auto-increment using requestAnimationFrame so we add fractional amounts per frame
// and achieve a cumulative increase of 1 unit per second.
const UNITS_PER_SECOND = 1;

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
