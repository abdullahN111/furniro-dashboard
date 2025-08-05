"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        alert("Login failed: " + (res?.error ?? "Unknown error"));
      }

      console.log("🧪 signIn result:", res);
    } catch (error) {
      console.error("❌ signIn error:", error);
      alert("Login failed");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center bg-[--dark] lg:rounded-lg py-8 sm:py-16 lg:py-24 px-8 min-h-screen">
      <div className="text-center w-full max-w-sm">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white my-4">
          Unlock Your Home&apos;s Elegance
        </h2>
        <p className="text-white text-sm lg:text-base mb-6">
          Sign in now and start creating your dream space with our premium
          furniture.
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm flex flex-col gap-4 sm:gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-base sm:text-lg font-semibold">
            Email Address
          </label>
          <input
            placeholder="Enter your email"
            className="text-sm sm:text-base text-[#333] border border-black py-2 sm:py-3 px-3 sm:px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[--bgSoft]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-base sm:text-lg font-semibold">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="text-sm sm:text-base text-[#333] border border-black py-2 sm:py-3 px-3 sm:px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[--bgSoft]"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 sm:right-4 top-2 sm:top-3 text-gray-500 hover:text-[--bgSoft]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start sm:items-center w-full text-[13px] sm:text-[15px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-white accent-slate-50"
            />
            Remember me
          </label>
          <a
            href="#"
            className="text-white hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <button
          className="text-white text-base sm:text-lg bg-[#3f3fad] hover:bg-[#313195] rounded-md py-2 sm:py-3 px-4 sm:px-6 font-semibold shadow-md transition duration-300 w-full max-w-sm mt-4 sm:mt-6"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
