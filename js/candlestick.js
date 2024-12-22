const canvas = document.getElementById("candlestick-chart");
const ctx = canvas.getContext("2d");
const xAxisLineHeight = canvas.height + 770;
const yAxisValues = [485.00, 481.00, 477.00, 473.00, 469.00, 467.83, 465.00, 461.00, 457.00, 453.00]; // Explicit Y-axis values


// Resize canvas to fit the screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Candlestick settings
const candlesticks = [];
const candleWidth = 40; // Width of each candlestick
let lastPrice = canvas.height / 2; // Start in the middle of the screen
const priceRange = 40; // Price range from 489 to 449
const minPrice = 449; // Minimum price for Y-axis
const maxPrice = 489; // Maximum price for Y-axis
const redLinePrice = 467.83; // Fixed value for the red dashed line
let timeOffset = 0; // Time offset for X-axis (in minutes)

// Generate a random candlestick that stays within a centered range
function generateCandle(x) {
  const priceChange = Math.random() * 20 - 10;
  const open = lastPrice;
  const close = Math.max(
    minPrice,
    Math.min(maxPrice, lastPrice + priceChange)
  );
  const high = Math.min(xAxisLineHeight, Math.max(open, close) + Math.random() * 10); // Cap at xAxisLineHeight
  const low = Math.max(0, Math.min(open, close) - Math.random() * 10); // Ensure it doesn’t go below 0

  lastPrice = close;

  return { x, open, close, high, low };
}


// Convert price to Y-coordinate
function priceToY(price) {
  const percent = (price - minPrice) / (maxPrice - minPrice);
  return Math.min(canvas.height, Math.max(0, canvas.height - percent * canvas.height));
}

// Format time in HH:MM military format, resetting after 24:00
function formatTime(minutes) {
  const totalMinutes = minutes % (24 * 60); // Reset after 24 hours
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Draw a single candlestick
function drawCandle(candle) {
    // Determine if the candle is bullish or bearish
    const isBullish = candle.close > candle.open;
  
    // Set the color for the candle
    const candleColor = isBullish ? "rgba(0, 128, 0, 0.8)" : "rgba(255, 0, 0, 0.8)";
    
    // Wicks
    ctx.strokeStyle = candleColor; // Use the same color as the candle body
    ctx.beginPath();
    ctx.moveTo(candle.x + candleWidth / 2, priceToY(candle.high));
    ctx.lineTo(candle.x + candleWidth / 2, priceToY(candle.low));
    ctx.stroke();
  
    // Body
    ctx.fillStyle = candleColor;
    ctx.fillRect(
      candle.x,
      priceToY(Math.max(candle.open, candle.close)),
      candleWidth,
      Math.abs(priceToY(candle.open) - priceToY(candle.close))
    );
  }
  

// Draw the axes
function drawAxes() {
  const axisColor = "#666";
  const textColor = "#999";

  // Draw Y-axis (prices on the right side)
  for (let i = 0; i < yAxisValues.length; i++) {
    const price = yAxisValues[i];
    const y = priceToY(price);

    if (price === 467.83) {
      // Highlight this specific price with a red box
      ctx.fillStyle = "red";
      ctx.fillRect(canvas.width - 59, y - 10, 60, 20); // Red box to the right of Y-axis
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(price.toFixed(2), canvas.width - 36, y + 5); // White text centered in box
    } else {
      // Normal price label for other values
      ctx.fillStyle = textColor;
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(price.toFixed(2), canvas.width - 55, y + 4);
    }
  }

  // Draw axis line
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 60, 0); // Vertical Y-axis
  ctx.lineTo(canvas.width - 60, canvas.height);
  ctx.stroke();
}
  
// Draw the red dashed line
function drawRedLine() {
  const redLineY = priceToY(redLinePrice);
  ctx.setLineDash([5, 5]); // Dashed line
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Faded red
  ctx.beginPath();
  ctx.moveTo(0, redLineY);
  ctx.lineTo(canvas.width, redLineY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset to solid line
}

// Draw the X-axis (time labels)
function drawXAxis() {
  const textColor = "#999";
  const numLabels = Math.ceil(canvas.width / candleWidth);

  // Draw the line above the times
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, xAxisLineHeight); // Position the line at xAxisLineHeight
  ctx.lineTo(canvas.width, xAxisLineHeight);
  ctx.stroke();

  // Draw time labels below the line
  for (let i = 0; i <= numLabels; i++) {
    const x = i * candleWidth + canvas.width - (numLabels * candleWidth);
    const time = formatTime(570 + timeOffset + i * 5); // Start at 9:30 AM

    // Position time labels slightly below the X-axis line
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText(time, x, canvas.height - 10); // 10px from the bottom of the canvas // Position the line 40px above the bottom of the canvas

  }
}


// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the red dashed line
  drawRedLine();

  // Draw axes
  drawAxes();

  // Draw X-axis (time labels)
  drawXAxis();

  // Move candlesticks to the left
  for (let candle of candlesticks) {
    candle.x -= 4; // Adjust speed for smooth motion
  }

  // Remove off-screen candles
  while (candlesticks.length && candlesticks[0].x + candleWidth < 0) {
    candlesticks.shift();
    timeOffset += 5; // Increment time as candles move off the screen
  }

  // Add new candles at the Y-axis
  if (
    candlesticks.length === 0 ||
    candlesticks[candlesticks.length - 1].x + candleWidth <= canvas.width - 60
  ) {
    const newCandleX = candlesticks.length
      ? candlesticks[candlesticks.length - 1].x + candleWidth
      : canvas.width - 60; // Start at the Y-axis
    candlesticks.push(generateCandle(newCandleX));
  }

  // Draw candlesticks
  for (let candle of candlesticks) {
    drawCandle(candle);
  }

  requestAnimationFrame(animate);
}

// Start animation
animate();
