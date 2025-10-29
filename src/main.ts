import keyboardUrl from "./img/keyboard.png";
import "./style.css";

// Create a small app container instead of replacing the whole body.
const app = document.createElement("main");
app.className = "app";

// #region State getters/setters
// Counter UI (private backing values)
let lines = 0;
let linesPerSecond = 0;
const manualClickIncrement = 1;

function getLines(): number {
  return lines;
}

function setLines(value: number) {
  lines = value;
  // keep the display in sync (two decimals)
  counterLabel.textContent = `${Math.floor(lines)} Lines of Code`;
  // update purchase buttons enabled state when games changes
  updateAllPurchaseButtons();
}

function getLinesPerSecond(): number {
  return linesPerSecond;
}

function setLinesPerSecond(value: number) {
  linesPerSecond = value;
  incrementLabel.textContent = `per sec: ${linesPerSecond.toFixed(1)}`;
}

function getClickIncrement(): number {
  return manualClickIncrement;
}
// #endregion

// #region UI setup
const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const counterLabel = document.createElement("div");
counterLabel.className = "counter-label";
counterLabel.textContent = `${Math.floor(lines)} Lines of Code`;

const incrementLabel = document.createElement("div");
incrementLabel.className = "increment-label";
incrementLabel.textContent = `per sec: ${linesPerSecond.toFixed(1)}`;

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
  () => setLines(getLines() + getClickIncrement()),
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
  description: string;
};

const purchaseButtons: PurchaseButton[] = [];

function updateAllPurchaseButtons() {
  for (const pb of purchaseButtons) {
    pb.button.disabled = getLines() < pb.cost;
  }
}

function createPurchaseButton(
  name: string,
  text: string,
  increment: number,
  initialCost: number,
  costScalar = 1.5,
  description = "",
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = `purchase-button ${name}`;
  btn.type = "button";

  const pb: PurchaseButton = {
    name,
    button: btn,
    cost: initialCost,
    costScalar,
    increment,
    count: 0,
    description,
  };

  function updateButtonText() {
    // Structured HTML: title + cost on the left, count on the right (spanning two lines), description below.
    btn.innerHTML = `
      <div class="purchase-head">
        <div class="purchase-main">
          <div class="purchase-title">${text}</div>
          <div class="purchase-cost">${pb.cost} LOC</div>
        </div>
        <div class="purchase-count">${pb.count}</div>
      </div>
      <div class="purchase-desc">${pb.description}</div>
    `;
  }

  updateButtonText();

  btn.addEventListener("click", () => {
    if (getLines() >= pb.cost) {
      setLines(getLines() - pb.cost);
      setLinesPerSecond(getLinesPerSecond() + pb.increment);
      pb.cost = Math.ceil(pb.cost * pb.costScalar);
      pb.count += 1;
      updateButtonText();
    }
  });

  purchaseButtons.push(pb);
  // initialize disabled state based on current games
  btn.disabled = getLines() < pb.cost;
  return btn;
}

//#region Create purchase buttons
createPurchaseButton(
  "unpaid-intern",
  "Unpaid Intern",
  0.5,
  10,
  1.2,
  "Fresh out of college and full of passion. Works tirelessly for exposure and a slice of leftover pizza. Produces a few lines of code per second—when not updating their resume.",
);

createPurchaseButton(
  "coffee-maker",
  "In-Studio Coffee Maker",
  3,
  100,
  1.18,
  "The sacred machine that fuels crunch time. Every cup brewed adds a measurable spike in productivity (and heart palpitations).",
);

createPurchaseButton(
  "stack-guru",
  "Stack Overflow Guru",
  25,
  1000,
  1.24,
  "A mysterious figure who appears whenever you're stuck. Instantly boosts your efficiency by copy-pasting ancient snippets of wisdom from the internet.",
);

createPurchaseButton(
  "bug-generator",
  "Procedural Bug Generator",
  200,
  6000,
  1.3,
  "Turns your simple codebase into a sprawling mess of 'emergent gameplay.' Fixing these bugs somehow counts as writing new code.",
);

createPurchaseButton(
  "ai-assistant",
  "AI Code Assistant",
  1250,
  14000,
  1.25,
  "Claims it’ll automate your work. Instead, spends 80% of its time explaining your own code back to you and 20% writing slightly broken functions—but at least it’s fast!",
);
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
  setLines(getLines() + getLinesPerSecond() * deltaSeconds);

  rafId = globalThis.requestAnimationFrame(tick);
}

rafId = globalThis.requestAnimationFrame(tick);
// #endregion

// Cancel the animation when the page unloads to avoid leaks
globalThis.addEventListener("unload", () => {
  if (rafId !== null) globalThis.cancelAnimationFrame(rafId);
});
