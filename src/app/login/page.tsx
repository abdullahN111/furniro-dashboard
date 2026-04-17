"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "../../.././public/images/Logo.png";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔍 Session status:", status);
    console.log("🔍 Session data:", session);

    if (status === "authenticated" && session) {
      console.log("✅ User is authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [session, status, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setError(res?.error || "Invalid email or password");
      }

      console.log("🧪 signIn result:", res);
    } catch (error) {
      console.error("❌ signIn error:", error);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center bg-[--dark] lg:rounded-lg py-6 sm:py-16 px-8 min-h-screen">
      <div className="text-center w-full max-w-sm space-y-6 mb-6">
        <div className="flex items-center justify-center gap-2">
          <Image src={Logo} alt="furniro logo" width={45} height={30} />
            <h2 className="text-3xl font-bold">
              Furniro
            </h2>
        </div>
       <p className="text-white text-base">
         Login now to access your account
       </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2"> 
          <label className="text-base font-semibold">
            Email Address
          </label>
          <input
            placeholder="Enter your email"
            className="text-sm text-[#333] border border-black p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[--bgSoft]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-base font-semibold">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="text-sm text-[#333] border border-black p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[--bgSoft]"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-[--bgSoft]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start sm:items-center w-full text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-white accent-slate-50"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-white hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          className="text-white text-base bg-[#3f3fad] hover:bg-[#313195] rounded-md py-2 font-semibold shadow-md transition duration-300 w-full max-w-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 
          0 0 5.373 0 12h4zm2 5.291A7.962 
          7.962 0 014 12H0c0 3.042 1.135 
          5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
        {error && (
          <div className="mt-3 bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded-md text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
