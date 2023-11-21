const express = require('express');
const app = express();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kjarosz02',  //change to your DB name
    port: '3306',
    multipleStatements: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/books', (req, res) => {
    const booksql = `SELECT * FROM b_books`;
    db.query(booksql, (err, rows) => {
        if (err) throw err;
        res.render('booklist', { books: rows });
    });
});

app.get('/edit', (req, res) => {

    const booksql = `SELECT * FROM b_books`;

    db.query(booksql, (err, rows) => {
        if (err) throw err;
        res.render('editlist', { books: rows });
    });

});

app.get('/editbook', (req, res) => {

    const book_id = req.query.eid;
    const onebooksql = `SELECT * FROM b_books WHERE id = ${book_id}`;

    db.query(onebooksql, (err, row) => {
        if (err) throw err;
        res.render('bookupdate', { book: row });
    });
});

app.post('/editbook', (req, res) => {

    const id_update = req.body.id_field;
    const title_update = req.body.title_field;

    const updateSQL = `UPDATE b_books SET title='${title_update}'
                      WHERE id = '${id_update}';  `;

    db.query(updateSQL, (err, result) => {
        if (err) throw err;
        res.send(`Data from form element. The row id ... ${id_update} title
                  will update to ... ${title_update} <a href='/edit'>edit books</a> `);
    });

});

app.get('/editp', (req, res) => {

    const limit = 10; // number of records per page
    let offset = 0; // default value for first visit
    const page = req.query.page; // get query parameter 'page' value
    offset = (page - 1) * limit; // returns the next incremented by using the query parameter page + 10 
    if (Number.isNaN(offset)) offset = 0;  // if no query parameter 'page' then change offset back to = 0

    const booksql = `SELECT id FROM b_books;
    SELECT * FROM b_books LIMIT ${limit} OFFSET ${offset};`;

    db.query(booksql, (err, rows) => {
        if (err) throw err;
        const totalRows = rows[0].length;
        const pageCount = Math.ceil(totalRows / limit);
        res.render('editlist', { books: rows[1], num_pages: pageCount });
    });

});

app.listen(3000, () => {
    console.log("server started on: http://localhost:3000/");
});
