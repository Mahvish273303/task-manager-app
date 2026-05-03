import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/30 bg-white/50 px-6 py-14 text-center shadow-sm dark:border-white/10 dark:bg-slate-800/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/70 text-gray-400 shadow-sm dark:border-white/10 dark:bg-slate-800 dark:text-slate-500">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M9 2v4M15 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold leading-relaxed text-gray-700 dark:text-slate-200">No tasks here</p>
          <p className="mt-1 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {onEdit
              ? 'Create your first task using the form on the left — it will appear here as a card.'
              : 'No tasks match your current filters. Try adjusting your search or status filter.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 transition-all duration-200 ease-in-out md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
