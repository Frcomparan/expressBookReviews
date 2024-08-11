const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let validUser = users.filter((user) => user.username === username);
  if (validUser.length > 0) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let authUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (authUser.length > 0) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  let { username, password } = req.body;

  // Verify if username and password are present
  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  let authUser = authenticatedUser(username, password);

  if (authUser) {
    let accessToken = jwt.sign({ username: username }, 'access token secret');

    req.session.authorization = { accessToken: accessToken };

    return res.status(200).json({ message: 'User logged in' });
  }

  return res.status(403).json({ message: 'Invalid username or password' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  let { isbn } = req.params;

  let { review } = req.body;

  let accessToken = req.session.authorization;

  if (!accessToken) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  jwt.verify(
    accessToken['accessToken '],
    'access token secret',
    function (err, user) {
      if (!err) {
        let book = books.filter((book) => book.isbn === isbn);

        if (book.length > 0) {
          book[0].reviews.push(review);
          return res.status(200).json({ message: 'Review added' });
        }
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(403).json({ message: 'User not authenticated' });
    }
  );
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  let { isbn } = req.params;
  let { review } = req.body;

  let accessToken = req.session.authorization;

  if (!accessToken) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  jwt.verify(
    accessToken['accessToken'],
    'access token secret',
    function (err, user) {
      if (!err) {
        let book = books.filter((book) => book.isbn === isbn);

        if (book.length > 0) {
          let index = book[0].reviews.indexOf(review);

          if (index > -1) {
            book[0].reviews.splice(index, 1);
            return res.status(200).json({ message: 'Review deleted' });
          }
          return res.status(404).json({ message: 'Review not found' });
        }
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(403).json({ message: 'User not authenticated' });
    }
  );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
