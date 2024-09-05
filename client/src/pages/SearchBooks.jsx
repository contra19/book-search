import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap'; // Importing Bootstrap components for layout and styling

import { useMutation } from '@apollo/client'; // Apollo Client hook for mutations
import { SAVE_BOOK } from '../utils/mutations'; // GraphQL mutation to save a book
import { saveBookIds, getSavedBookIds } from '../utils/localStorage'; // Utility functions for managing saved book IDs in local storage

import Auth from '../utils/auth'; // Utility for authentication handling

const SearchBooks = () => {
  // State to store the books returned from the search
  const [searchedBooks, setSearchedBooks] = useState([]);

  // State to manage the value in the search input field
  const [searchInput, setSearchInput] = useState('');

  // State to store the IDs of books that have been saved
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Apollo Client hook to handle the SAVE_BOOK mutation
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // useEffect hook to persist the saved book IDs in local storage
  useEffect(() => {
    saveBookIds(savedBookIds); // Save the current state of saved book IDs to local storage
  }, [savedBookIds]); // Re-run when the savedBookIds state changes

  // Function to handle form submission and search for books
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // If no search input is provided, exit early
    if (!searchInput) {
      return false;
    }

    try {
      // Make a request to the Google Books API to search for books
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // Extract the items (books) from the API response
      const { items } = await response.json();

      // If no books are found, clear the search results
      if (!items) {
        setSearchedBooks([]);
        return;
      }

      // Map the books to a format that can be used in the component
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '', // Use a placeholder image if none is available
        infoLink: book.volumeInfo.infoLink || '', // Link to the book's Google Books page
      }));

      // Update the searchedBooks state with the book data
      setSearchedBooks(bookData);
      // Clear the search input after the search is complete
      setSearchInput('');
    } catch (err) {
      console.error(err); // Log any errors that occur during the search
    }
  };

  // Function to handle saving a book
  const handleSaveBook = async (bookId) => {
    // Find the book that corresponds to the given bookId
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    // Check if the user is logged in by verifying the token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.log("No token found, user is not logged in.");
      return false; // Exit if the user is not logged in
    }

    // If no book data is found, log an error and exit
    if (!bookToSave) {
      console.error("Error: Book data not found.");
      return;
    }

    try {
      // Execute the saveBook mutation to save the book to the user's account
      await saveBook({
        variables: {
          bookData: {
            bookId: bookToSave.bookId,
            authors: bookToSave.authors || ["N/A"],
            title: bookToSave.title,
            description: bookToSave.description || "",
            image: bookToSave.image || "",
            link: bookToSave.infoLink || "",
          }
        }
      });

      // Add the saved book ID to the savedBookIds state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);

    } catch (err) {
      console.error("Error saving book:", err); // Log any errors that occur during the save operation
    }
  };

  return (
    <>
      {/* Display an error message if there's an issue saving the book */}
      {error && <p className="text-danger">Error occurred while saving the book.</p>}

      {/* Search form for finding books */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput} // Controlled input for the search field
                  onChange={(e) => setSearchInput(e.target.value)} // Update searchInput state when the input changes
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      {/* Display search results */}
      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark" className='mb-3'>
                  {/* Display the book cover if available */}
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    {/* Book details */}
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>

                    {/* Button to view the book on Google Books */}
                    <Button
                      as="a"
                      href={book.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      className="mb-2"
                    >
                      View on Google Books
                    </Button>

                    {/* Save book button (only shown if the user is logged in) */}
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some(
                          (savedId) => savedId === book.bookId
                        )} // Disable the button if the book is already saved
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)} // Save the book when clicked
                      >
                        {savedBookIds?.some((savedId) => savedId === book.bookId)
                          ? 'Book Already Saved!'
                          : 'Save This Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
