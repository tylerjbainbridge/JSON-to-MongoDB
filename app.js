/**
 * Created by tyler on 5/24/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var importJSON = require('./import-json');
var mongoose = require('mongoose');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb://localhost:27017/');

// view engine setup (pug, used to be jade)
app.set('view engine', 'pug');

//start the server
app.listen(3000, () => {
    console.log('listening on 3000')
});


//For parsing the form content.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//when it receives the root, then render the index.
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Rakuten Practice', message: 'Import JSON to MongoDB with Express'
    });
});

app.post('/importJSON', upload.single('file'),(req, res) => {

    var collectionName = req.body.collection;
    var fileName = req.file.path;

    importJSON.readFileIntoMongo(collectionName, fileName);
    res.send(200);

});

module.exports = app;