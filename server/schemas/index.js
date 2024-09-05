// Import the GraphQL type definitions and resolvers from their respective files
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Export the typeDefs and resolvers to make them available for use in the GraphQL server setup
module.exports = { typeDefs, resolvers };
