const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['cardio', 'strength', 'yoga'], required: true },
  duration: { type: Number, required: true }, // in minutes
  caloriesBurned: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema); 