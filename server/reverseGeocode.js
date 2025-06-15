const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'YourAppName/1.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

module.exports = router;
