const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const { getPagination, buildPaginationMeta } = require('../utils/paginate');

/**
 * @desc    Get tasks, with optional search + status filter, paginated.
 *          (mirrors the dashboard's live search + filter dropdown)
 *          Stats always reflect the FULL task set, not just the current
 *          filtered/paginated page, since the stat bar should never change
 *          just because you searched or turned the page.
 * @route   GET /api/tasks?search=&status=all|pending|completed&page=1&limit=10
 * @access  Public
 */
const getTasks = asyncHandler(async (req, res) => {
  const { search = '', status = 'all' } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const query = {};
  if (search.trim()) {
    query.name = { $regex: search.trim(), $options: 'i' };
  }
  if (status === 'completed') query.completed = true;
  if (status === 'pending') query.completed = false;

  const [tasks, totalItems, total, completed] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(query),
    Task.countDocuments(),
    Task.countDocuments({ completed: true }),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    stats: {
      total,
      pending: total - completed,
      completed,
    },
    data: tasks,
    pagination: buildPaginationMeta(page, limit, totalItems),
  });
});

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    res.status(400);
    throw new Error('Task cannot be empty!');
  }

  const task = await Task.create({ name: name.trim(), completed: false });
  res.status(201).json({ success: true, data: task });
});

/**
 * @desc    Update a task's name and/or completed state
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.body.name !== undefined) {
    if (!req.body.name.trim()) {
      res.status(400);
      throw new Error('Task cannot be empty!');
    }
    task.name = req.body.name.trim();
  }

  if (req.body.completed !== undefined) {
    task.completed = Boolean(req.body.completed);
  }

  const updated = await task.save();
  res.status(200).json({ success: true, data: updated });
});

/**
 * @desc    Toggle a task's completed state
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Public
 */
const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.completed = !task.completed;
  const updated = await task.save();
  res.status(200).json({ success: true, data: updated });
});

/**
 * @desc    Delete a single task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.deleteOne();
  res.status(200).json({ success: true, data: { id: req.params.id } });
});

/**
 * @desc    Delete all completed tasks (the "Clear completed" button)
 * @route   DELETE /api/tasks/completed/all
 * @access  Public
 */
const clearCompletedTasks = asyncHandler(async (req, res) => {
  const result = await Task.deleteMany({ completed: true });
  res.status(200).json({ success: true, deletedCount: result.deletedCount });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompletedTasks,
};
