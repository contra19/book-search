const { Schema, model } = require('mongoose'); // Import Schema and model from mongoose
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Import the bookSchema from the Book.js file
const bookSchema = require('./Book');

// Define the user schema using mongoose's Schema constructor
const userSchema = new Schema(
  {
    // User's username, required and must be unique
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // User's email, required and must be unique, with basic email validation
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'], // Regular expression to validate email format
    },
    // User's password, required
    password: {
      type: String,
      required: true,
    },
    // Array of saved books, using the bookSchema for structure
    savedBooks: [bookSchema],
  },
  // Settings to include virtual properties in JSON responses
  {
    toJSON: {
      virtuals: true, // Allow virtuals (like bookCount) to be included in JSON responses
    },
  }
);

// Pre-save middleware to hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  // If the user is new or the password has been modified, hash the password
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10; // Number of salt rounds for bcrypt hashing
    this.password = await bcrypt.hash(this.password, saltRounds); // Hash the password
  }

  next(); // Proceed to the next middleware or save the user
});

// Custom method to compare and validate the password when logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare the input password with the hashed password in the database
};

// Virtual property `bookCount` that returns the number of saved books for the user
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length; // Return the length of the savedBooks array
});

// Create the User model using the userSchema
const User = model('User', userSchema);

// Export the User model to use in other parts of the application
module.exports = User;
