// Define DOM elements
const tl = document.querySelector("#grid__tl");
const tr = document.querySelector("#grid__tr");
const bl = document.querySelector("#grid__bl");
const br = document.querySelector("#grid__br");

const tlBtn = document.querySelector("#grid__tl__btn");
const trBtn = document.querySelector("#grid__tr__btn");
const blBtn = document.querySelector("#grid__bl__btn");
const brBtn = document.querySelector("#grid__br__btn");

const tlContent = document.querySelector("#grid__tl__content");
const trContent = document.querySelector("#grid__tr__content");
const blContent = document.querySelector("#grid__bl__content");
const brContent = document.querySelector("#grid__br__content");

const projectOne = document.querySelector(".p-1");
const projectTwo = document.querySelector(".p-2");
const projectThree = document.querySelector(".p-3");

// Define colors and positions
const bgColor = "var(--bg)";
const bgColorAlt = "var(--bg-alt)";
const textColor = "var(--text)";
const textColorAlt = "var(--text-alt)";

let tlActive = "translateX(5%) translateY(0)";
let tlHidden = "translateX(-100%) translateY(-100%)";

let trActive = "translateX(-5%) translateY(0)";
let trHidden = "translateX(100%) translateY(-100%)";

let blActive = "translateX(10%) translateY(7%)";
let blHidden = "translateX(-100%) translateY(100%)";

let brActive = "translateX(-5%) translateY(0)";
let brHidden = "translateX(100%) translateY(100%)";

// Define corner that is open
let activeCorner = null;

// Utility function to reset all buttons and content
function resetAll() {
  const buttons = [tlBtn, trBtn, blBtn, brBtn];
  const contents = [tlContent, trContent, blContent, brContent];

  buttons.forEach(button => {
    button.style.background = "var(--bg)";
    button.style.color = "var(--text)";
    button.innerHTML = button.id === "grid__tl__btn" ? "About" :
                       button.id === "grid__tr__btn" ? "Experience" :
                       button.id === "grid__bl__btn" ? "Projects" : "Contact";
  });

  contents.forEach(content => {
    content.style.transform = "translateX(-100%) translateY(-100%)"; // Hidden by default
    content.style.width = ""; // Reset any dynamic styling
    content.style.height = "";
    content.style.top = "";
    content.style.display = "none";
    content.style.alignItems = "";
    content.style.justifyContent = "";
    content.style.background = "";
    content.style.zIndex = "";
  });

  activeCorner = null;
}

// Function to apply specific styles based on the active corner
function applyStylesForCorner(corner) {
  switch (corner) {
    case "grid__tl__btn":
      tlContent.style.transform = "translateX(0) translateY(0)";
      tlContent.style.width = "100%";
      tlContent.style.height = "100%";
      tlContent.style.top = "0";
      tlContent.style.display = "flex";
      tlContent.style.alignItems = "center";
      tlContent.style.justifyContent = "center";
      tlContent.style.background = "var(--bg-transparent)";
      tlContent.style.zIndex = "200";
      break;

    case "grid__tr__btn":
      trContent.style.transform = "translateX(0) translateY(0)";
      trContent.style.width = "100%";
      trContent.style.height = "100%";
      trContent.style.top = "0";
      trContent.style.display = "flex";
      trContent.style.alignItems = "center";
      trContent.style.justifyContent = "center";
      trContent.style.background = "var(--bg-transparent)";
      trContent.style.zIndex = "200";
      break;

    case "grid__bl__btn":
      blContent.style.transform = "translateX(0) translateY(0)";
      blContent.style.width = window.innerWidth <= 600 ? "100%" : "70%";
      blContent.style.height = window.innerWidth <= 600 ? "100%" : "auto";
      blContent.style.top = window.innerWidth <= 600 ? "0" : "auto";
      blContent.style.display = "flex";
      blContent.style.alignItems = "center";
      blContent.style.justifyContent = "center";
      blContent.style.background = "var(--bg-transparent)";
      blContent.style.zIndex = "200";
      break;

    case "grid__br__btn":
      brContent.style.transform = "translateX(0) translateY(0)";
      brContent.style.width = "100%";
      brContent.style.height = "100%";
      brContent.style.bottom = "0";
      brContent.style.display = "flex";
      brContent.style.flexDirection = "column";
      brContent.style.alignItems = "center";
      brContent.style.justifyContent = "center";
      brContent.style.background = "var(--bg-transparent)";
      brContent.style.zIndex = "200";
      break;

    default:
      break;
  }
}

// Function to activate a specific button and content
function activateButton(button, content, label) {
  resetAll();
  activeCorner = button.id;

  // Set button active styles
  button.style.background = "var(--bg-alt)";
  button.style.color = "var(--text-alt)";
  button.innerHTML = `&uarr;<br/>${label}`;

  // Apply styles based on the corner
  applyStylesForCorner(button.id);
}

// Event listeners for buttons
tlBtn.addEventListener("click", () => {
  if (activeCorner === tlBtn.id) {
    resetAll();
  } else {
    activateButton(tlBtn, tlContent, "About");
  }
});

trBtn.addEventListener("click", () => {
  if (activeCorner === trBtn.id) {
    resetAll();
  } else {
    activateButton(trBtn, trContent, "Experience");
  }
});

blBtn.addEventListener("click", () => {
  if (activeCorner === blBtn.id) {
    resetAll();
  } else {
    activateButton(blBtn, blContent, "Projects");
  }
});

brBtn.addEventListener("click", () => {
  if (activeCorner === brBtn.id) {
    resetAll();
  } else {
    activateButton(brBtn, brContent, "Contact");
  }
});
