const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));

});

// Get the book list available using Promises (Task 10)
public_users.get('/books',function (req, res) { 
    let get_books = new Promise((resolve, reject) => { 
       resolve(res.send(JSON.stringify({books}, null, 4)));     
     });
    get_books.then(() => 
       console.log("Task 10 Promise resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        res.status(404).json({message: 'No book found with that isbn'});
    }
    else {
        res.status(200).json(book);
    }
 });

// Get book details based on ISBN using Promises (Task 11)
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
 
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            reject(res.send('ISBN not found'));
        }
        else {
            resolve(res.send(books[isbn]));
        }
    });

    get_books_isbn.then(function(){
            console.log("Promise for Task 11 is resolved");
        })
        .catch(function () { 
            console.log('ISBN not found');
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });

    if (booksbyauthor.length === 0) {
        res.status(404).json({message: 'No book found with that Author'});
    }
    else {        
        res.send(JSON.stringify({booksbyauthor}, null, 4));
    }

});

// Get book details based on author using Promises (Task 12)
public_users.get('/books/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        
        isbns.forEach((isbn) => {
        if (books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
        }
        });

        if (booksbyauthor.length === 0) {
            reject(res.send('Author not found'));
        }

        resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
    });

    get_books_author.then(function(){
            console.log("Promise for Task 12 is resolved");

    }).catch(function () { 
            console.log('The Author does not exist');
  });

  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
        }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
});

// Get book details based on title using Promises (Task 13)
public_users.get('/books/title/:title',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        
        isbns.forEach((isbn) => {
            if (books[isbn]["title"] === req.params.title) {
                booksbytitle.push({ "isbn":isbn,
                                    "title":books[isbn]["title"],
                                    "author":books[isbn]["author"],
                                    "reviews":books[isbn]["reviews"]});
                }
        });

        if (booksbytitle.length === 0) {
            reject(res.send('Title not found'));
        }

        resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
    });

    get_books_author.then(function(){
            console.log("Promise for Task 13 is resolved");

    }).catch(function () { 
            console.log('The Title does not exist');
  });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn];

    if (!reviews) {
        res.status(404).json({message: 'No reviews found'});
    }
    else {
        res.status(200).json(reviews);
    }
});

module.exports.general = public_users;
