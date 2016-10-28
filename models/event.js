const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  ebId: { type: String, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
