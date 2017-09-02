const mongoose = require('mongoose');

const deleteGroupSchema = mongoose.Schema({
  groupId: String,
  title: String,
  tip: String,
  email: String,
});

module.exports = mongoose.model('DeletedGroup', deleteGroupSchema);