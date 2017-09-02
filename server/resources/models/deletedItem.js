const mongoose = require('mongoose');

const deleteItemSchema = mongoose.Schema({
  itemId: String,
  group: String,
  title: String,
  start: Number,
  end: Number,
  tip: String,
  email: String,
});

module.exports = mongoose.model('DeletedItem', deleteItemSchema);