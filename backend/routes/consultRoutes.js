const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendConsult } = require('../controllers/consultController');

// Multer configuration
const upload = multer({ dest: 'uploads/' });

router.post('/consult', upload.single('file'), sendConsult);

module.exports = router;
