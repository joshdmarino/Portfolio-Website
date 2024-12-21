const canvas = document.getElementById('stockChart');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mode (true = dark mode, false = light mode)
let isDarkMode = false;

// Monte Carlo Simulation Configuration
function generateMonteCarloPaths(numPaths, numSteps, startPrice) {
  const paths = [];
  for (let i = 0; i < numPaths; i++) {
    const path = [startPrice];
    for (let j = 1; j < numSteps; j++) {
      const lastPrice = path[j - 1];
      const change = (Math.random() * 2 - 1) * 0.01 * startPrice; // Slow, small random changes
      path.push(Math.max(0, lastPrice + change)); // Ensure non-negative prices
    }
    paths.push(path);
  }
  return paths;
}

function drawMonteCarloSimulation() {
  const numPaths = 200;
  const numSteps = 100;
  const startPrice = canvas.height / 2;

  // Generate simulation data
  const paths = generateMonteCarloPaths(numPaths, numSteps, startPrice);

  // Clear the canvas and set light mode background
  ctx.fillStyle = '#fff'; // Light background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each path
  paths.forEach((path) => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    ctx.lineWidth = 1;
    path.forEach((y, step) => {
      const x = (canvas.width / numSteps) * step;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

// Candlestick Chart Configuration
const gridSpacing = 50; // Grid line spacing
const candleWidth = gridSpacing * 0.8; // Candlestick width proportional to grid
const candleSpacing = gridSpacing * 0.2; // Spacing between candlesticks proportional to grid
const speed = 2; // Animation speed
const centerY = canvas.height / 2; // Vertical center of the canvas
const centerRange = canvas.height * 0.6; // Candlesticks stay within 60% of center
let candlesticks = [];

function generateCandlesticks() {
  const totalCandles = Math.ceil(canvas.width / (candleWidth + candleSpacing));
  let lastPrice = centerY;

  for (let i = 0; i < totalCandles; i++) {
    const volatility = centerRange / 3; // Increase volatility for longer candlesticks
    const open = lastPrice;
    const close = open + (Math.random() * volatility - volatility / 2);
    const high = Math.max(open, close) + Math.random() * volatility / 2;
    const low = Math.min(open, close) - Math.random() * volatility / 2;
    lastPrice = Math.max(centerY - centerRange / 2, Math.min(centerY + centerRange / 2, close)); // Clamp to center range

    candlesticks.push({ x: i * (candleWidth + candleSpacing), open, close, high, low });
  }
}
generateCandlesticks();

function drawGrid() {
  ctx.strokeStyle = isDarkMode ? '#333' : '#ccc'; // Dark or light grid
  ctx.lineWidth = 1;

  // Horizontal grid lines
  for (let y = 0; y <= canvas.height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Vertical grid lines
  for (let x = 0; x <= canvas.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawCandlestick({ x, open, close, high, low }) {
  const color = close > open ? '#00ff00' : '#ff0000'; // Green for bullish, red for bearish

  // Draw the wick
  ctx.beginPath();
  ctx.moveTo(x, high);
  ctx.lineTo(x, low);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw the body
  const bodyTop = Math.min(open, close);
  const bodyHeight = Math.abs(open - close);
  ctx.fillStyle = color;
  ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
}

function drawCandlesticks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.fillStyle = '#000'; // Dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  // Move candlesticks to the left
  for (let i = 0; i < candlesticks.length; i++) {
    candlesticks[i].x -= speed;
  }

  // Remove off-screen candlesticks and add new ones
  if (candlesticks[0].x + candleWidth < 0) {
    candlesticks.shift();

    const lastCandle = candlesticks[candlesticks.length - 1];
    const x = lastCandle.x + candleWidth + candleSpacing;
    const open = lastCandle.close;
    const close = open + (Math.random() * (centerRange / 3) - centerRange / 6);
    const high = Math.max(open, close) + Math.random() * (centerRange / 6);
    const low = Math.min(open, close) - Math.random() * (centerRange / 6);

    candlesticks.push({ x, open, close, high, low });
  }

  // Draw all candlesticks
  candlesticks.forEach(drawCandlestick);
}

// Animation Loop
function animateChart() {
  if (isDarkMode) {
    drawCandlesticks();
  } else {
    drawMonteCarloSimulation();
  }
  requestAnimationFrame(animateChart);
}
animateChart();

// Toggle Mode Function
function toggleMode(darkMode) {
  isDarkMode = darkMode;
}
