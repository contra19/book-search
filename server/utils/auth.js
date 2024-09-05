const jwt = require('jsonwebtoken'); // Importing jsonwebtoken to handle JWT (JSON Web Token) creation and verification
const { GraphQLError } = require('graphql'); // Import GraphQLError to throw custom errors in GraphQL

// Secret key used for signing the JWT and the expiration time for the token
const secret = 'thisisasecret'; // Secret key for JWT encryption (should be stored securely in production)
const expiration = '2h'; // Token expiration time (2 hours)

// Exporting the authentication utility functions and errors
module.exports = {
  // Custom AuthenticationError to throw in resolvers when authentication fails
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED', // Add an 'UNAUTHENTICATED' code for easier error handling on the client side
    },
  }),

  // Middleware function to authenticate and attach user data to the request object
  authMiddleware: function ({ req }) {
    // Get the token from the request body, query parameters, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If the token is provided in the authorization header, split the 'Bearer' prefix and get the token
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If no token is found, return the request object as is (unauthenticated)
    if (!token) {
      return req;
    }

    try {
      // Verify the token and extract user data (payload)
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Attach the user data to the request object
      req.user = data;
    } catch {
      // If token verification fails, log an error (token is invalid or expired)
      console.log('Invalid token');
    }

    // Return the request object, whether authenticated or not
    return req;
  },

  // Function to sign and create a new JWT
  signToken: function ({ username, email, _id }) {
    // Create a payload with the user data (username, email, _id)
    const payload = { username, email, _id };

    // Sign the token with the payload, secret key, and expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
