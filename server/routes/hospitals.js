const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const haversineDistance = require('../utils/distanceCalculator');

router.post('/nearest-hospitals', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const hospitals = await dbService.getAllHospitals();

    const validHospitals = hospitals.filter(
      h => h.latitude !== null && h.longitude !== null
    );

    const hospitalsWithDistance = validHospitals.map(h => {
      const distance = haversineDistance(
        latitude,
        longitude,
        h.latitude,
        h.longitude
      );

      return { ...h, distance };
    });

    const sorted = hospitalsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    res.json({
      success: true,
      data: sorted.slice(0, 5)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
