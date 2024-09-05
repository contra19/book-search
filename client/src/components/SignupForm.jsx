import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations'; // Importing GraphQL mutation for adding a new user

import Auth from '../utils/auth'; // Importing authentication utilities

const SignupForm = () => {
  // State to manage the form input data (username, email, and password)
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State to manage form validation status
  const [validated] = useState(false);

  // State to control visibility of the error alert
  const [showAlert, setShowAlert] = useState(false);

  // Apollo useMutation hook for executing the ADD_USER mutation
  const [addUser, { error }] = useMutation(ADD_USER);

  // useEffect hook to show/hide the alert if there is an error in the mutation
  useEffect(() => {
    if (error) {
      setShowAlert(true); // Show alert when there's an error
    } else {
      setShowAlert(false); // Hide alert if no error
    }
  }, [error]); // Dependency array: effect runs when `error` changes

  // Handler for updating the form input state as the user types
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Dynamically update the specific field in the form data state
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      // If the form is invalid, stop submission and propagation
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Execute the addUser mutation with the form data
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      // Log the returned data (for debugging purposes)
      console.log(data);

      // Log the user in and store the token using Auth utility
      Auth.login(data.addUser.token);
    } catch (err) {
      // Log any errors encountered during the signup process
      console.error(err);
    }

    // Reset the form fields after submission
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* Form with validation and form submission handling */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert message shown if there is an error with the registration */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)} // Close alert when dismissed
          show={showAlert} // Show alert based on `showAlert` state
          variant="danger" // Use Bootstrap's danger alert style (red)
        >
          There was an error with your registration!
        </Alert>

        {/* Username input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange} // Update form data on change
            value={userFormData.username} // Controlled component: form value is set by state
            required // Field is required
          />
          <Form.Control.Feedback type="invalid">
            Username is required to register!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange} // Update form data on change
            value={userFormData.email} // Controlled component: form value is set by state
            required // Field is required
          />
          <Form.Control.Feedback type="invalid">
            Email is required to register!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange} // Update form data on change
            value={userFormData.password} // Controlled component: form value is set by state
            required // Field is required
          />
          <Form.Control.Feedback type="invalid">
            Password is required to register!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit button */}
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password
            )
          } // Disable button if form data is incomplete
          type="submit"
          variant="success" // Use Bootstrap's success button style (green)
        >
          Sign Up
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
