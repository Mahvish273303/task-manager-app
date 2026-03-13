import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

export default function TaskForm({ onSubmit, initialValues, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    remarks: ''
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        dueDate: initialValues.dueDate ? initialValues.dueDate.slice(0, 10) : '',
        status: initialValues.status || 'Pending',
        remarks: initialValues.remarks || ''
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-800">
        {initialValues ? 'Edit Task' : 'Create Task'}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="e.g. Prepare project report"
            />
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Add more details about the task"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Due Date
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Remarks
            <input
              type="text"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Any additional notes"
            />
          </label>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {initialValues ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

