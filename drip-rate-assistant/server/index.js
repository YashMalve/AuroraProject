const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API: Parkland calculator (mirrors client logic)
app.post('/api/parkland', (req, res) => {
  const { weight, tbsa, timeSinceBurn, dropFactor } = req.body;
  const w = parseFloat(weight);
  const t = parseFloat(tbsa);
  const time = parseFloat(timeSinceBurn);
  const df = parseInt(dropFactor, 10) || 15;

  if (!w || w <= 0 || !t || t <= 0) {
    return res.status(400).json({ error: 'Invalid weight or TBSA' });
  }

  const total = 4 * w * t;
  const half = total / 2;
  const safeTime = Math.max(0, Math.min(24, time || 0));
  let rate = 0;

  if (safeTime < 8) {
    const remainingHours = 8 - safeTime;
    const remainingMinutes = remainingHours * 60;
    rate = (half * df) / remainingMinutes;
  } else if (safeTime < 24) {
    const remainingHours = 24 - safeTime;
    const remainingMinutes = remainingHours * 60;
    rate = (half * df) / remainingMinutes;
  } else {
    rate = 0;
  }

  return res.json({
    total24h: Math.round(total),
    first8h: Math.round(half),
    next16h: Math.round(half),
    currentRate: Math.round(rate)
  });
});

// Serve static client in production
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  res.sendFile(indexHtml, err => {
    if (err) res.status(404).send('Not Found');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
