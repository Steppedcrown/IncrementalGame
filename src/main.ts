import "./style.css";

// Create a small app container instead of replacing the whole body.
const app = document.createElement("main");
app.className = "app";

// Counter UI (private backing values)
let _games = 0;
let _gamesPerSecond = 0;

function getGames(): number {
  return _games;
}

function setGames(value: number) {
  _games = value;
  // keep the display in sync (two decimals)
  counterLabel.textContent = `Games 🎮: ${_games.toFixed(2)}`;
  // update purchase buttons enabled state when games changes
  updateAllPurchaseButtons();
}

function getGamesPerSecond(): number {
  return _gamesPerSecond;
}

function setGamesPerSecond(value: number) {
  _gamesPerSecond = value;
  incrementLabel.textContent = `${_gamesPerSecond.toFixed(2)} Games/sec`;
}

const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const counterLabel = document.createElement("div");
counterLabel.className = "counter-label";
counterLabel.textContent = `Games 🎮: ${getGames().toFixed(2)}`;

const incrementLabel = document.createElement("div");
incrementLabel.className = "increment-label";
incrementLabel.textContent = `${getGamesPerSecond().toFixed(2)} Games/sec`;

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
  count: number;
};

const purchaseButtons: PurchaseButton[] = [];

function updateAllPurchaseButtons() {
  for (const pb of purchaseButtons) {
    pb.button.disabled = getGames() < pb.cost;
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
    count: 0,
  };

  function updateButtonText() {
    btn.textContent = `${text} (${pb.cost} Games)
    Total: ${pb.count}`;
  }

  updateButtonText();

  btn.addEventListener("click", () => {
    if (getGames() >= pb.cost) {
      setGames(getGames() - pb.cost);
      setGamesPerSecond(getGamesPerSecond() + pb.increment);
      pb.cost = Math.ceil(pb.cost * pb.costScalar);
      pb.count += 1;
      updateButtonText();
    }
  });

  purchaseButtons.push(pb);
  // initialize disabled state based on current games
  btn.disabled = getGames() < pb.cost;
  return btn;
}

incrementButton.addEventListener("click", () => {
  setGames(getGames() + clickIncrement);
});

// Purchase buttons:
createPurchaseButton("dev", "Buy Dev", 0.1, 10, 1.15); // Developer who increases units/sec by 0.1
createPurchaseButton("dev-team", "Buy Dev Team", 2, 100, 1.5); // Team of developers who increase units/sec by 2
createPurchaseButton("dev-studio", "Buy Dev Studio", 50, 1000, 1.75); // Studio of developers who increase units/sec by 50

counterContainer.appendChild(counterLabel);
counterContainer.appendChild(incrementLabel);
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
  setGames(getGames() + getGamesPerSecond() * deltaSeconds);

  rafId = globalThis.requestAnimationFrame(tick);
}

rafId = globalThis.requestAnimationFrame(tick);

// Cancel the animation when the page unloads to avoid leaks
globalThis.addEventListener("unload", () => {
  if (rafId !== null) globalThis.cancelAnimationFrame(rafId);
});
