// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Models
const { Book } = require('../models');

// Controllers
const index = async (req, res) => {
    console.log("Inside of /api/books");
    try {
        const allBooks = await Book.find({});

        res.json({ books: allBooks });
    } catch (error) {
        console.log("Error inside of /api/books")
        console.log(error);
        return res.status(400).json({message:'Books not found, please try again.'});
    }
}

const show = async (req, res) => {
    const { id } = req.params;

    //find book by id
    try {
        const book = await Book.findById(id);
        res.json({ book });
    } catch (error) {
        console.log("Error inside of /api/books/:api")
        console.log(error);
        return res.status(400).json({ message: 'Book not found, try again.' });
    }
}

const create = async (req, res) => {
    const { title, author, price, pages, genre, isbn } = req.body;

    try {
        const newBook = await Book.create({ title, author, price, pages, genre, isbn })
        // or
        // const newBook = await Book.create({ req.body })
        console.log("new book created", newBook);
        res.json({ book: newBook });
    } catch (error) {
        console.log("Error inside of post route /api/books");
        console.log(error)
        res.status(400).json({ meesage: 'Error creating book, please try again.' });
    }
}

const update = async (req, res) => {
    console.log(req.body);
    const { title, author, price, pages, genre, isbn } = req.body;
    try {
        const book = await Book.findOne({title});
        // console.log(book);
        // // update data
        // if (author) book.author = author;
        // if (price) book.price = price;
        // if (pages) book.pages = pages;
        // if (genre) book.genre = genre;
        // if (isbn) book.isbn = isbn;
        // // save book
        // const updatedBook = book.save();

        const updatedBook = await Book.updateOne({ title: req.body.title }, req.body);

        res.redirect(`/api/books/${book.id}`);
    } catch (error) {
        console.log("Error inside of update route");
        console.log(error);
        return res.status(400).json({ message: 'Book could not be updated, please try again.' });
    }
}

const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Book.findByIdAndRemove(id);
        console.log(result);
        res.redirect('/api/books');
    } catch (error) {
        console.log("Error inside of delete route.");
        console.log(error);
        return res.status(400).json({ message: 'Book was not deleted, please try again.' })
    }
}

// GET api/books/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: 'Books endpoint OK!'});
});

router.get('/', passport.authenticate('jwt', { session: false }), index);
router.get('/:id', passport.authenticate('jwt', { session: false }), show);
router.post('/', passport.authenticate('jwt', { session: false }), create);
router.put('/', passport.authenticate('jwt', { session: false }), update);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBook);

module.exports = router;