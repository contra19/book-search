const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB

// Connect to the MongoDB database
// The connection URI is either taken from the environment variable `MONGODB_URI` (for production) 
// or defaults to the local MongoDB instance at 'mongodb://127.0.0.1:27017/googlebooks'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

// Export the mongoose connection object so it can be used throughout the application
module.exports = mongoose.connection;
