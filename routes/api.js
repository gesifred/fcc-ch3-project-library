/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Db = require("../db.js").Database;
const Book = require("../model").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Db._connect();
      const allIssues = await Book
        .find()
      allIssues.map(book => {
        let count = book.comments.length;
        Object.assign(book, { "commentcount": count })
      })
      allIssues.forEach(book => {
        let count = book.comments.length;
        Object.assign(book, { "commentcount": count })
      });
      return res.json(allIssues);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send("missing required field title")
      } else {
        Db._connect();
        const result = await Book.createBookInDb({ title: title });
        res.json({
          title: result.title,
          _id: result._id
        })
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      Db._connect();
      const result = await Book.deleteMany();
      //console.log(result);
      res.send("complete delete successful")
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = String(req.params.id);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let project = req.params.project;
      Db._connect();
      const bookQuery = { _id: bookid };
      const result = await Book
        .findOne(bookQuery)
        .select('-created_on');
      if(!result){
        res.send("no book exists");
      } else {
        return res.json(result);
      }
      
    })

    .post(async function (req, res) {
      let bookid = String(req.params.id);
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        res.send("missing required field comment");
      } else {
        Db._connect();
        const result = await Book.findOneAndUpdate(
          { _id: bookid },
          {
            $inc: { commentcount: 1 ,__v:1},
            $push: { comments: comment }
          },
          { new: true }
        );
        if (!result){
          res.send("no book exists");
        }else{
          res.json(result);
        }
      }
    })

    .delete(async function (req, res) {
      let bookid = String(req.params.id);
      //if successful response will be 'delete successful'
      Db._connect();
      const result = await Book.findOneAndRemove({ _id: bookid });
      if (!result) {
        res.send("no book exists");
      } else {
        res.send("delete successful");
      }
    });

};
