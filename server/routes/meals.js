const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { getMeals, addMeal, updateMeal, deleteMeal, getMealAnalytics } = require('../controllers/mealController');
const auth = require('../middleware/auth');

// Validation middleware
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

router.get('/', auth, getMeals);
router.post('/', auth,
  validate([
    body('date').notEmpty().withMessage('Date is required'),
    body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
    body('foodItems').isArray({ min: 1 }).withMessage('At least one food item is required'),
    body('foodItems.*.name').notEmpty().withMessage('Food item name is required'),
    body('foodItems.*.calories').isNumeric().withMessage('Calories must be a number'),
    body('foodItems.*.protein').isNumeric().withMessage('Protein must be a number'),
    body('foodItems.*.carbs').isNumeric().withMessage('Carbs must be a number'),
    body('foodItems.*.fat').isNumeric().withMessage('Fat must be a number'),
  ]),
  addMeal
);
router.put('/:id', auth,
  validate([
    body('date').notEmpty().withMessage('Date is required'),
    body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
    body('foodItems').isArray({ min: 1 }).withMessage('At least one food item is required'),
    body('foodItems.*.name').notEmpty().withMessage('Food item name is required'),
    body('foodItems.*.calories').isNumeric().withMessage('Calories must be a number'),
    body('foodItems.*.protein').isNumeric().withMessage('Protein must be a number'),
    body('foodItems.*.carbs').isNumeric().withMessage('Carbs must be a number'),
    body('foodItems.*.fat').isNumeric().withMessage('Fat must be a number'),
  ]),
  updateMeal
);
router.delete('/:id', auth, deleteMeal);
router.get('/analytics', auth, getMealAnalytics);

module.exports = router; 