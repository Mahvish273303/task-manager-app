export default function SearchBar({ query, status, onQueryChange, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <label className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
          Search
        </label>
        <div className="mt-1 flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm shadow-inner shadow-slate-950/50 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/30">
          <span className="mr-2 text-slate-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 3.5 3.5" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by title..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 outline-none"
          />
        </div>
      </div>

      <div className="w-full sm:w-44">
        <label className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
          Status
        </label>
        <div className="mt-1 relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-100 shadow-inner shadow-slate-950/50 outline-none ring-0 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs">
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}