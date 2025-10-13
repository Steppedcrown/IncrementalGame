import "./style.css";

// Create a small app container instead of replacing the whole body.
const app = document.createElement("main");
app.className = "app";

// Counter UI
let games = 0;
let UNITS_PER_SECOND = 0;

const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const counterLabel = document.createElement("div");
counterLabel.className = "counter-label";
counterLabel.textContent = `Games 🎮: ${games.toFixed(2)}`;

const incrementButton = document.createElement("button");
incrementButton.className = "increment-button";
incrementButton.type = "button";
const clickIncrement = 1;
incrementButton.textContent = "Develop Game";

// Purchase button factory + registry
type PurchaseButton = {
  name: string;
  button: HTMLButtonElement;
  cost: number;
  costScalar: number;
  increment: number;
};

const purchaseButtons: PurchaseButton[] = [];

function updateAllPurchaseButtons() {
  for (const pb of purchaseButtons) {
    pb.button.disabled = games < pb.cost;
  }
}

function createPurchaseButton(
  name: string,
  text: string,
  increment: number,
  initialCost: number,
  costScalar = 1.5,
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = `${name}`;
  btn.type = "button";

  const pb: PurchaseButton = {
    name,
    button: btn,
    cost: initialCost,
    costScalar,
    increment,
  };

  function updateButtonText() {
    btn.textContent = `${text} (${pb.cost} Games)`;
  }

  updateButtonText();

  btn.addEventListener("click", () => {
    if (games >= pb.cost) {
      games -= pb.cost;
      UNITS_PER_SECOND += pb.increment;
      pb.cost = Math.ceil(pb.cost * pb.costScalar);
      updateButtonText();
      counterLabel.textContent = `Games 🎮: ${games.toFixed(2)}`;
      updateAllPurchaseButtons();
    }
  });

  purchaseButtons.push(pb);
  // initialize disabled state based on current games
  btn.disabled = games < pb.cost;
  return btn;
}

incrementButton.addEventListener("click", () => {
  games += clickIncrement;
  counterLabel.textContent = `Games 🎮: ${games.toFixed(2)}`;
  updateAllPurchaseButtons();
});

// Purchase buttons:
createPurchaseButton("dev", "Buy Dev", 0.1, 10, 1.15); // Developer who increases units/sec by 0.1
createPurchaseButton("dev-team", "Buy Dev Team", 2, 100, 1.5); // Team of developers who increase units/sec by 2
createPurchaseButton("dev-studio", "Buy Dev Studio", 50, 1000, 1.75); // Studio of developers who increase units/sec by 50

counterContainer.appendChild(counterLabel);
counterContainer.appendChild(incrementButton);
// Append every purchase button that was created via createPurchaseButton()
for (const pb of purchaseButtons) {
  counterContainer.appendChild(pb.button);
}
app.appendChild(counterContainer);

// Ensure button enabled/disabled states are correct on initial render
updateAllPurchaseButtons();

document.body.appendChild(app);

// Auto-increment using requestAnimationFrame so we add fractional amounts per frame
// and achieve a cumulative increase of 1 unit per second.

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
