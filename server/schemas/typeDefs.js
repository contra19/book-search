const typeDefs = `
// User type defines the structure for a User object
  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

// Book type defines the structure for a Book object
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }

// Auth type defines the structure for an Auth object
  type Auth {
    token: ID!
    user: User
  }

// BookInput type defines the structure for a BookInput object
  input BookInput {
  bookId: String!
  authors: [String]
  title: String!
  description: String
  image: String
  link: String
  }

// Query type defines the structure for a Query object  
  type Query {
    me: User
  }

// Mutation type defines the structure for a Mutation object
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
