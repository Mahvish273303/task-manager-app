import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const inputBase =
  'w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-base text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200 ease-in-out focus:border-primary-400/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20';

const inputCls = `${inputBase} h-10 px-4`;
const textareaCls = `${inputBase} px-4 py-2.5 resize-none`;

const labelCls =
  'mb-1 block text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400';

function FieldIcon({ children }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400 dark:text-slate-500">
      {children}
    </span>
  );
}

export default function TaskForm({ onSubmit, initialValues, onCancel, projects = [], isAdmin }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    remarks: '',
    project: '',
    assignedTo: ''
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        dueDate: initialValues.dueDate ? initialValues.dueDate.slice(0, 10) : '',
        status: initialValues.status || 'Pending',
        remarks: initialValues.remarks || '',
        project: initialValues.project || '',
        assignedTo: initialValues.assignedTo || ''
      });
    } else {
      setForm({ title: '', description: '', dueDate: '', status: 'Pending', remarks: '', project: '', assignedTo: '' });
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

  const statusDot = {
    Completed: 'bg-lime-400',
    'In Progress': 'bg-blue-400',
    Pending: 'bg-yellow-400'
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3 transition-all duration-200 ease-in-out"
    >
      {/* Row 1 — Title (2) + Status (1) */}
      <div className="md:col-span-2">
        <label className={labelCls}>Title *</label>
        <div className="relative">
          <FieldIcon>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16M4 12h10M4 19h6" />
            </svg>
          </FieldIcon>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. Plan sprint backlog"
            className={`${inputCls} pl-10`}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Status</label>
        <div className="relative">
          <FieldIcon>
            <span className={`h-2.5 w-2.5 rounded-full ${statusDot[form.status] || 'bg-gray-400'}`} />
          </FieldIcon>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`${inputCls} pl-8 pr-8 appearance-none`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-slate-500 text-xs">▾</span>
        </div>
      </div>

      {/* Row 2 — Due Date + Project + Assign To */}
      <div>
        <label className={labelCls}>Due Date</label>
        <div className="relative">
          <FieldIcon>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </FieldIcon>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className={`${inputCls} pl-10`}
          />
        </div>
      </div>

      {isAdmin && (
        <div>
          <label className={labelCls}>Project</label>
          <div className="relative">
            <FieldIcon>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </FieldIcon>
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              className={`${inputCls} pl-10 pr-8 appearance-none`}
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-slate-500 text-xs">▾</span>
          </div>
        </div>
      )}

      {isAdmin && (
        <div>
          <label className={labelCls}>Assign To</label>
          <div className="relative">
            <FieldIcon>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </FieldIcon>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="Name or email"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>
      )}

      {/* Row 3 — Description (full width) */}
      <div className="md:col-span-2 lg:col-span-3">
        <label className={labelCls}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          placeholder="Add context or details…"
          className={textareaCls}
        />
      </div>

      {/* Row 4 — Remarks (2) + Actions (1, right-aligned) */}
      <div className="md:col-span-2">
        <label className={labelCls}>Remarks</label>
        <input
          type="text"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Any notes or links…"
          className={inputCls}
        />
      </div>

      <div className="flex items-end justify-end gap-2">
        {onCancel && initialValues && (
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-white/40 px-4 text-sm font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-white/10 hover:text-gray-800 active:border-primary-400/40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-slate-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-primary-400/30 bg-gradient-to-r from-primary-600 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:from-primary-700 hover:to-fuchsia-600 hover:shadow-md active:scale-[0.98] active:border-primary-400/40 sm:w-auto"
        >
          {initialValues ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
