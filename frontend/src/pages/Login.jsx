import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await loginApi(form);
      login(token);
      // Route to the correct role dashboard
      const role = JSON.parse(atob(token.split('.')[1])).role;
      navigate(role === 'Admin' ? '/dashboard/admin' : '/dashboard/member');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      {/* Theme toggle — top right */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-500/10 dark:bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/8 dark:bg-emerald-600/8 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/30">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-slate-50">
            TaskFlow
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Sign in to your workspace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 shadow-xl shadow-gray-200/60 dark:shadow-slate-950/60 backdrop-blur-sm">
          {error && (
            <div className="mb-5 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
                placeholder="you@company.com"
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3 text-sm text-gray-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none transition duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3 text-sm text-gray-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none transition duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-900/20 transition duration-200 hover:from-primary-500 hover:to-primary-400 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary-600 dark:text-primary-400 transition hover:text-primary-500 dark:hover:text-primary-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
