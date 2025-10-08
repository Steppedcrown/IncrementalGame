import "./style.css";

// Create a small app container instead of replacing the whole body.
const app = document.createElement("main");
app.className = "app";

// Counter UI
let count = 0;

const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const counterLabel = document.createElement("div");
counterLabel.className = "counter-label";
counterLabel.textContent = `Count: ${count}`;

const incrementButton = document.createElement("button");
incrementButton.className = "increment-button";
incrementButton.type = "button";
incrementButton.textContent = "Increment";

incrementButton.addEventListener("click", () => {
  count += 1;
  counterLabel.textContent = `Count: ${count}`;
});

counterContainer.appendChild(counterLabel);
counterContainer.appendChild(incrementButton);
app.appendChild(counterContainer);

document.body.appendChild(app);
