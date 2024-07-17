const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = "mongodb://localhost:27017/e-commerce";

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connection established');
});

db.on('error', (err) => {
  console.error('MongoDB connection error: ' + err);
});

db.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

db.on('reconnected', () => {
  console.log('MongoDB connection reconnected');
});

mongoose.set('debug', true);

module.exports = db;
