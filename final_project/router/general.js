const express = require('express');
const {isValid, users} = require("./auth_users.js");

const router = express.Router();

const doesExist = (username) => users.some(user => user.username === username);

router.post("/register", (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) return res.status(404).json({message: "Unable to register user."});
  if (doesExist(username)) return res.status(404).json({message: "User already exists!"});
  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

const fetchBooksData = () => {
  return new Promise((resolve) => setTimeout(() => resolve(require("./booksdb.js")), 1000));
};

router.get('/', async (req, res) => {
  try {
    const {ISBN, Author, Title} = req.query;
    const books = await fetchBooksData();
    const filteredBooks = ISBN ? (books[ISBN] ? [books[ISBN]] : []) :
      Object.values(books).filter(book =>
        (!Author || book.author.toLowerCase() === Author.toLowerCase()) && (!Title || book.title.toLowerCase() === Title.toLowerCase())
      );
    return filteredBooks.length
      ? res.send(filteredBooks)
      : res.status(404).json({message: "No books found"});
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
});

module.exports = {router};