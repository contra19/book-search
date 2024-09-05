import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const LoginForm = () => {
  // State to store the form data entered by the user (email and password)
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });

  // State to control form validation (Bootstrap form validation)
  const [validated] = useState(false);

  // State to control the visibility of the error alert
  const [showAlert, setShowAlert] = useState(false);

  // Apollo useMutation hook for the LOGIN_USER mutation
  const [login, { error }] = useMutation(LOGIN_USER);

  // useEffect hook to show the error alert if there's an error from the mutation
  useEffect(() => {
    if (error) {
      setShowAlert(true); // Show alert if there's an error
    } else {
      setShowAlert(false); // Hide alert if no error
    }
  }, [error]); // Runs every time the 'error' changes

  // Handler for input changes in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the form data state with the new input values
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      // If form validation fails, prevent submission and propagation
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Execute the login mutation with the user's form data
      const { data } = await login({
        variables: { ...userFormData },
      });

      console.log(data); // Log the returned data (for debugging purposes)

      // Call the Auth login function to save the token and log the user in
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e); // Log any errors that occur during login
    }

    // Reset the form data after submission
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* The form element with validation and submission handling */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert that shows when there's an error with login credentials */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)} // Close the alert when dismissed
          show={showAlert} // Show the alert based on state
          variant="danger" // Set alert color to danger (red)
        >
          You have provided an invalid username/password combination!
        </Alert>

        {/* Email field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange} // Update state on change
            value={userFormData.email} // Controlled input value
            required // Mark the field as required
          />
          <Form.Control.Feedback type="invalid">
            Email is required to sign in!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange} // Update state on change
            value={userFormData.password} // Controlled input value
            required // Mark the field as required
          />
          <Form.Control.Feedback type="invalid">
            Password is required to sign in!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit button for login */}
        <Button
          disabled={!(userFormData.email && userFormData.password)} // Disable button if form is incomplete
          type="submit"
          variant="success" // Bootstrap variant for styling
        >
          Login
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
