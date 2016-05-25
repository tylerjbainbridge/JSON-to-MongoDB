var exports = module.exports = {};
var Job = require('../models/job');
var fs = require('fs');
var importJSON = require('../import-json');


exports.importJSON = (req, res) => {
    var collectionName = req.body.collection;
    var fileName = req.file.path;

    importJSON.readFileIntoMongo(collectionName, fileName);

    fs.unlink(fileName, function(err){
       if(!err){
           res.sendStatus(200);
       }else{
           res.sendStatus(400);
       } 
    });
};

exports.getIndex = (req, res) => {
    res.render('index', {
        title: 'Rakuten Practice', message: 'Import JSON to MongoDB with Express'
    });
};