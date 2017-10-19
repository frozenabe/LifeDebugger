const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongoUri = 'mongodb://127.0.0.1:27017/lifedebugger';
const db = mongoose.connection;

db.on('error', () => console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to DB"));

mongoose.connect(mongoUri, {useMongoClient: true});

module.exports = db;
