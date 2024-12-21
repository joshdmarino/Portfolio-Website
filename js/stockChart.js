const canvas = document.getElementById('stockChart');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration
const gridSpacing = 50; // Smaller grid spacing for more lines
const candleWidth = 15; // Narrower candlesticks
const candleSpacing = 5; // Minimal spacing between candlesticks
const speed = 2; // Animation speed
const perspectiveFactor = 0.5; // Sharper perspective
let candlesticks = [];
let percentages = [];
let trendLine = [];

// Initialize random candlestick data
function generateCandlesticks() {
  const totalCandles = Math.ceil(canvas.width / (candleWidth + candleSpacing));
  let lastPrice = canvas.height / 2;

  for (let i = 0; i < totalCandles; i++) {
    const volatility = 100; // More prominent price changes
    const open = lastPrice;
    const close = open + (Math.random() * volatility - volatility / 2);
    const high = Math.max(open, close) + Math.random() * volatility / 2;
    const low = Math.min(open, close) - Math.random() * volatility / 2;
    lastPrice = close;

    candlesticks.push({ x: i * (candleWidth + candleSpacing), open, close, high, low });
    trendLine.push({ x: i * (candleWidth + candleSpacing), y: close });
  }
}
generateCandlesticks();

// Initialize static percentages
function generatePercentages() {
  for (let y = 0; y <= canvas.height; y += gridSpacing) {
    percentages.push({
      x: Math.random() * canvas.width,
      y: y,
      value: (Math.random() * 20 - 10).toFixed(2) + '%',
    });
  }
}
generatePercentages();

// Draw the grid with sharper perspective
function drawGrid() {
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;

  // Horizontal grid lines
  for (let y = 0; y <= canvas.height; y += gridSpacing) {
    const perspectiveOffset = perspectiveFactor * y;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width - perspectiveOffset, y);
    ctx.stroke();
  }

  // Vertical grid lines
  for (let x = 0; x <= canvas.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - perspectiveFactor * canvas.height, canvas.height);
    ctx.stroke();
  }
}

// Draw a single candlestick
function drawCandle({ x, open, close, high, low }) {
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

// Draw percentages at static positions
function drawPercentages() {
  ctx.fillStyle = '#00ffff';
  ctx.font = '14px Arial';

  percentages.forEach((p) => {
    ctx.fillText(p.value, p.x, p.y);
  });
}

// Draw the trend line that follows the pattern of candlesticks
function drawTrendLine() {
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  for (let i = 0; i < trendLine.length; i++) {
    const { x, y } = trendLine[i];
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

// Animate the chart
function animateChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the grid
  drawGrid();

  // Move candlesticks and trend line to the left
  for (let i = 0; i < candlesticks.length; i++) {
    candlesticks[i].x -= speed;
    trendLine[i].x -= speed;
  }

  // Remove off-screen elements and add new ones
  if (candlesticks[0].x + candleWidth < 0) {
    candlesticks.shift();
    trendLine.shift();

    const lastCandle = candlesticks[candlesticks.length - 1];
    const x = lastCandle.x + candleWidth + candleSpacing;
    const open = lastCandle.close;
    const close = open + (Math.random() * 100 - 50);
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;

    candlesticks.push({ x, open, close, high, low });
    trendLine.push({ x, y: close });
  }

  // Update percentages
  percentages.forEach((p) => {
    p.value = (Math.random() * 20 - 10).toFixed(2) + '%';
  });

  // Draw all elements
  drawTrendLine();
  drawPercentages();
  candlesticks.forEach(drawCandle);

  // Request the next frame
  requestAnimationFrame(animateChart);
}
animateChart();
