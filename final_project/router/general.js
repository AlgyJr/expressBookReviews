const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", function (req, res) {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(201).json({message: "User successfully resgitered. Now you can login"});
    } else {
      return res.status(400).json({message: "Username already exist"});
    }
  } else {
    return res.status(400).json({message: "Password is missing"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const book = books[req.params.isbn];

  if (book) {
    return res.json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  let authorBooks = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.author === author) {
      authorBooks.push(book);
    }
  }

  if (authorBooks.length > 0) {
    return res.json(authorBooks);
  } else {
    return res.status(404).json({message: "Author's Books not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  let titleBooks = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.title === title) {
      titleBooks.push(book);
    }
  }

  if (titleBooks.length > 0) {
    return res.json(titleBooks);
  } else {
    return res.status(404).json({message: "Author's Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];

  if (book) {
    return res.json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
