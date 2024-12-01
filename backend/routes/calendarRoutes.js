const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  addCalendarEntry,
  getCalendarEntriesByEngineer,
  getUserDetails,
  getCalendarEntries,
} = require('../controllers/calendarController');

// Add a calendar entry
router.post('/', authenticate, addCalendarEntry);

// Get calendar entries for a specific engineer
router.get('/:engineerId', authenticate, getCalendarEntriesByEngineer);

// Get all calendar entries


router.get('/user/:userId', authenticate, getUserDetails);


router.get('/', authenticate, getCalendarEntries);




module.exports = router;
