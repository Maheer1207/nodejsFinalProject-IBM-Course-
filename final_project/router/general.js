const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    var isExist = users.filter((user) => user.username === username);
    if (!(isExist.length > 0)) {
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "Registration successful!! You are good to Login!!"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  var isbn = req.params.isbn;
  return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  var itr = Object.keys(books);
  var auth = req.params.author;

  for (var key of itr) {
    if(books[key].author === auth) {
      return res.send(books[key]);
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  var itr = Object.keys(books);
  var title = req.params.title;

  for (var key of itr) {
    if(books[key].title === title) {
      return res.send(books[key]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  var isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
