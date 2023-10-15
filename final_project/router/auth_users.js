const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "A",
    password: "Pass1234"
  },
  {
    username: "B",
    password: "Pass12345"
  }
];
const JWT_SECRET = "Thesecret";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  for (var i = 0; i < users.length; i++) {
    if (username === users[i].username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for (var i = 0; i < users.length; i++) {
    if (username === users[i].username && password === users[i].password) {
      return true
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  if (authenticatedUser(req.body.username, req.body.password)) {
    req.session.username = req.body.username;
    return res.json({
      token: jwt.sign({ user: "user"}, JWT_SECRET)
    })
  }
  return res.status(401).json({message: "Invalid username &/ password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbnParam = req.params.isbn;
  books[isbnParam].reviews[req.session.username] = req.body.review;
  return res.status(300).json({message: "Review added"});
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbnParam = req.params.isbn;
  if (req.session.username in books[isbnParam].reviews) {
    delete books[isbnParam].reviews[req.session.username];
  }
  return res.status(300).json({message: "Review removed"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
