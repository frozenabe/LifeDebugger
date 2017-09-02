const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  groupId: String,
  title: String,
  tip: String,
  email: String,
});

module.exports = mongoose.model('Group', groupSchema);