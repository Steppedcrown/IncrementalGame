import keyboardUrl from "./img/keyboard.png";
import "./style.css";

// Create a small app container instead of replacing the whole body.
const app = document.createElement("main");
app.className = "app";

// #region State getters/setters
// Counter UI (private backing values)
let _loc = 0;
let _locPerSecond = 0;
let _clickIncrement = 1;

function getLoc(): number {
  return _loc;
}

function setLoc(value: number) {
  _loc = value;
  // keep the display in sync (two decimals)
  counterLabel.textContent = `${Math.floor(_loc)} Lines of Code`;
  // update purchase buttons enabled state when games changes
  updateAllPurchaseButtons();
}

function getLocPerSecond(): number {
  return _locPerSecond;
}

function setLocPerSecond(value: number) {
  _locPerSecond = value;
  incrementLabel.textContent = `per sec: ${_locPerSecond.toFixed(1)}`;
}

function getClickIncrement(): number {
  return _clickIncrement;
}

function _setClickIncrement(value: number) {
  _clickIncrement = value;
}
// #endregion

// #region UI setup
const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const counterLabel = document.createElement("div");
counterLabel.className = "counter-label";
counterLabel.textContent = `${Math.floor(_loc)} Lines of Code`;

const incrementLabel = document.createElement("div");
incrementLabel.className = "increment-label";
incrementLabel.textContent = `per sec: ${_locPerSecond.toFixed(1)}`;

const autoButtons = document.createElement("div");
autoButtons.className = "auto-buttons";

// Image button (uses keyboard2.jpg). Clicking it acts like the Develop Game button.
const keyboardButton = document.createElement("button");
keyboardButton.className = "keyboard-button";
keyboardButton.type = "button";
const keyboardImg = document.createElement("img");
keyboardImg.src = keyboardUrl;
keyboardImg.alt = "Keyboard";
keyboardImg.className = "keyboard-img";
keyboardButton.appendChild(keyboardImg);

keyboardButton.addEventListener(
  "click",
  () => setLoc(getLoc() + getClickIncrement()),
);
// #endregion

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
    pb.button.disabled = getLoc() < pb.cost;
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
    btn.textContent = `${text} (${pb.cost} LOC) Total: ${pb.count}`;
  }

  updateButtonText();

  btn.addEventListener("click", () => {
    if (getLoc() >= pb.cost) {
      setLoc(getLoc() - pb.cost);
      setLocPerSecond(getLocPerSecond() + pb.increment);
      pb.cost = Math.ceil(pb.cost * pb.costScalar);
      pb.count += 1;
      updateButtonText();
    }
  });

  purchaseButtons.push(pb);
  // initialize disabled state based on current games
  btn.disabled = getLoc() < pb.cost;
  return btn;
}

// #region Purchase buttons:
createPurchaseButton("dev", "Buy Dev", 0.1, 10, 1.15); // Developer who increases units/sec by 0.1
createPurchaseButton("dev-team", "Buy Dev Team", 2, 100, 1.5); // Team of developers who increase units/sec by 2
createPurchaseButton("dev-studio", "Buy Dev Studio", 50, 1000, 1.75); // Studio of developers who increase units/sec by 50
// #endregion

// #region Assemble UI
counterContainer.appendChild(counterLabel);
counterContainer.appendChild(incrementLabel);
counterContainer.appendChild(keyboardButton);
// Append every purchase button that was created via createPurchaseButton()
for (const pb of purchaseButtons) {
  autoButtons.appendChild(pb.button);
}
app.appendChild(counterContainer);
app.appendChild(autoButtons);

// Ensure button enabled/disabled states are correct on initial render
updateAllPurchaseButtons();

document.body.appendChild(app);
// #endregion

// #region Auto-increment
// Auto-increment using requestAnimationFrame so we add fractional amounts per frame
// and achieve a cumulative increase of x units per second.

let lastTimestamp: number | null = null;
let rafId: number | null = null;

function tick(timestamp: number) {
  if (lastTimestamp === null) lastTimestamp = timestamp;
  const deltaMs = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  const deltaSeconds = deltaMs / 1000;
  setLoc(getLoc() + getLocPerSecond() * deltaSeconds);

  rafId = globalThis.requestAnimationFrame(tick);
}

rafId = globalThis.requestAnimationFrame(tick);
// #endregion

// Cancel the animation when the page unloads to avoid leaks
globalThis.addEventListener("unload", () => {
  if (rafId !== null) globalThis.cancelAnimationFrame(rafId);
});
