const canvas = document.getElementById("stockChart");
const ctx = canvas.getContext("2d");

// Resize canvas to fit the viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Monte Carlo Simulation Data
let monteCarloPaths = [];
let monteCarloTimer = null;

function generateMonteCarloPath(startPrice, numSteps) {
  const path = [startPrice];
  for (let i = 1; i < numSteps; i++) {
    const lastPrice = path[i - 1];
    const change = (Math.random() * 2 - 1) * 0.01 * startPrice; // Small random changes
    path.push(Math.max(0, lastPrice + change));
  }
  return path;
}

function addMonteCarloLine() {
  const startPrice = canvas.height / 2;
  const numSteps = 100;
  const path = generateMonteCarloPath(startPrice, numSteps);
  monteCarloPaths.push(path);

  drawMonteCarloSimulation();
}

function drawMonteCarloSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  monteCarloPaths.forEach((path) => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 0.5)`;
    ctx.lineWidth = 1;
    path.forEach((y, step) => {
      const x = (canvas.width / path.length) * step;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

// Start Monte Carlo Simulation
monteCarloPaths = [];
if (monteCarloTimer) clearInterval(monteCarloTimer);
monteCarloTimer = setInterval(addMonteCarloLine, 500);
