export default function TaskCard({ task, onEdit, onDelete }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40';
      case 'In Progress':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/40';
      default:
        return 'bg-amber-500/10 text-amber-200 border-amber-500/40';
    }
  };

  const createdAt = task.createdAt || task.createdOn;
  const due = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-slate-50 shadow-lg shadow-slate-950/40 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-900/40">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-sm font-semibold tracking-tight">
              {task.title}
            </h3>
            {task.description && (
              <p className="line-clamp-3 text-xs leading-relaxed text-slate-300">
                {task.description}
              </p>
            )}
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusStyles(
              task.status
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {task.status}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 text-[11px] text-slate-300">
        <div className="space-y-1">
          {due && (
            <p className="flex items-center gap-1">
              <span className="text-slate-400">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </span>
              <span>
                Due:{' '}
                <span className="font-medium text-slate-100">
                  {due.toLocaleDateString()}
                </span>
              </span>
            </p>
          )}
          {createdAt && (
            <p className="text-slate-400">
              Created:{' '}
              <span className="text-slate-200">
                {new Date(createdAt).toLocaleString()}
              </span>
            </p>
          )}
          {task.remarks && (
            <p className="line-clamp-1 text-slate-400">
              <span className="font-medium text-slate-300">Remarks:</span>{' '}
              <span>{task.remarks}</span>
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-sky-200 shadow-sm shadow-slate-950/40 transition group-hover:border-sky-400/60 hover:bg-sky-500/10"
          >
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-medium text-red-100 shadow-sm shadow-red-950/40 transition hover:border-red-400 hover:bg-red-500/20"
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}