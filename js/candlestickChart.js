const canvas = document.getElementById("stockChart");
const ctx = canvas.getContext("2d");

// Clear any previous Monte Carlo timers
if (typeof monteCarloTimer !== "undefined") {
  console.log("Stopping Monte Carlo simulation.");
  clearInterval(monteCarloTimer);
}

// Resize canvas to fit the viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Candlestick Chart Data
const gridSpacing = 50;
const candleWidth = gridSpacing * 0.8;
const candleSpacing = gridSpacing * 0.2;
let candlesticks = [];

function generateCandlesticks() {
  candlesticks = []; // Reset candlesticks
  const totalCandles = Math.ceil(canvas.width / (candleWidth + candleSpacing));
  let lastPrice = canvas.height / 2;

  for (let i = 0; i < totalCandles; i++) {
    const volatility = canvas.height * 0.2; // Adjust volatility based on canvas height
    const open = lastPrice;
    const close = open + (Math.random() * volatility - volatility / 2);
    const high = Math.max(open, close) + Math.random() * volatility / 2;
    const low = Math.min(open, close) - Math.random() * volatility / 2;
    lastPrice = close;

    candlesticks.push({ x: i * (candleWidth + candleSpacing), open, close, high, low });
  }
}

function drawCandlesticks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  candlesticks.forEach(({ x, open, close, high, low }) => {
    const color = close > open ? "#00ff00" : "#ff0000"; // Green for bullish, red for bearish

    // Draw wick
    ctx.beginPath();
    ctx.moveTo(x, high);
    ctx.lineTo(x, low);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw body
    const bodyTop = Math.min(open, close);
    const bodyHeight = Math.abs(open - close);
    ctx.fillStyle = color;
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
  });

  console.log("Candlestick chart drawn."); // Debugging statement
}

function drawGrid() {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let y = 0; y <= canvas.height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let x = 0; x <= canvas.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  console.log("Grid drawn."); // Debugging statement
}

// Initialize Candlestick Chart
generateCandlesticks();
drawCandlesticks();
