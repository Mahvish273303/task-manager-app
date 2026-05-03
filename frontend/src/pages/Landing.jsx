import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Landing() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      {/* Theme toggle — top right */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary-500/10 dark:bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/8 dark:bg-emerald-600/8 blur-3xl" />
      </div>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        {/* Logo mark */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-900/25">
          <svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-50 sm:text-5xl">
          TaskFlow
        </h1>
        <p className="mt-4 max-w-md text-base text-gray-500 dark:text-slate-400 leading-relaxed">
          A clean, focused workspace to plan, track, and complete your team's
          work — without the noise.
        </p>

        {/* Feature pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {['Project management', 'Role-based access', 'Real-time tracking'].map((f) => (
            <span
              key={f}
              className="rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-3 py-1 text-xs text-gray-500 dark:text-slate-400"
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-900/20 transition duration-200 hover:from-primary-500 hover:to-primary-400 hover:shadow-xl active:scale-[0.98]"
          >
            Get started
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-7 py-3 text-sm font-medium text-gray-700 dark:text-slate-200 transition duration-200 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-[0.98]"
          >
            Sign up
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center text-xs text-gray-400 dark:text-slate-600">
        © {new Date().getFullYear()} TaskFlow. Built for teams that ship.
      </footer>
    </div>
  );
}
