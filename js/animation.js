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

let tlActive = "translateX(5vw) translateY(0)";
let tlHidden = "translateX(-100vw) translateY(-100vh)";

let trActive = "translateX(-5vw) translateY(0)";
let trHidden = "translateX(100vw) translateY(-100vh)";

let blActive = "translateX(10vw) translateY(7vh)";
let blHidden = "translateX(-100vw) translateY(100vh)";

let brActive = "translateX(-5vw) translateY(0)";
let brHidden = "translateX(100vw) translateY(100vh)";

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
                       button.id === "grid__bl__btn" ? "Projects" : "More";
  });

  contents.forEach(content => {
    content.style.transform = "translateX(-100vw) translateY(-100vh)"; // Hidden by default
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
      tlContent.style.width = "100vw";
      tlContent.style.height = "100vh";
      tlContent.style.top = "0";
      tlContent.style.display = "flex";
      tlContent.style.alignItems = "center";
      tlContent.style.justifyContent = "center";
      tlContent.style.background = "var(--bg-transparent)";
      tlContent.style.zIndex = "200";
      break;

    case "grid__tr__btn":
      trContent.style.transform = "translateX(0) translateY(0)";
      trContent.style.width = "100vw";
      trContent.style.height = "100vh";
      trContent.style.top = "0";
      trContent.style.display = "flex";
      trContent.style.alignItems = "center";
      trContent.style.justifyContent = "center";
      trContent.style.background = "var(--bg-transparent)";
      trContent.style.zIndex = "200";
      break;

    case "grid__bl__btn":
      blContent.style.transform = "translateX(0) translateY(0)";
      blContent.style.width = window.innerWidth <= 600 ? "100vw" : "70%";
      blContent.style.height = window.innerWidth <= 600 ? "100vh" : "auto";
      blContent.style.top = window.innerWidth <= 600 ? "0" : "auto";
      blContent.style.display = "flex";
      blContent.style.alignItems = "center";
      blContent.style.justifyContent = "center";
      blContent.style.background = "var(--bg-transparent)";
      blContent.style.zIndex = "200";
      break;

    case "grid__br__btn":
      brContent.style.transform = "translateX(0) translateY(0)";
      brContent.style.width = "100vw";
      brContent.style.height = "100vh";
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
// Add event listener to handle window resizing
window.addEventListener("resize", handleWindowResize);

// Store last reverse animation
let lastReverseAnimation = "";

// Play animation function
function playAnimation(animation, reverseAnimation) {
  heroImage.className = ""; // Reset heroImage animation classes
  if (lastReverseAnimation !== "") {
    heroImage.classList.add(lastReverseAnimation);
    setTimeout(() => {
      heroImage.classList.remove(lastReverseAnimation);
      heroImage.classList.add(animation);
      lastReverseAnimation = reverseAnimation;
    }, 200);
  } else {
    heroImage.classList.add(animation);
    lastReverseAnimation = reverseAnimation;
  }
}

// Handle closing animations
function playClosingAnimation(reverseAnimation) {
  // Reset button and content styles
  resetAll();
  if (activeCorner) {
    switch (activeCorner) {
      case "grid__tl__btn":
        tlContent.style.transform = tlHidden;
        break;
      case "grid__tr__btn":
        trContent.style.transform = trHidden;
        break;
      case "grid__bl__btn":
        blContent.style.transform = blHidden;
        break;
      case "grid__br__btn":
        brContent.style.transform = brHidden;
        break;
      default:
        break;
    }
  }
  lastReverseAnimation = reverseAnimation;
  activeCorner = null;
  heroImage.classList.add(reverseAnimation);
  setTimeout(() => {
    heroImage.classList.remove(reverseAnimation);
  }, 200);
}

// Handle window resizing
function handleWindowResize() {
  switch (activeCorner) {
    case "grid__bl__btn":
        blActive = "translateX(0) translateY(0)";
        blContent.style.transform = "translateX(0vw) translateY(0)";
        blContent.style.width = "100vw";
        blContent.style.height = "100vh";
        blContent.style.top = "0";
        blContent.style.display = "flex";
        blContent.style.alignItems = "center";
        blContent.style.justifyContent = "center";
        blContent.style.background = "var(--bg-transparent)";
        blContent.style.zIndex = "200";
        projectOne.style.width = "35%";
        projectOne.style.margin = "auto auto 0.5rem";
        projectTwo.style.width = "35%";
        projectTwo.style.margin = "auto auto 0.5rem";
        projectThree.style.width = "35%";
        projectThree.style.margin = "auto auto 0.5rem";
      break;
  }
}

// Update activateButton function to include animations
function activateButton(button, content, label, animation, reverseAnimation) {
  resetAll();
  activeCorner = button.id;

  // Set active button styles
  button.style.background = "var(--bg-alt)";
  button.style.color = "var(--text-alt)";
  button.innerHTML = `&uarr;<br/>${label}`;

  // Apply styles based on the corner
  applyStylesForCorner(button.id);
  handleWindowResize();
  playAnimation(animation, reverseAnimation);
}

// Update event listeners to include animations
tlBtn.addEventListener("click", () => {
  if (activeCorner === "grid__tl__btn") {
    playClosingAnimation("reverse-animate-top-left");
  } else {
    activateButton(tlBtn, tlContent, "About", "animate-top-left", "reverse-animate-top-left");
  }
});

trBtn.addEventListener("click", () => {
  if (activeCorner === "grid__tr__btn") {
    playClosingAnimation("reverse-animate-top-right");
  } else {
    activateButton(trBtn, trContent, "Experience", "animate-top-right", "reverse-animate-top-right");
  }
});

blBtn.addEventListener("click", () => {
  if (activeCorner === "grid__bl__btn") {
    playClosingAnimation("reverse-animate-bottom-left");
  } else {
    activateButton(blBtn, blContent, "Projects", "animate-bottom-left", "reverse-animate-bottom-left");
  }
});

brBtn.addEventListener("click", () => {
  if (activeCorner === "grid__br__btn") {
    playClosingAnimation("reverse-animate-bottom-right");
  } else {
    activateButton(brBtn, brContent, "More", "animate-bottom-right", "reverse-animate-bottom-right");
  }
});