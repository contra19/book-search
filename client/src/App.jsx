import './App.css'; // Import the main CSS file for styling
import { Outlet } from 'react-router-dom'; // Importing Outlet from react-router for nested routing
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'; // Apollo Client modules for setting up the GraphQL client
import { setContext } from '@apollo/client/link/context'; // Apollo Client's setContext for setting headers, including authorization

import Navbar from './components/Navbar'; // Importing the Navbar component

// Create an HTTP link to connect to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql', // Define the URI for the GraphQL endpoint
});

// Create an authorization link that adds the auth token to headers
const authLink = setContext((_, { headers }) => {
  // Get the JWT token from local storage
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers, // Include any existing headers
      // Add the Authorization header with the Bearer token if it exists
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize the Apollo Client with the authorization link and HTTP link
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine the auth link and HTTP link
  cache: new InMemoryCache(), // Set up in-memory caching for the client
});

function App() {
  return (
    // ApolloProvider provides the Apollo Client instance to the React component tree
    <ApolloProvider client={client}>
      {/* Navbar component, will be displayed on every page */}
      <Navbar />
      
      {/* Outlet is used to render child routes (nested routes) */}
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
