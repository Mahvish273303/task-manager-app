const TaskModel = require('../models/taskModel');

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

const validateStatus = (status) => !status || VALID_STATUSES.includes(status);

exports.createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      dueDate,
      status = 'Pending',
      remarks,
      project,
      assignedTo,
      createdBy = 'system'
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!validateStatus(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await TaskModel.create({
      title,
      description: description || '',
      dueDate: dueDate || null,
      status,
      remarks: remarks || '',
      project: project || '',
      assignedTo: assignedTo || '',
      createdBy
    });

    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    if (!validateStatus(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }

    const tasks = await TaskModel.getAll({ status });
    return res.json(tasks);
  } catch (err) {
    return next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.getById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    return next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      status,
      remarks,
      updatedBy = 'system'
    } = req.body;

    if (status && !validateStatus(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await TaskModel.update(id, {
      title,
      description,
      dueDate,
      status,
      remarks,
      updatedBy
    });

    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await TaskModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

exports.searchTasks = async (req, res, next) => {
  try {
    const { q, status } = req.query;

    if (status && !validateStatus(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }

    const tasks = await TaskModel.search({ query: q, status });
    return res.json(tasks);
  } catch (err) {
    return next(err);
  }
};

