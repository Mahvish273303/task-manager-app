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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Task Manager</h1>
            <p className="text-xs text-slate-500">
              Manage tasks, track statuses, and stay organized.
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <SearchBar
          query={searchQuery}
          status={statusFilter}
          onQueryChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
          <div>
            <TaskForm
              onSubmit={editingTask ? handleUpdate : handleCreate}
              initialValues={editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Tasks</h2>
              {loading && (
                <span className="text-xs text-slate-500">Loading, please wait...</span>
              )}
            </div>
            <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}

