const { User } = require('../models'); // Import the User model from the models directory
const { signToken, AuthenticationError } = require('../utils/auth'); // Import the token signing utility and authentication error class

// Define the resolvers for GraphQL queries and mutations
const resolvers = {
  // Query resolvers
  Query: {
    // 'me' query to get the currently authenticated user's data
    me: async (parent, args, context) => {
      // Check if the user is authenticated by checking the context
      if (context.user) {
        // Find the user by their ID, excluding versioning and password fields
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData; // Return the user's data
      }

      // Throw an authentication error if the user is not logged in
      throw AuthenticationError;
    },
  },

  // Mutation resolvers
  Mutation: {
    // Mutation to add a new user
    addUser: async (parent, args) => {
      // Create a new user with the provided arguments (username, email, password)
      const user = await User.create(args);
      // Generate a token for the newly created user
      const token = signToken(user);

      // Return the token and the user data
      return { token, user };
    },

    // Mutation to log in a user
    login: async (parent, { email, password }) => {
      // Find the user by their email
      const user = await User.findOne({ email });

      // If no user is found, throw an authentication error
      if (!user) {
        throw AuthenticationError;
      }

      // Check if the provided password matches the user's password
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, throw an authentication error
      if (!correctPw) {
        throw AuthenticationError;
      }

      // Generate a token for the logged-in user
      const token = signToken(user);
      // Return the token and the user data
      return { token, user };
    },

    // Mutation to save a book to the authenticated user's savedBooks array
    saveBook: async (parent, { bookData }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Find the user by their ID and add the book to the savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } }, // Use $push to add the new book data
          { new: true } // Return the updated document
        );

        return updatedUser; // Return the updated user data
      }

      // Throw an authentication error if the user is not logged in
      throw AuthenticationError;
    },

    // Mutation to remove a saved book from the user's savedBooks array
    removeBook: async (parent, { bookId }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Find the user by their ID and remove the book from the savedBooks array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } }, // Use $pull to remove the book by its bookId
          { new: true } // Return the updated document
        );

        return updatedUser; // Return the updated user data
      }

      // Throw an authentication error if the user is not logged in
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers; // Export the resolvers to be used in the GraphQL server
