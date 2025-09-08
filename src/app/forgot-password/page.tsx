"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-[--dark]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded w-full mb-4"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Send Reset Link
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>
    </div>
  );
}
