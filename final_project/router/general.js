const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  if (req.body.username === "" || req.body.password === "") {
    return res.status(400).json({message: "username &/ password are not provided"});
  }
  else if (!isValid(req.body.username)) {
    return res.status(400).json({message: "username already exists"});
  }
  else {
    users.push(
      {
        username: req.body.username,
        password: req.body.password
      }
    )
    return res.status(300).json({message: "user is registered successfully"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books))
  })
  bookPromise.then(
    ret => {
      return res.status(300).json({message: ret});
    }
  )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let bookPromise = new Promise((resolve, reject) => {
    const isbnParam = req.params.isbn;
    resolve(books[isbnParam])
  })
  bookPromise.then(
    ret => {
      return res.status(300).json({message: ret});
    }
  )
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let bookPromise = new Promise((resolve, reject) => {
    const authorParam = req.params.author;
    const author = authorParam.replaceAll("-", " ");
    var bookContent = [];
    for (var i = 1; i < Object.keys(books).length; i++) {
      if (books[i].author === author) {
        bookContent.push(books[i])
      }
    }
    resolve(bookContent)
  })
  bookPromise.then(
    ret => {
      return res.status(300).json({message: ret});
    }
  )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let bookPromise = new Promise((resolve, reject) => {
    const titleParam = req.params.title;
    const title = titleParam.replaceAll("-", " ");
    for (var i = 1; i < Object.keys(books).length; i++) {
      if (books[i].title === title) {
        resolve(books[i])
      }
    }
  })
  bookPromise.then(
    ret => {
      return res.status(300).json({message: ret});
    }
  )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbnParam = req.params.isbn;
  return res.status(300).json({message: books[isbnParam].reviews});
});

module.exports.general = public_users;
