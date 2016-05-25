var mongoose = require('mongoose');

var Job = mongoose.Schema({
    collectionName: String,
    totalLines: Number,
    linesImported: Number,
    linesWithErrors: Number
});

module.exports = mongoose.model('Job', Job);