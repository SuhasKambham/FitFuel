const Workout = require('../models/Workout');
const mongoose = require('mongoose');
const calculateStreak = require('../utils/streak');

// Get all workouts for the authenticated user
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add a new workout
exports.addWorkout = async (req, res) => {
  try {
    const { date, type, duration, caloriesBurned } = req.body;
    if (!date || !type || !duration || !caloriesBurned) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const workout = await Workout.create({
      userId: req.user.userId,
      date,
      type,
      duration,
      caloriesBurned,
    });
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update a workout
exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, type, duration, caloriesBurned } = req.body;
    const workout = await Workout.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { date, type, duration, caloriesBurned },
      { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const workout = await Workout.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    res.json({ message: 'Workout deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Analytics for workouts
exports.getWorkoutAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const workouts = await Workout.find({ userId });
    let totalWorkouts = workouts.length;
    let totalDuration = 0;
    let totalCaloriesBurned = 0;
    const dailyCaloriesBurned = {};
    const workoutDates = [];
    workouts.forEach(w => {
      totalDuration += w.duration;
      totalCaloriesBurned += w.caloriesBurned;
      const dateKey = new Date(w.date).toISOString().slice(0, 10);
      dailyCaloriesBurned[dateKey] = (dailyCaloriesBurned[dateKey] || 0) + w.caloriesBurned;
      workoutDates.push(w.date);
    });
    const currentStreak = calculateStreak(workoutDates);
    const dailyCaloriesArr = Object.entries(dailyCaloriesBurned).map(([date, calories]) => ({ date, calories }));
    // Pie chart for workout types
    const typeCounts = {};
    workouts.forEach(w => {
      const t = w.type.charAt(0).toUpperCase() + w.type.slice(1);
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const typeDistribution = Object.entries(typeCounts).map(([type, value]) => ({ type, value }));
    res.json({
      totalWorkouts,
      totalDuration,
      totalCaloriesBurned,
      currentStreak,
      dailyCaloriesBurned: dailyCaloriesArr,
      typeDistribution
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 