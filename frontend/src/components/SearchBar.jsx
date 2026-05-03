export default function SearchBar({ query, status, onQueryChange, onStatusChange }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Search */}
      <div className="flex-1">
        <div className="flex h-10 items-center gap-2 rounded-xl border border-white/40 bg-white/70 px-3.5 transition-all duration-200 ease-in-out focus-within:border-primary-400/60 focus-within:ring-2 focus-within:ring-primary-500/15 dark:border-white/10 dark:bg-slate-800/70 dark:focus-within:border-primary-500/60">
          <svg className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 3.5 3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by title…"
            className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="flex-shrink-0 text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Status filter */}
      <div className="relative w-full sm:w-52">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 text-base text-gray-900 outline-none transition-all duration-200 ease-in-out focus:border-primary-400/60 focus:ring-2 focus:ring-primary-500/15 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100 dark:focus:border-primary-500/60"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-gray-400 dark:text-slate-500 text-xs">▾</span>
      </div>
    </div>
  );
}
