// /server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const consultRoutes = require('./routes/consultRoutes');
const engineerRoutes = require('./routes/engineerRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('DB connection error:', err));

// Middleware
app.use(helmet()); // Add security headers
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // CORS configuration
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting
app.use('/api/protected', protectedRoutes);
app.use('/api', consultRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/engineers', engineerRoutes);
app.use('/api/calendar', calendarRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
