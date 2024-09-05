import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap'; // Importing Bootstrap components for layout and styling

import { useQuery, useMutation } from '@apollo/client'; // Apollo Client hooks for GraphQL queries and mutations
import { QUERY_ME } from '../utils/queries'; // Query to get user data
import { REMOVE_BOOK } from '../utils/mutations'; // Mutation to remove a saved book
import { removeBookId } from '../utils/localStorage'; // Utility to remove the book from localStorage

import Auth from '../utils/auth'; // Utility for authentication handling

const SavedBooks = () => {
  // useQuery hook to fetch the current user's saved books
  const { loading, data } = useQuery(QUERY_ME);

  // useMutation hook for removing a book from saved books
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // Destructure the user data from the query result, or return an empty object if data is undefined
  const userData = data?.me || {};

  // Function to handle the deletion of a saved book
  const handleDeleteBook = async (bookId) => {
    // Check if the user is logged in and has a valid token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false; // Exit if no token is found
    }

    try {
      // Call the removeBook mutation with the book ID
      await removeBook({
        variables: { bookId },
      });

      // Remove the book from local storage after successful deletion
      removeBookId(bookId);
    } catch (err) {
      console.error(err); // Log any errors that occur during the removal process
    }
  };

  // Show a loading message while the query is still fetching data
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* Display an error message if there's an issue deleting the book */}
      {error && <p className="text-danger">Error occurred while deleting the book.</p>}

      {/* Section for the user's saved books */}
      <div className="text-light bg-dark p-5">
        <Container fluid>
          <h1>Viewing {userData.username}&apos;s books!</h1>
        </Container>
      </div>

      <Container>
        {/* Display the number of saved books or a message if no books are saved */}
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>

        <div>
          <Row>
            {/* Loop through the user's saved books and render each book as a card */}
            {userData.savedBooks?.map((book) => {
              return (
                <Col key={book.bookId} md="4">
                  <Card border="dark">
                    {/* Display the book cover if available */}
                    {book.image ? (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    ) : null}
                    
                    {/* Display book details */}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className="small">Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      {/* Button to delete the book, calls handleDeleteBook with the bookId */}
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default SavedBooks;
