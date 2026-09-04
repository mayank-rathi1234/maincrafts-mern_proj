const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
      minlength: [1, 'Task cannot be empty'],
      maxlength: [300, 'Task must be under 300 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt used for default sort order
  }
);

module.exports = mongoose.model('Task', taskSchema);
