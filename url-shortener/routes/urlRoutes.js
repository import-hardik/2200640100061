const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createShortUrl,
  redirectUrl,
  getShortUrlInfo
} = require('../controllers/urlControllers');

// Define your routes
router.post('/shorturls', createShortUrl);            // Create short URL
router.get('/:shortcode', redirectUrl);               // Redirect by shortcode
router.get('/shorturl/:shortcode', getShortUrlInfo);  // Get stats/info

// Export the router
module.exports = router;

