const mongoose = require('mongoose');

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: 'Pending'
    },
    remarks: {
      type: String,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    }
  },
  {
    timestamps: true
  }
);

taskSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Task = mongoose.model('Task', taskSchema);

class TaskModel {
  static async getAll({ status } = {}) {
    const query = {};
    if (status) {
      query.status = status;
    }
    return Task.find(query).sort({ createdAt: -1 });
  }

  static async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findById(id);
  }

  static async create(task) {
    const payload = {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || null,
      status: task.status || 'Pending',
      remarks: task.remarks || '',
      createdBy: task.createdBy,
      updatedBy: task.createdBy
    };

    const doc = await Task.create(payload);
    return doc;
  }

  static async update(id, updates) {
    if (!mongoose.isValidObjectId(id)) return null;

    const payload = { ...updates };
    if (updates.updatedBy) {
      payload.updatedBy = updates.updatedBy;
    }

    const doc = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
    return doc;
  }

  static async delete(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const result = await Task.findByIdAndDelete(id);
    return !!result;
  }

  static async search({ query, status }) {
    const mongoQuery = {};

    if (query) {
      mongoQuery.title = { $regex: query, $options: 'i' };
    }

    if (status) {
      mongoQuery.status = status;
    }

    return Task.find(mongoQuery).sort({ createdAt: -1 });
  }
}

module.exports = TaskModel;

