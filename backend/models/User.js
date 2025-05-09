const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: Number,
  name: String,
  totalPoints: { type: Number, default: 0 },
  rank: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
