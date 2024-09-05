const { Schema } = require('mongoose'); // Importing Schema from mongoose to define a subdocument schema

// This is a subdocument schema for books, to be embedded in the User model's `savedBooks` array
const bookSchema = new Schema({
  // Array of authors for the book, each author is a string
  authors: [
    {
      type: String,
    },
  ],
  // Description of the book, required field
  description: {
    type: String,
    required: true,
  },
  // Unique book ID from the Google Books API, required field
  bookId: {
    type: String,
    required: true,
  },
  // URL for the book's cover image (optional)
  image: {
    type: String,
  },
  // Link to the book's Google Books page (optional)
  link: {
    type: String,
  },
  // Title of the book, required field
  title: {
    type: String,
    required: true,
  },
});

module.exports = bookSchema; // Export the schema so it can be used in other models (e.g., User model)
