/**
 * Author: Tyler Bainbridge
 *
 * Project: Rakuten Exercise.
 "Assume there is a text file with millions of lines where each line is a JSON string.
 Write a nodeJS application that will import these lines as mongoDB documents.
 The application runs from command line and take a text file as input and mongo collection name
 Name the application as import-json.js"
 *
 *
 * Date: 4/24/16
 Working prototype completed in day using fs.readFile which asynchronously loads the file into memory. I then parsed this text by line and processed the
 resulting array of lines. Insertion to the MongoDB was completed through a bulk insert of a object array.
 *
 * Revisited: 4/8/16
 Pivoted from loading file into memory using fs.readFile to using a stream to avoid the overhead of holding a large file in memory.
 Using a stream allows the program to only be accessing "chunks" that can the be parsed and put in an array rather than loading an entire fire, parsing by line,
 then parsing the JSON. The streams allow this portion of the process to be completed in one step rather than two ( split('/n') + iterating through the array ).
 This pivot allowed me to shave ~three seconds off the time I had from the first attempt. I also managed to shave a second off by using the line number as the
 Mongo document _id to save time (time spent generating unique ids for each document).
 *
 */

var fs = require('fs'),
    path = require('path'),
    mongodb = require("mongodb"),
    parsedArgs = require('minimist')(process.argv.slice(2)),
    split = require('split');


/**
 * MAIN FUNCTION
 * 1. Begin the timer.
 * 2. Declared an object to hold information necessary for the final output as well as an array for holding the objects parsed from the file.
 * 3. File stream started, the stream is then piped and split by each new line.
 * 4. The chunk is then parsed and put in an object array.
 * 5.
 */
(function readFileIntoMongo() {
    console.time("time");

    var objects = [];
    var file = parsedArgs.file;
    var exitInformation = {
        totalLines: 0,
        linesImported: 0,
        linesWithErrors: 0
    };

    fs.createReadStream(file)

        .pipe(split())                          //first the stream splits on '/n' and provides the data to the transformer function.

        .on('data', function (line) {           //the transformer function receives the data from the piping and tries to parse it.
            var lineObj = parseJSON(line);

            //if the parse was successful add to the array, else increment error lines
            lineObj ? addToObjectArray(lineObj, exitInformation, objects) : exitInformation.linesWithErrors++;


            exitInformation.totalLines++

        })
        .on('close', function () {              //when the files is closed, insert the array of javascript objects in a bulk insert.
            insertDocs(objects, exitInformation, endTime);
        });
})();

/**
 * This function takes an array of objects to bulk insert into the DB.
 * @param objectArray is the array of objects to be inserted.
 * @param exitInformation is the object containing information necessary for the callback.
 * @param callback call back is "endTime" which calls "printResults" as well as the total elapsed time.
 */
function insertDocs(objectArray, exitInformation, callback) {

    var mongoClient = mongodb.MongoClient;                           // MongoDB client.
    var collectionName = parsedArgs._[0];                            // Collection from command line arguements.
    var mongoURL = "mongodb://localhost:27017/" + collectionName;    // Mongo URL created using the collection supplied by the user.

    mongoClient.connect(mongoURL, function (err, db) {
        if (!err) {
            db.collection(collectionName).insert(objectArray, function (err, insertedDocs) {
                if (err) {
                    throw err;
                } else if (insertedDocs) {
                    db.close();
                    callback(exitInformation);
                }
            });
        }
    });
}

/**
 * This function will attempt to parseJSON and return false if unsuccessful.
 *
 * @param json string to (attempt) to parse
 * @returns {*} returns false if the parse failed, or the JSON object if successful.
 */
function parseJSON(json) {
    var parsedJSON = {};

    try {
        parsedJSON = JSON.parse(json);
    } catch (e) {
        return false;
    }

    //return the new object
    return parsedJSON;
}

/**
 * This function increments the lines Imported because the only way this function is called is if the
 * parseJSON function was successful. It will also add the object, "obj", to the array, "objects".
 * @param obj this is the object to be added to the array.
 *
 * @param exitInformation is for tallying totals.
 * @param objects is array to be added to.
 */
function addToObjectArray(obj, exitInformation, objects) {
    exitInformation.linesImported++;
    obj._id = exitInformation.totalLines;
    objects.push(obj);
}

/**
 * This function will print relevant data in a neat way upon completion.
 *
 * @param exitInformation contains information such as totalLines, linesImported, and linesWithErrors to be displayed upon completion
 */
function printResults(exitInformation) {
    console.log("lines read: " + exitInformation.totalLines);
    console.log("lines imported: " + exitInformation.linesImported);
    console.log("lines with errors: " + exitInformation.linesWithErrors);
}


/**
 * Is called upon the absolute completion of the program. It will call "printResults" as well as the total time elapsed.
 * @param exitInformation is for pass by reference value manipulation.
 */
function endTime(exitInformation) {
    printResults(exitInformation);
    console.timeEnd("time");
}


/*
 SAMPLE OUTPUT:
 lines read: 864033
 lines imported: 863998
 lines with errors: 35
 time: 13691ms
 */

//If you'd like to run manually rather than through self invoking
//readFileIntoMongo();



