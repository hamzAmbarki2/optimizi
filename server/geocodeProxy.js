import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.get('/geocode', async (req, res) => {
  const { q, limit } = req.query;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${limit || 1}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ecommerce-dashboard/1.0 (hamza.mbarki@esprit.tn)' // Use your real email!
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Geocode error:', err);
    res.status(500).json({ error: 'Failed to fetch geocode' });
  }
});

router.get('/reverse-geocode', async (req, res) => {
  const { lat, lon, addressdetails } = req.query;
  console.log('Received reverse-geocode request:', req.query);
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=${addressdetails || 1}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ecommerce-dashboard/1.0 (admin@example.com)' // Use your real email!
      }
    });
    if (!response.ok) {
      console.error('Nominatim API error:', response.status, await response.text());
      return res.status(500).json({ error: 'Nominatim API error' });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Reverse geocode error:', err);
    res.status(500).json({ error: 'Failed to fetch reverse geocode' });
  }
});

export default router;
