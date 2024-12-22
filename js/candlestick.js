const canvas = document.getElementById("candlestick-chart");
const ctx = canvas.getContext("2d");
const xAxisOffset = 40; // Fixed distance above the times
const timeLabelOffset = 20; // Distance of time labels below the X-axis line
const yAxisValues = [485.00, 481.00, 477.00, 473.00, 469.00, 467.83, 465.00, 461.00, 457.00, 453.00]; // Explicit Y-axis values

// Resize canvas to fit the screen
function resizeCanvas() {
  const topBar = document.getElementById("top-bar"); // Get the top bar element
  const topBarHeight = topBar.getBoundingClientRect().height; // Dynamically calculate its height
  canvas.width = window.innerWidth; // Full browser width
  canvas.height = window.innerHeight - topBarHeight; // Subtract top bar height from canvas height
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
  const high = Math.min(maxPrice, Math.max(open, close) + Math.random() * 1);
const low = Math.max(minPrice, Math.min(open, close) - Math.random() * 1);

  lastPrice = close;

  return { x, open, close, high, low };
}

// Convert price to Y-coordinate
function priceToY(price) {
  const percent = (price - minPrice) / (maxPrice - minPrice);
  const drawableHeight = canvas.height - xAxisOffset; // Reduce by the X-axis offset
  return Math.min(
    canvas.height - xAxisOffset,
    Math.max(0, (1 - percent) * drawableHeight)
  ); // Ensure within bounds
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

  // Wicks (shortened)
  const wickTop = Math.max(
    priceToY(candle.high),
    priceToY(Math.max(candle.open, candle.close)) - 10 // Limit wick above body
  );
  const wickBottom = Math.min(
    priceToY(candle.low),
    priceToY(Math.min(candle.open, candle.close)) + 10 // Limit wick below body
  );

  ctx.strokeStyle = candleColor; // Use the same color as the candle body
  ctx.beginPath();
  ctx.moveTo(candle.x + candleWidth / 2, wickTop); // Top of the wick
  ctx.lineTo(candle.x + candleWidth / 2, wickBottom); // Bottom of the wick
  ctx.stroke();

  // Body
  ctx.fillStyle = candleColor;
  ctx.fillRect(
    candle.x,
    priceToY(Math.max(candle.open, candle.close)), // Top of the body
    candleWidth,
    Math.abs(priceToY(candle.open) - priceToY(candle.close)) // Height of the body
  );
}



// Draw the axes
// Draw the axes
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
      // Normal price label for other values with ticks
      ctx.fillStyle = textColor;
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(price.toFixed(2), canvas.width - 55, y + 4);

      // Draw ticks for prices
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 60, y); // Tick position on Y-axis
      ctx.lineTo(canvas.width - 65, y); // Tick extends slightly to the left
      ctx.stroke();
    }
  }

  // Draw Y-axis line
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 60, 0); // Vertical Y-axis
  ctx.lineTo(canvas.width - 60, canvas.height);
  ctx.stroke();
}

// Draw the X-axis (time labels)
function drawXAxis() {
  const textColor = "#999";
  const numLabels = Math.ceil(canvas.width / candleWidth);
  const xAxisLineHeight = canvas.height - xAxisOffset; // Fixed position for X-axis line
  const yAxisX = canvas.width - 60; // X-coordinate of the Y-axis

  // Draw the horizontal X-axis line up to the Y-axis
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, xAxisLineHeight); // Start at the leftmost edge
  ctx.lineTo(yAxisX, xAxisLineHeight); // End at the Y-axis
  ctx.stroke();

  // Draw time labels and vertical ticks
  for (let i = 0; i <= numLabels; i++) {
    const x = i * candleWidth + canvas.width - (numLabels * candleWidth);
    if (x >= yAxisX) break; // Stop drawing if past the Y-axis

    const time = formatTime(570 + timeOffset + i * 5); // Start at 9:30 AM

    // Draw time label slightly below the X-axis line
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText(time, x, xAxisLineHeight + timeLabelOffset);

    // Draw vertical ticks for time labels
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, xAxisLineHeight); // Start tick at the X-axis line
    ctx.lineTo(x, xAxisLineHeight - 5); // Extend tick upward
    ctx.stroke();
  }
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
