import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const FieldIcon = ({ children }) => (
  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
    {children}
  </span>
);

const baseInputClasses =
  'w-full rounded-xl border border-slate-700 bg-slate-900/70 px-9 py-2.5 text-sm text-slate-50 shadow-inner shadow-slate-950/40 outline-none transition focus:border-emerald-400 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/30 placeholder:text-slate-500';

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
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        status: 'Pending',
        remarks: ''
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
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-50">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
          Title
        </label>
        <div className="relative">
          <FieldIcon>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16M4 12h10M4 19h6" />
            </svg>
          </FieldIcon>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={baseInputClasses}
            placeholder="e.g. Plan sprint backlog"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
          Description
        </label>
        <div className="relative">
          <FieldIcon>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 10h10M4 14h7M4 18h9" />
            </svg>
          </FieldIcon>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={baseInputClasses}
            placeholder="Provide more context for this task"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Due date */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
            Due Date
          </label>
          <div className="relative">
            <FieldIcon>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </FieldIcon>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={baseInputClasses}
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
            Status
          </label>
          <div className="relative">
            <FieldIcon>
              <span
                className={`h-3 w-3 rounded-full ${
                  form.status === 'Completed'
                    ? 'bg-emerald-400'
                    : form.status === 'In Progress'
                    ? 'bg-sky-400'
                    : 'bg-amber-400'
                }`}
              />
            </FieldIcon>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${baseInputClasses} appearance-none pr-8`}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-400">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
          Remarks
        </label>
        <div className="relative">
          <FieldIcon>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 19h14M5 5h14v10H5z" />
            </svg>
          </FieldIcon>
          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className={baseInputClasses}
            placeholder="Any extra notes or links"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        {onCancel && initialValues && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm shadow-slate-950/40 transition hover:border-slate-500 hover:bg-slate-800/90"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-900/50 transition hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-900/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
        >
          <span>{initialValues ? 'Update Task' : 'Create Task'}</span>
        </button>
      </div>
    </form>
  );
}