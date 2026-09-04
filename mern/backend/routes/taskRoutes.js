const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompletedTasks,
} = require('../controllers/taskController');

router.route('/').get(getTasks).post(createTask);

// Must be declared before '/:id' so 'completed' isn't parsed as an :id
router.route('/completed/all').delete(clearCompletedTasks);

router.route('/:id').put(updateTask).delete(deleteTask);
router.route('/:id/toggle').patch(toggleTask);

module.exports = router;
