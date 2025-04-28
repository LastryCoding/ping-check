import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4500;

app.use(cors());

app.get('/ping', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.json();

    const log = {
      timestamp: new Date().toISOString(),
      ip,
      country: geoData.country,
      regionName: geoData.regionName,
      city: geoData.city,
    };

    console.log(log);

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error fetching geo data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
