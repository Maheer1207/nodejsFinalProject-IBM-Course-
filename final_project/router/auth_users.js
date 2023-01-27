const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username )
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  } 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.query.username;
  let review = req.query.review;
  let isbn = req.params.isbn;
  let validusers = users.filter((user)=>{
    return (user.username === username)
  });

  if(validusers.length > 0){ 
    var reviews = books[isbn].reviews;
    if (reviews[username]) {
        reviews[username] = review
        return res.status(200).json({message:`${username}'s review is modified`});
    }
    else {
        reviews.push({username:review})
        return res.status(200).json({message:`${username}'s review is added`});
    }
  } else {
    return res.status(404).json({message: "The use is not registered to review"});
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.query.username;
  let review = req.query.review;
  let isbn = req.params.isbn;
  let validusers = users.filter((user)=>{
    return (user.username === username)
  });

  if(validusers.length > 0){ 
    var reviews = books[isbn].reviews;
    delete reviews[username];
    return res.status(200).json({message:`${username}'s review is deleted`});
  } else {
    return res.status(404).json({message: "The use is not registered to change a review"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
