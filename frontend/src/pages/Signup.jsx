import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const ROLES = [
  {
    value: 'Admin',
    label: 'Admin',
    desc: 'Create projects, assign tasks, manage team'
  },
  {
    value: 'Member',
    label: 'Member',
    desc: 'View and complete tasks assigned to you'
  }
];

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });
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
      const { token } = await registerApi(form);
      login(token);
      // Route to the correct role dashboard
      const role = JSON.parse(atob(token.split('.')[1])).role;
      navigate(role === 'Admin' ? '/dashboard/admin' : '/dashboard/member');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3 text-sm text-gray-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none transition duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-10">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-500/10 dark:bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/8 dark:bg-emerald-600/8 blur-3xl" />
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
            Create your account to get started
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Jane Smith"
                className={inputCls}
              />
            </div>

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
                placeholder="you@company.com"
                className={inputCls}
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
                minLength={6}
                placeholder="Min. 6 characters"
                className={inputCls}
              />
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                    className={`flex flex-col rounded-xl border p-3 text-left transition duration-200 ${
                      form.role === r.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 ring-1 ring-primary-500/40'
                        : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${form.role === r.value ? 'text-primary-600 dark:text-primary-300' : 'text-gray-700 dark:text-slate-200'}`}>
                      {r.label}
                    </span>
                    <span className="mt-0.5 text-[11px] leading-snug text-gray-400 dark:text-slate-500">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-900/20 transition duration-200 hover:from-primary-500 hover:to-primary-400 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 dark:text-primary-400 transition hover:text-primary-500 dark:hover:text-primary-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
