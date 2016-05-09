# JSON-to-MongoDB
Takes a .txt file of NDJ (New-line Delimited JSON) which it then parses and inserts into a Mongo database using NodeJs streams.

To Use:
Git clone

cd JSON-toMongoDB

Start mongo

node import-json.js  --file  <file here> -- <mongo collection>

SAMPLE OUTPUT:

lines read: 864033

lines imported: 863998

lines with errors: 35 (intentionally added for testing)

time: 13691ms
