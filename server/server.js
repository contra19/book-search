const express = require('express'); // Import Express.js to create the server
const path = require('path'); // Import path to handle file paths for serving static files
const { ApolloServer } = require('@apollo/server'); // Import ApolloServer for setting up GraphQL API
const { expressMiddleware } = require('@apollo/server/express4'); // Import Apollo middleware for Express.js integration
const { authMiddleware } = require('./utils/auth'); // Import custom authentication middleware for securing routes
const { typeDefs, resolvers } = require('./schemas'); // Import GraphQL type definitions and resolvers
const db = require('./config/connection'); // Import database connection (MongoDB)
const PORT = process.env.PORT || 3001; // Define the server's port (use environment variable or default to 3001)

// Create a new ApolloServer instance with type definitions and resolvers
const server = new ApolloServer({
  typeDefs, // Define the schema for GraphQL
  resolvers, // Define how queries and mutations are handled
});

// Initialize the Express.js application
const app = express();

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON data in requests
app.use(express.json());

// Function to start the Apollo server and set up the Express app
const startApolloServer = async () => {
  await server.start(); // Start the Apollo server

  // Apply Apollo middleware for the '/graphql' route, using authMiddleware for authentication context
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware, // Attach authentication context to GraphQL
  }));

  // Serve static assets (like React app) in production mode
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'))); // Serve static files from the client 'dist' folder

    // Catch-all route to serve the React app for any other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html')); // Serve the React app
    });
  }

  // Connect to the MongoDB database and start the Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`); // Log the API server is running
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`); // Log the GraphQL endpoint
    });
  });
};

// Call the function to start the Apollo server and Express app
startApolloServer();
