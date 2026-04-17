"use client";

import { useState } from "react";
import Image from "next/image";

const AddUserPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/users/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add user");
        return;
      }

      e.currentTarget.reset();
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-5">
      <div className="flex-1 bg-[--bgSoft] p-3 sm:p-5 rounded-[10px] font-bold text-[--textSoft] h-max flex flex-col items-center justify-center">
        <div className="w-[230px] sm:w-[250px] lg:w-full h-[270px] lg:h-[280px] relative rounded-[10px] overflow-hidden mb-5">
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" fill />
          ) : (
            <Image src="/images/noavatar.png" alt="No Avatar" fill />
          )}
        </div>
        Profile Image
      </div>
      <div className="flex-[3] bg-[--bgSoft] p-3 sm:p-5 rounded-[10px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
          encType="multipart/form-data"
        >
          <label className="text-sm">Username</label>
          <input
            type="text"
            name="username"
            required
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Email</label>
          <input
            type="email"
            name="email"
            required
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Password</label>
          <input
            type="password"
            name="password"
            required
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Phone</label>
          <input
            type="tel"
            name="phone"
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Address</label>
          <textarea
            name="address"
            rows={3}
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Role</label>
          <select
            name="isAdmin"
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          >
            <option value="true">Admin</option>
            <option value="false">Editor</option>
          </select>
          <label className="text-sm">Is Active?</label>
          <select
            name="isActive"
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label className="text-sm">Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <button
            className="w-full px-5 py-5 bg-teal-500 text-[var(--text)] border-none rounded-md cursor-pointer mt-5"
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
                Adding...
              </span>
            ) : (
              "Add User"
            )}
          </button>
          {error && (
            <div className="mt-3 bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded-md text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;
