const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");

const router = express.Router();
let users = [{"username":"dennis","password":"abc"}];

const isValid = (username) => users.some(user => user.username === username);

const authenticatedUser = (username, password) => users.some(user => user.username === username && user.password === password);

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(404).json({message: "Error logging in"});
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

router.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;
  if (!books[isbn]) return res.status(404).json({message: `ISBN ${isbn} not found`});
  books[isbn].reviews[username] = review;
  return res.status(200).send("Review successfully posted");
});

router.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (!books[isbn]) return res.status(404).json({message: `ISBN ${isbn} not found`});
  delete books[isbn].reviews[username];
  return res.status(200).send("Review successfully deleted");
});

module.exports = { router, isValid, users };