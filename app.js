/**
 * Created by tyler on 5/24/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var importJSON = require('./import-json');

// view engine setup (pug, used to be jade)
app.set('view engine', 'pug');

//start the server
app.listen(3000, () => {
    console.log('listening on 3000')
});

//when it receives the root, then render the index.

app.get('/', (req, res) => {
    res.render('index', { title: 'Rakuten Practice', message: 'Import JSON to MongoDB with Express'});
});

app.post('/importJSON', (req, res) => {
    /**
     * Temporarily upload the file and read from it using functions in import-json.
     * Use schemas from mongoose
     */
});

module.exports = app;