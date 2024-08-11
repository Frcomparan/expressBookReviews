const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  let validUser = isValid(username);

  if (!validUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: 'User registered' });
});

// // Get the book list available in the shop with async/await
public_users.get('/', async (req, res) => {
  // Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  // Write your code here
  let { isbn } = req.params;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book);
});

// Get book details based on author async/await
public_users.get('/author/:author', async (req, res) => {
  // Write your code here
  let { author } = req.params;

  author = author.split('-').join(' ');

  let booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(booksByAuthor);
});

// Get all books based on title async/await
public_users.get('/title/:title', async (req, res) => {
  // Write your code here
  let { title } = req.params;

  title = title.split('-').join(' ');

  let booksByTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let { isbn } = req.params;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
