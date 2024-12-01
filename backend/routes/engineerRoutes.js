const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createOrUpdateEngineerProfile,
  getEngineerProfileByUserId,
  getAllPublishedEngineers,
  addBookingRequest,
  deleteEngineerRequest, 
} = require('../controllers/engineerController');

// Create or update an engineer profile
router.post('/profile', authenticate, createOrUpdateEngineerProfile);

// Get an engineer profile by user ID
router.get('/profile/:userId', authenticate, getEngineerProfileByUserId);

// Get all published engineer profiles
router.get('/all', getAllPublishedEngineers);

// Add a booking request to an engineer's profile
router.post('/requests', authenticate, addBookingRequest); // New route

router.delete('/request/:engineerId', authenticate, deleteEngineerRequest);


module.exports = router;
