"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdMailOutline, MdArrowBack } from "react-icons/md";
import Logo from "../../../public/images/Logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Unable to send reset link");
      } else {
        setIsError(false);
        setMessage(
          data.message ||
            "If an account with that email exists, a password reset link has been sent."
        );
      }
    } catch {
      setIsError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center p-2">
              <Image src={Logo} alt="Furniro logo" width={28} height={28} className="object-contain" />
            </div>
            <span className="text-xl font-bold text-white">Furniro</span>
          </div>
          <h1 className="text-xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Enter your account email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <MdMailOutline className="absolute left-3.5 text-slate-400" size={18} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/90 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder:text-slate-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-60"
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
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
    </div>
  );
}
