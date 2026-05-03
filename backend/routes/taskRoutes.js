const express = require('express');
const taskController = require('../controllers/taskController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require a valid JWT
router.get('/tasks/search', authMiddleware, taskController.searchTasks);
router.get('/tasks', authMiddleware, taskController.getTasks);
router.get('/tasks/:id', authMiddleware, taskController.getTaskById);

// Mutations — create and delete are Admin-only
router.post('/tasks', authMiddleware, adminOnly, taskController.createTask);
router.put('/tasks/:id', authMiddleware, taskController.updateTask);   // Members may update status
router.delete('/tasks/:id', authMiddleware, adminOnly, taskController.deleteTask);

module.exports = router;
