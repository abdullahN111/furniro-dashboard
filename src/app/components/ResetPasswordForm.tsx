"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { MdLockOutline, MdArrowBack } from "react-icons/md";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setIsError(true);
      setMessage("Missing password reset token. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Failed to reset password");
      } else {
        setIsError(false);
        setMessage(data.message || "Password reset successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setIsError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white">Choose a New Password</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Enter a strong password (minimum 6 characters) for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            New Password
          </label>
          <div className="relative flex items-center">
            <MdLockOutline className="absolute left-3.5 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/90 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <MdLockOutline className="absolute left-3.5 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/90 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-60"
        >
          {loading ? "Updating Password..." : "Reset Password"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3.5 rounded-xl text-xs sm:text-sm border ${
            isError
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-800 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs sm:text-sm font-medium transition-colors"
        >
          <MdArrowBack size={16} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
