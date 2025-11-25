// server/routes/trips.js - CORRECT ROUTES FILE
const express = require('express');
const router = express.Router();
const {
  getTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const protect = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router;