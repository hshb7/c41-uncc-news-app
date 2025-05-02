require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';

// MongoDB connection (for cloud MongoDB Atlas with retry logic)
// Using MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://cibeanu3:cibeanu3@cluster0.sm6yxwl.mongodb.net/c41-app?retryWrites=true&w=majority';

// Connect with improved error handling
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
    initializeUserModel();
  })
  .catch(err => {
    console.error('MongoDB Atlas connection error:', err);
    console.log('Using hardcoded credentials for login');
  });

// Simple User schema for MongoDB - moved to a function
let User = null;

function initializeUserModel() {
  try {
    const UserSchema = new mongoose.Schema({
      username: String,
      password: String
    });
    
    // Create model (will be created in MongoDB when connected)
    User = mongoose.model('User', UserSchema);
    
    // Add default user on startup if not already present
    User.findOne({ username: 'Chinedu' })
      .then(existingUser => {
        if (!existingUser) {
          const defaultUser = new User({ username: 'Chinedu', password: 'Chinedu' });
          defaultUser.save()
            .then(() => console.log('Default user created'))
            .catch(err => console.error('Error saving default user:', err));
        } else {
          console.log('Default user already exists');
        }
      })
      .catch(err => console.error('Error checking for default user:', err));
  } catch (error) {
    console.error('Error creating User model:', error);
  }
}

// Configure CORS to allow requests from Angular frontend
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Hardcoded credentials (fallback if database is unavailable)
const USERNAME = 'Chinedu';
const PASSWORD = 'Chinedu';

// JWT Auth middleware
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

// Login endpoint with database check and hardcoded fallback
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username); // Log login attempts
  
  // Always check hardcoded credentials first for reliability
  if (username === USERNAME && password === PASSWORD) {
    console.log('Login successful using hardcoded credentials');
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  
  // Only try database if it's connected
  try {
    if (User && mongoose.connection.readyState === 1) {
      const userInDb = await User.findOne({ username, password });
      if (userInDb) {
        console.log('Login successful using database credentials');
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
      }
    }
  } catch (error) {
    console.error('Database lookup error:', error);
  }
  
  console.log('Login failed for user:', username);
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Chart 1: UNCC Research Expenditures Leading to R1 Status
app.get('/api/chart1', authenticateToken, (req, res) => {
  res.json({
    title: 'UNCC Research Expenditures (Fiscal Years 2018-2023)',
    labels: ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023'],
    data: [42.0, 45.5, 50.0, 55.2, 92.0], // In millions of dollars
    description: 'This chart shows UNCC\'s annual research expenditures in millions of dollars over fiscal years, demonstrating the dramatic growth that led to achieving R1 Carnegie classification. Note the significant jump to $92 million in 2022-2023, far exceeding the $50 million threshold required for R1 status. This major increase helped the university climb into the top 20% of research universities nationwide.'
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

// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'Backend running', 
    database: dbStatus 
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

