
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [String] },
    commentcount: {type: Number,default:0},
    created_on: { type: Date, default: Date.now },
});
const Book = mongoose.model('Book', bookSchema);

Book.createBookInDb = async (params) => {
    const newBook = new Book({
        title: params.title,
        created_on: Date.now(),
    });
    return newBook.save()
        .then(doc => {
            //console.log(doc)
            return doc
        })
        .catch(err => {
            console.error(err)
        })
}

exports.Book = Book;
