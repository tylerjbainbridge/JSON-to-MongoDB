/**
 * Created by tyler on 5/24/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var routes = require('./routes/index');

var mongoose = require('mongoose');
var multer  = require('multer');

var upload = multer({
    dest: 'uploads/',
    inMemory: true
});

var fs = require('fs');

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
app.get('/', routes.getIndex);

app.post('/importJSON', upload.single('file'), routes.importJSON);

module.exports = app;