"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MdVisibility, MdVisibilityOff, MdLockOutline, MdMailOutline } from "react-icons/md";
import Logo from "../../../public/images/Logo.png";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setError(res?.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("signIn error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center p-2">
              <Image src={Logo} alt="Furniro logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
                Furniro
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                Admin Console
              </span>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-slate-100 pt-2">
            Sign in to your account
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Enter your credentials to access the operations dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <MdMailOutline className="absolute left-3.5 text-slate-400" size={18} />
              <input
                placeholder="admin@furniro.com"
                className="text-sm text-slate-100 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pl-10 pr-4 py-2.5 rounded-xl w-full outline-none placeholder:text-slate-500 transition-all"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <MdLockOutline className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="text-sm text-slate-100 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pl-10 pr-10 py-2.5 rounded-xl w-full outline-none placeholder:text-slate-500 transition-all"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            className="text-white text-sm bg-indigo-600 hover:bg-indigo-500 rounded-xl py-2.5 px-4 font-semibold shadow-lg shadow-indigo-600/20 transition-all w-full mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
