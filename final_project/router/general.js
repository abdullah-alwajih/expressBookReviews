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

router.get('/isbn/:isbn', async (req, res) => {
  try {
    const {isbn} = req.params;
    const books = await fetchBooksData();
    const book = books[isbn];
    if (!book) return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    return res.status(200).json(book);
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
});

router.get('/author/:author', async (req, res) => {
  const {author} = req.params;
  const books = await fetchBooksData();
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  return booksByAuthor.length ? res.send({booksbyauthor: booksByAuthor}) : res.status(404).json({message: "Author not found"});
});

router.get('/review/:isbn', async (req, res) => {
  try {
    const {isbn} = req.params;
    const books = await fetchBooksData();
    const book = books[isbn];
    if (!book) return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    return res.status(200).json(book.reviews);
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
});

router.get('/title/:title', async (req, res) => {
  const {title} = req.params;
  const books = await fetchBooksData();
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  return booksByTitle.length ? res.send({booksbytitle: booksByTitle}) : res.status(404).json({message: "Title not found"});
});

router.get('/', async (req, res) => {
  try {
    res.send(await fetchBooksData());
  } catch (e) {
    return res.status(500).json({message: "Error"});
  }
});

module.exports = {router};