const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const STATUS_STYLES = {
  Completed: {
    badge: 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border-lime-400/30',
    dot: 'bg-lime-500 dark:bg-lime-400'
  },
  'In Progress': {
    badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-400/30',
    dot: 'bg-blue-500 dark:bg-blue-400'
  },
  Pending: {
    badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-400/30',
    dot: 'bg-yellow-500 dark:bg-yellow-400'
  }
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const style = STATUS_STYLES[task.status] || STATUS_STYLES.Pending;
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const createdAt = task.createdAt || task.createdOn;
  const isCompleted = task.status === 'Completed';
  const isOverdue = due && !isCompleted && due < new Date();

  return (
    <article className={`group flex h-full w-full flex-col justify-between rounded-2xl border border-white/40 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md active:border-primary-400/40 dark:border-white/10 dark:bg-slate-800/80 dark:hover:shadow-lg dark:hover:shadow-slate-950/60 ${
      isOverdue
        ? 'hover:border-red-300 dark:hover:border-red-400/40'
        : 'hover:border-primary-300/40 dark:hover:border-primary-400/35'
    }`}>
      {/* Badges row */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-relaxed ${style.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {task.status}
          </span>
          {task.project && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary-400/30 bg-primary-500/10 px-2 py-0.5 text-xs font-medium leading-relaxed text-primary-700 dark:text-primary-300">
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
              {task.project}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`line-clamp-2 text-base font-semibold leading-relaxed tracking-tight ${isCompleted ? 'text-gray-400 dark:text-slate-500 line-through decoration-gray-300 dark:decoration-slate-600' : 'text-gray-900 dark:text-slate-50'}`}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
            {task.description}
          </p>
        )}
      </div>

      {/* Meta + actions */}
      <div className="mt-4 space-y-3">
        <div className="space-y-1.5 text-xs leading-relaxed">
          {due && (
            <p className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'}`}>
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>
                {isOverdue ? 'Overdue · ' : 'Due · '}
                <span className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-300' : 'text-gray-700 dark:text-slate-200'}`}>
                  {due.toLocaleDateString()}
                </span>
              </span>
            </p>
          )}

          {task.assignedTo && (
            <p className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
              {/* Avatar initial */}
              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-500/20 text-[9px] font-bold text-primary-700 dark:text-primary-300">
                {task.assignedTo.charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="font-medium text-gray-700 dark:text-slate-200">{task.assignedTo}</span>
              </span>
            </p>
          )}

          {task.remarks && (
            <p className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <span className="line-clamp-1">{task.remarks}</span>
            </p>
          )}

          {createdAt && (
            <p className="text-gray-400 dark:text-slate-500">
              {new Date(createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Admin actions: Edit / Delete */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2 border-t border-gray-200/70 pt-3 dark:border-white/10">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="flex-1 rounded-lg border border-blue-400/30 bg-blue-500/10 py-2 text-center text-xs font-medium text-blue-700 transition-all duration-200 ease-in-out hover:bg-blue-500/15 active:border-primary-400/40 dark:text-blue-300"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="flex-1 rounded-lg border border-red-400/30 bg-red-500/10 py-2 text-center text-xs font-medium text-red-600 transition-all duration-200 ease-in-out hover:bg-red-500/15 active:border-primary-400/40 dark:text-red-300"
              >
                Delete
              </button>
            )}
          </div>
        )}

        {/* Inline status update — available to all users */}
        {onStatusChange && (
          <div className="border-t border-gray-200/70 pt-3 dark:border-white/10">
            <div className="relative">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-white/40 bg-white/60 px-3 text-sm text-gray-700 outline-none transition-all duration-200 ease-in-out focus:border-primary-400/60 focus:ring-1 focus:ring-primary-500/20 active:border-primary-400/40 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-slate-500 text-xs">▾</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
