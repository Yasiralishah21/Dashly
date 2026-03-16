"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

/**
 * Login and sign-up form. For demo we use fixed credentials (abcdef / 123456).
 * "Sign in with Gmail" is a placeholder and does not connect to real Gmail.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    if (isSignUp) {
      // Dummy sign up: same as login for demo. Just show a message or switch to login.
      if (username.trim() === "abcdef" && password.trim() === "123456") {
        login(username.trim(), password.trim());
      } else {
        setError("For demo sign up, use username: abcdef and password: 123456");
      }
      return;
    }
    const ok = login(username.trim(), password.trim());
    if (!ok) {
      setError("Invalid username or password. Try: abcdef / 123456");
    }
  };

  const handleGmail = () => {
    // Placeholder: no real Gmail auth. For demo we just show an alert or use dummy login.
    setError("Gmail sign-in is not connected yet. Use username: abcdef, password: 123456");
  };

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-slate-100 px-3 py-6 sm:px-4 dark:bg-slate-900">
      <Link
        href="/"
        className="fixed left-3 top-3 z-10 flex items-center gap-1.5 sm:left-4 sm:top-4 sm:gap-2 font-semibold text-slate-900 dark:text-white"
      >
        <span
          className="flex h-7 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-indigo-600 text-xs sm:h-8 sm:w-16 sm:text-sm text-white"
          style={{
            background: `
              radial-gradient(circle at 10% 90%,rgb(0, 14, 71) 0%, transparent 45%),
              radial-gradient(circle at 90% 90%,rgb(39, 0, 80) 0%, transparent 55%),
              radial-gradient(circle at 50% 90%,rgb(21, 0, 112) 0%, transparent 65%),
              #f1f5f9
            `
          }}
        >
          YasAI
        </span>
        <span className="text-base sm:text-xl">Productivity</span>
      </Link>

      <div className="w-full signup-style max-w-sm min-w-0 rounded-xl bg-white p-4 shadow-lg sm:p-6 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-center text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
          {isSignUp ? "Sign up" : "Sign in"}
        </h1>
        <p className="mt-1 text-center text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Demo: abcdef / 123456
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:mt-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username or email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="abcdef"
              className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 sm:py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 sm:py-2"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="btn-primary w-full min-w-0 py-3 sm:py-2.5"
          >
            {isSignUp ? "Sign up" : "Sign in"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGmail}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Gmail
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsSignUp((s) => !s)}
          className="btn-secondary mt-4 w-full min-w-0 py-2 text-center text-sm"
        >
          {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
