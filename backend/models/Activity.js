const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: Number,
  timestamp: { type: Date, default: Date.now },
  points: { type: Number, default: 20 }
});

module.exports = mongoose.model('Activity', activitySchema);
