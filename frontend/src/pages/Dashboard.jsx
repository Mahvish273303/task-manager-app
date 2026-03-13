import { useEffect, useState } from 'react';
import {
  createTask,
  deleteTask,
  fetchTasks,
  searchTasks,
  updateTask
} from '../services/api.js';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import SearchBar from '../components/SearchBar.jsx';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data =
        searchQuery || statusFilter
          ? await searchTasks({ q: searchQuery, status: statusFilter || undefined })
          : await fetchTasks(statusFilter ? { status: statusFilter } : undefined);
      setTasks(data);
    } catch (err) {
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
    const debounce = setTimeout(() => {
      loadTasks();
    }, 400);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handleCreate = async (form) => {
    setLoading(true);
    setError('');
    try {
      await createTask({
        ...form,
        createdBy: 'web-user'
      });
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
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
        updatedBy: 'web-user'
      });
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError('Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setLoading(true);
    setError('');
    try {
      await deleteTask(task.id);
      await loadTasks();
    } catch (err) {
      setError('Failed to delete task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Gradient background layer */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-sky-500/10" />

      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Task Manager Dashboard
            </h1>
            <p className="text-xs text-slate-300 sm:text-sm">
              Plan, track, and complete your tasks in a single view.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 shadow-sm shadow-slate-950/40 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>Live workspace</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-5">
        {/* Error banner */}
        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-md shadow-red-950/40">
            {error}
          </div>
        )}

        {/* Search + meta */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight sm:text-base">
                Overview
              </h2>
              <p className="text-xs text-slate-300">
                Filter by status or search by title to quickly find tasks.
              </p>
            </div>
            {loading && (
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                Loading…
              </div>
            )}
          </div>
          <SearchBar
            query={searchQuery}
            status={statusFilter}
            onQueryChange={setSearchQuery}
            onStatusChange={setStatusFilter}
          />
        </section>

        {/* Main two-column layout */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1.7fr)] items-start">
          {/* Left: form card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/60 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight sm:text-base">
                  {editingTask ? 'Edit Task' : 'Create Task'}
                </h2>
                <p className="text-xs text-slate-300">
                  {editingTask
                    ? 'Adjust details and save your changes.'
                    : 'Capture a new task with all the relevant information.'}
                </p>
              </div>
              {editingTask && (
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm shadow-slate-950/40 transition hover:border-slate-500 hover:bg-slate-800/80 sm:inline-flex"
                >
                  Cancel edit
                </button>
              )}
            </div>
            <TaskForm
              onSubmit={editingTask ? handleUpdate : handleCreate}
              initialValues={editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>

          {/* Right: list */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/60 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight sm:text-base">
                  Tasks
                </h2>
                <p className="text-xs text-slate-300">
                  {tasks.length
                    ? `You currently have ${tasks.length} task${
                        tasks.length > 1 ? 's' : ''
                      }.`
                    : 'No tasks yet — create your first task on the left.'}
                </p>
              </div>
            </div>

            <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={handleDelete} />
          </div>
        </section>
      </main>
    </div>
  );
}