const Meal = require('../models/Meal');
const mongoose = require('mongoose');

// Get all meals for the authenticated user
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add a new meal
exports.addMeal = async (req, res) => {
  try {
    const { date, mealType, foodItems } = req.body;
    if (!date || !mealType || !foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const meal = await Meal.create({
      userId: req.user.userId,
      date,
      mealType,
      foodItems,
    });
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update a meal
exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mealType, foodItems } = req.body;
    const meal = await Meal.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { date, mealType, foodItems },
      { new: true }
    );
    if (!meal) return res.status(404).json({ message: 'Meal not found.' });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a meal
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!meal) return res.status(404).json({ message: 'Meal not found.' });
    res.json({ message: 'Meal deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Analytics for meals
exports.getMealAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const meals = await Meal.find({ userId });
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    const dailyCalories = {};
    meals.forEach(meal => {
      meal.foodItems.forEach(item => {
        totalCalories += item.calories;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFat += item.fat;
        const dateKey = new Date(meal.date).toISOString().slice(0, 10);
        dailyCalories[dateKey] = (dailyCalories[dateKey] || 0) + item.calories;
      });
    });
    const days = Object.keys(dailyCalories).length || 1;
    const avgDailyCalories = totalCalories / days;
    const dailyCaloriesArr = Object.entries(dailyCalories).map(([date, calories]) => ({ date, calories }));

    // Pie chart for calories by meal type
    const mealTypeCalories = {};
    meals.forEach(meal => {
      const t = meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);
      meal.foodItems.forEach(item => {
        mealTypeCalories[t] = (mealTypeCalories[t] || 0) + item.calories;
      });
    });
    const caloriesByMealType = Object.entries(mealTypeCalories).map(([mealType, calories]) => ({ mealType, calories }));

    res.json({
      totalCalories, totalProtein, totalCarbs, totalFat, avgDailyCalories, dailyCalories: dailyCaloriesArr, caloriesByMealType });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 