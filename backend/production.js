// Modified version of index.js configured for production deployment
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'c41-uncc-news-secret-key';  // In production, store this in environment variables

// Database connection - using MongoDB
mongoose.connect('mongodb://localhost:27017/c41-uncc-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());

// Configure CORS for production - specifically allow your DigitalOcean IP
app.use(cors({
  origin: [
    'http://159.223.115.55',       // Your DigitalOcean IP
    'https://159.223.115.55',      // In case you set up HTTPS
    'http://localhost:4200'        // For local development
  ],
  credentials: true
}));

// Simple User model/schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Create default user if not exists
async function createDefaultUser() {
  try {
    const userExists = await User.findOne({ username: 'admin' });
    if (!userExists) {
      const defaultUser = new User({
        username: 'Chin',  // First name as per requirements
        password: 'Chin'   // Same as username per requirements
      });
      await defaultUser.save();
      console.log('Default user created successfully');
    } else {
      console.log('Default user already exists');
    }
  } catch (err) {
    console.error('Error creating default user:', err);
  }
}

createDefaultUser();

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

// Chart 1: UNCC Research Expenditures over fiscal years
app.get('/api/chart1', authenticateToken, (req, res) => {
  res.json({
    title: 'UNCC Research Expenditures (Fiscal Years 2018-2023)',
    labels: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023'],
    data: [42.0, 45.5, 50.0, 55.2, 92.0], // millions of dollars
    description: 'This chart shows UNCC\'s annual research expenditures in millions of dollars over fiscal years 2018-2023. The dramatic increase in 2022-2023 to $92 million represents a key milestone in achieving R1 Carnegie classification status, which requires research expenditures of at least $50 million.'
  });
});

// Chart 2: UNCC Research Expenditures by Academic Field (FY2023)
app.get('/api/chart2', authenticateToken, (req, res) => {
  res.json({
    title: 'UNC Charlotte Research Expenditures by Academic Field (FY2023)',
    labels: [
      'Computer & Information Sciences', 
      'Engineering', 
      'Physical Sciences', 
      'Social Sciences', 
      'Health Sciences', 
      'Other Sciences',
      'Non-Science & Engineering Fields'
    ],
    data: [12.0, 25.5, 7.9, 8.5, 3.5, 16.3, 26.3], // percentages of total
    expenditures: [11.07, 23.42, 7.28, 7.83, 3.23, 14.97, 24.20], // $ in millions
    description: 'This chart represents the percentage breakdown of research expenditures at UNC Charlotte in fiscal year 2023 by academic field. Engineering ($23.42M) and Non-Science & Engineering Fields ($24.20M) were the top contributors, followed by Other Sciences ($14.97M) and Computer & Information Sciences ($11.07M). Total research expenditure reached $92 million, exceeding the R1 threshold by $42 million.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
