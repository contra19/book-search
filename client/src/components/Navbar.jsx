import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';

const AppNavbar = () => {
  // State to handle the visibility of the modal (for login/signup)
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Navigation bar component */}
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          {/* Brand name linking to the home page */}
          <Navbar.Brand as={Link} to='/'>
            Google Books Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          {/* Collapsible part of the navbar */}
          <Navbar.Collapse id='navbar' className='justify-content-end'>
            <Nav className='ms-auto'>
              {/* Link to the search page */}
              <Nav.Link as={Link} to='/'>
                Search For Books
              </Nav.Link>

              {/* Conditional rendering based on user authentication status */}
              {Auth.loggedIn() ? (
                <>
                  {/* Link to the saved books page for logged-in users */}
                  <Nav.Link as={Link} to='/saved'>
                    My Saved Books
                  </Nav.Link>
                  {/* Logout link for logged-in users */}
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                // Login/Sign Up link for guests
                <Nav.Link onClick={() => setShowModal(true)}>
                  Login/Sign Up
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Login/Signup */}
      <Modal
        size='lg' // Large-sized modal
        show={showModal} // Control visibility of the modal with state
        onHide={() => setShowModal(false)} // Hide modal when the close button is clicked
        aria-labelledby='signup-modal' // ARIA label for accessibility
      >
        {/* Tab container for switching between Login and Signup forms */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              {/* Tab navigation for Login/Signup */}
              <Nav variant='pills'>
                <Nav.Item>
                  {/* Tab to show Login form */}
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  {/* Tab to show Signup form */}
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Tab content switching between Login and Signup forms */}
            <Tab.Content>
              {/* Login form */}
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>

              {/* Signup form */}
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
