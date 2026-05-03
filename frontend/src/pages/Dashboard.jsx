import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createTask,
  deleteTask,
  fetchTasks,
  searchTasks,
  updateTask
} from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import SearchBar from '../components/SearchBar.jsx';

// ─── Avatar colour from name ──────────────────────────────────────────────────
function nameToColor(name = '') {
  const palette = [
    'from-primary-500 to-primary-700',
    'from-violet-500 to-violet-700',
    'from-rose-500 to-rose-700',
    'from-teal-500 to-teal-700',
    'from-amber-500 to-amber-700',
    'from-sky-500 to-sky-700'
  ];
  const idx = name.charCodeAt(0) % palette.length;
  return palette[idx];
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/80 px-4 py-4 shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-md active:border-primary-400/40 dark:border-white/10 dark:bg-slate-800/80">
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none text-gray-900 dark:text-slate-50">{value}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

// ─── Project selector ─────────────────────────────────────────────────────────
function ProjectSelector({ projects, selected, onSelect, onCreateProject, isAdmin }) {
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName.trim());
    setNewName('');
    setShowInput(false);
  };

  const pillBase =
    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out';
  const pillActive = 'border border-primary-400/30 bg-primary-500/20 text-primary-700 shadow-sm dark:text-primary-300';
  const pillInactive =
    'border border-white/40 bg-white/60 text-gray-700 hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => onSelect('')} className={`${pillBase} ${selected === '' ? pillActive : pillInactive}`}>
        All Projects
      </button>

      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.name)}
          className={`${pillBase} ${selected === p.name ? pillActive : pillInactive}`}
        >
          {p.name}
        </button>
      ))}

      {/* Admin-only: add new project */}
      {isAdmin && !showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-1 rounded-full border border-dashed border-white/40 px-3.5 py-1.5 text-xs text-gray-500 transition-all duration-200 ease-in-out hover:bg-white/10 hover:text-gray-700 dark:border-white/10 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New project
        </button>
      )}

      {isAdmin && showInput && (
        <form onSubmit={handleCreate} className="flex items-center gap-1.5 animate-slide-down">
          <input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Project name"
            className="w-36 rounded-full border border-primary-400/40 bg-white/70 px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ease-in-out focus:ring-1 focus:ring-primary-500/30 dark:border-primary-500/40 dark:bg-slate-800/80 dark:text-slate-50 dark:placeholder:text-slate-500"
          />
          <button type="submit" className="rounded-full border border-primary-400/30 bg-gradient-to-r from-primary-600 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 ease-in-out hover:from-primary-700 hover:to-fuchsia-600">
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="rounded-full border border-white/40 px-3 py-1.5 text-xs text-gray-500 transition-all duration-200 ease-in-out hover:bg-white/10 hover:text-gray-700 dark:border-white/10 dark:text-slate-400 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Avatar dropdown menu ─────────────────────────────────────────────────────
function AvatarMenu({ user, avatarGradient, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Avatar trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient} text-[13px] font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-900 transition duration-200 hover:ring-primary-300 dark:hover:ring-primary-500/40`}
        aria-label="User menu"
      >
        {user?.name?.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 animate-slide-down rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-gray-200/60 dark:shadow-slate-950/60 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-50 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5">
              {user?.email}
            </p>
            <span
              className={`mt-1.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                user?.role === 'Admin'
                  ? 'border-primary-200 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
              }`}
            >
              {user?.role}
            </span>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 dark:text-red-400 transition duration-150 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem('tm_projects');
      return stored ? JSON.parse(stored) : [{ id: '1', name: 'General' }];
    } catch {
      return [{ id: '1', name: 'General' }];
    }
  });
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    localStorage.setItem('tm_projects', JSON.stringify(projects));
  }, [projects]);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data =
        searchQuery || statusFilter
          ? await searchTasks({ q: searchQuery, status: statusFilter || undefined })
          : await fetchTasks(statusFilter ? { status: statusFilter } : undefined);
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(loadTasks, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handleCreate = async (form) => {
    setLoading(true);
    setError('');
    try {
      await createTask({ ...form, createdBy: user?.name || user?.email || 'web-user' });
      setEditingTask(null);
      await loadTasks();
    } catch {
      setError('Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    if (!editingTask) return;
    setLoading(true);
    setError('');
    try {
      await updateTask(editingTask.id, {
        ...form,
        updatedBy: user?.name || user?.email || 'web-user'
      });
      setEditingTask(null);
      await loadTasks();
    } catch {
      setError('Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setLoading(true);
    setError('');
    try {
      await deleteTask(task.id);
      await loadTasks();
    } catch {
      setError('Failed to delete task.');
    } finally {
      setLoading(false);
    }
  };

  // Members can update the status of tasks assigned to them
  const handleStatusChange = async (taskId, status) => {
    setError('');
    try {
      await updateTask(taskId, { status, updatedBy: user?.name || 'web-user' });
      await loadTasks();
    } catch {
      setError('Failed to update task status.');
    }
  };

  const handleCreateProject = (name) => {
    setProjects((prev) => [...prev, { id: Date.now().toString(), name }]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Members only see tasks assigned to them; Admins see everything
  const visibleTasks = isAdmin
    ? tasks
    : tasks.filter(
        (t) => t.assignedTo?.toLowerCase() === user?.name?.toLowerCase()
      );

  const displayedTasks = selectedProject
    ? visibleTasks.filter((t) => t.project === selectedProject)
    : visibleTasks;

  const now = new Date();
  const isOverdueTask = (t) => {
    const d = t.dueDate ? new Date(t.dueDate) : null;
    return d && t.status !== 'Completed' && d < now;
  };

  const stats = {
    total: visibleTasks.length,
    pending: visibleTasks.filter((t) => t.status === 'Pending').length,
    inProgress: visibleTasks.filter((t) => t.status === 'In Progress').length,
    completed: visibleTasks.filter((t) => t.status === 'Completed').length,
    overdue: visibleTasks.filter(isOverdueTask).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50">
      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-primary-500/8 dark:bg-primary-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/6 dark:bg-emerald-600/6 blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-gray-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6">

          {/* ── Left: Logo + wordmark ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-900/25 transition duration-200 group-hover:shadow-lg group-hover:shadow-primary-900/30">
              <svg className="h-[18px] w-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-slate-50">
                TaskFlow
              </p>
              <p className="hidden text-[11px] font-normal text-gray-400 dark:text-slate-500 sm:block">
                Workspace
              </p>
            </div>
          </Link>

          {/* ── Center: Live badge ── */}
          <div className="hidden sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 select-none">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>
              Live
            </span>
          </div>

          {/* ── Right: actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Divider */}
            <span className="hidden h-5 w-px bg-gray-200 dark:bg-slate-700 sm:block" />

            {/* Avatar + name + role — horizontal, desktop only */}
            <div className="hidden items-center gap-2.5 sm:flex">
              {/* Avatar */}
              <AvatarMenu
                user={user}
                avatarGradient={nameToColor(user?.name)}
                onLogout={handleLogout}
              />

              {/* Name + role badge side-by-side */}
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">
                  {user?.name}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide whitespace-nowrap ${
                    isAdmin
                      ? 'border-primary-200 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Avatar only — mobile */}
            <div className="sm:hidden">
              <AvatarMenu
                user={user}
                avatarGradient={nameToColor(user?.name)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Error banner */}
        {error && (
          <div className="animate-slide-down rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            color="bg-slate-500/15 text-slate-600 dark:text-slate-300"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 7h8M8 12h6M8 17h4" />
              </svg>
            }
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="bg-yellow-500/20 text-yellow-600 dark:text-yellow-300"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            }
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="bg-blue-500/20 text-blue-600 dark:text-blue-300"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12A10 10 0 1 1 12 2" />
                <path d="M22 2 12 12" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="bg-lime-500/20 text-lime-600 dark:text-lime-300"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            }
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            color="bg-red-500/15 text-red-500 dark:text-red-300"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            }
          />
        </div>

        {/* ── Search + project filter ── */}
        <div className="rounded-2xl border border-white/40 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in-out dark:border-white/10 dark:bg-slate-800/80">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
                  <h2 className="text-xl font-semibold leading-relaxed text-gray-800 dark:text-slate-100">
                Overview
              </h2>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                Filter and search your tasks
              </p>
            </div>
            {loading && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/60 px-3 py-1 text-xs text-gray-500 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-400">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                Loading…
              </span>
            )}
          </div>
          <div className="space-y-4">
            <SearchBar
              query={searchQuery}
              status={statusFilter}
              onQueryChange={setSearchQuery}
              onStatusChange={setStatusFilter}
            />
            <ProjectSelector
              projects={projects}
              selected={selectedProject}
              onSelect={setSelectedProject}
              onCreateProject={handleCreateProject}
              isAdmin={isAdmin}
            />
          </div>
        </div>

        {/* ── Main layout — stacked: form (full width) above, tasks (full width) below ── */}
        <div className="space-y-6">
          {/* Form panel — Admin only (or when editing) */}
          {(isAdmin || editingTask) && (
            <div className="w-full rounded-2xl border border-white/40 bg-white/80 px-5 py-5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in-out dark:border-white/10 dark:bg-slate-800/80">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold leading-relaxed text-gray-800 dark:text-slate-100">
                    {editingTask ? 'Edit Task' : 'Create Task'}
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                    {editingTask
                      ? 'Adjust details and save changes.'
                      : 'Add a new task to your workspace.'}
                  </p>
                </div>
                {editingTask && (
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="rounded-full border border-white/40 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-white/10 hover:text-gray-800 dark:border-white/10 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <TaskForm
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialValues={editingTask}
                onCancel={() => setEditingTask(null)}
                projects={projects}
                isAdmin={isAdmin}
              />
            </div>
          )}

          {/* Task list panel — always full width */}
          <div className="w-full rounded-2xl border border-white/40 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in-out dark:border-white/10 dark:bg-slate-800/80">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold leading-relaxed text-gray-800 dark:text-slate-100">
                  Tasks
                </h2>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                  {displayedTasks.length
                    ? `${displayedTasks.length} task${displayedTasks.length !== 1 ? 's' : ''}${selectedProject ? ` in ${selectedProject}` : ''}`
                    : 'No tasks match your filters'}
                </p>
              </div>
              {!isAdmin && (
                <span className="rounded-full border border-white/40 bg-white/60 px-3 py-1 text-xs text-gray-500 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-400">
                  Status editable
                </span>
              )}
            </div>
            <TaskList
              tasks={displayedTasks}
              onEdit={isAdmin ? setEditingTask : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
