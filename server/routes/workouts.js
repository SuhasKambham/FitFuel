const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { getWorkouts, addWorkout, updateWorkout, deleteWorkout, getWorkoutAnalytics } = require('../controllers/workoutController');
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

router.get('/', auth, getWorkouts);
router.post('/', auth,
  validate([
    body('date').notEmpty().withMessage('Date is required'),
    body('type').isIn(['cardio', 'strength', 'yoga']).withMessage('Invalid workout type'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('caloriesBurned').isNumeric().withMessage('Calories burned must be a number'),
  ]),
  addWorkout
);
router.put('/:id', auth,
  validate([
    body('date').notEmpty().withMessage('Date is required'),
    body('type').isIn(['cardio', 'strength', 'yoga']).withMessage('Invalid workout type'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('caloriesBurned').isNumeric().withMessage('Calories burned must be a number'),
  ]),
  updateWorkout
);
router.delete('/:id', auth, deleteWorkout);
router.get('/analytics', auth, getWorkoutAnalytics);

module.exports = router; 