export default function TaskCard({ task, onEdit, onDelete }) {
  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
          >
            {task.status}
          </span>
        </div>
        {task.description && (
          <p className="text-xs text-slate-600 line-clamp-3">{task.description}</p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <div className="space-y-0.5">
          {task.dueDate && (
            <p>
              <span className="font-medium">Due:</span>{' '}
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          <p>
            <span className="font-medium">Created:</span>{' '}
            {task.createdOn && new Date(task.createdOn).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

