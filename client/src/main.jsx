import ReactDOM from 'react-dom/client'; // Import ReactDOM to render the app in the browser
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import React Router modules for client-side routing
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for styling

import App from './App.jsx'; // Import the main App component
import SearchBooks from './pages/SearchBooks'; // Import the SearchBooks page component
import SavedBooks from './pages/SavedBooks'; // Import the SavedBooks page component

// Define the routes for the app using React Router's createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/', // Root path of the app
    element: <App />, // Main component to render for the root path
    errorElement: <h1 className='display-2'>Wrong page!</h1>, // Element to render for non-matching routes (404 page)
    children: [
      {
        index: true, // Default route for the root path (loads SearchBooks by default)
        element: <SearchBooks /> // Component to render for the default path ('/')
      }, 
      {
        path: '/saved', // Route for '/saved' path
        element: <SavedBooks /> // Component to render for the '/saved' path
      }
    ]
  }
]);

// Render the root of the app using ReactDOM's createRoot and RouterProvider to handle routing
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} /> // Provide the router to the entire app
);
