const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  for (const user of users) {
    if (user.username === username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username,password) => {
  for (const user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username or password is missing"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };

    return res.json({message: "User successfully logged in"});
  } else {
    return res.status(404).json({message: "Username or password incorrect"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { isbn } = req.params;
  const username = req.session.authorization['username'];

  let book = books[isbn];
  book.reviews[username] = review;

  return res.json({message: "Review submitted successfully!"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { isbn } = req.params;
  const username = req.session.authorization['username'];

  let book = books[isbn];
  let userReview = book.reviews[username];

  if (userReview) { // Check user has a review
    delete book.reviews[username];
    return res.json({message: "Book review deleted successfully!", data: {book}});
  } else {
    return res.status(404).json({message: "Book review not found!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
