import { defineConfig } from 'vite'; // Importing Vite's config function to define project settings
import react from '@vitejs/plugin-react'; // Importing the React plugin for Vite

export default defineConfig({
  // Plugins section where Vite is configured to use the React plugin
  plugins: [react()],

  // Server configuration settings
  server: {
    port: 3000, // Set the development server to run on port 3000
    open: true, // Automatically open the browser when the server starts

    // Proxy configuration to handle API requests to the backend
    proxy: {
      '/graphql': { // Proxy all requests starting with '/graphql' to the backend server
        target: 'https://book-search-czj9.onrender.com', // The target server
        secure: false, // Disable SSL verification (if the target uses HTTPS)
        changeOrigin: true // Change the origin of the host header to the target URL
      }
    }
  }
});
