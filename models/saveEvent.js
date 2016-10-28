const mongoose = require('mongoose');

const saveEventSchema = mongoose.Schema({
  ebId: { type: String, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('saveEvent', saveEventSchema);
