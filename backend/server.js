
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const partnerRoutes = require('./routes/partners');
const orderRoutes = require('./routes/orders');
const assignmentRoutes = require('./routes/assignments');

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    // You would replace this URL with your MongoDB connection string in the .env file
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/delivery_system';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/partners', partnerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/assignments', assignmentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Delivery System API is running');
});

// Start the server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
