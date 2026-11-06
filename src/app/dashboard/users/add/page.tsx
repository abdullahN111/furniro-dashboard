"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

const AddUserPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);

      const res = await fetch("/api/users/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add user");
        return;
      }

      toast.success("User account created successfully.");
      form.reset();
      setImagePreview(null);
      router.push("/dashboard/users");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/users"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-[#111827] border border-slate-800/90 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
          <div className="w-36 h-36 relative rounded-full overflow-hidden mb-4 border-4 border-slate-800 shadow-xl">
            <Image
              src={imagePreview || "/images/noavatar.png"}
              alt="Avatar Preview"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-base font-bold text-white">Profile Avatar</h3>
          <p className="text-xs text-slate-400 mt-1">
            JPG, PNG, WEBP, or GIF up to 4MB
          </p>
        </div>

        <div className="lg:col-span-8 bg-[#111827] border border-slate-800/90 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 pb-3 border-b border-slate-800">
            Account Credentials &amp; Permissions
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  minLength={3}
                  maxLength={20}
                  placeholder="johndoe"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@furniro.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Initial Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Access Role
                </label>
                <select
                  name="isAdmin"
                  defaultValue="false"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="true">Administrator (Full Access)</option>
                  <option value="false">Editor (Standard Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Account Status
                </label>
                <select
                  name="isActive"
                  defaultValue="true"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Deactivated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                rows={3}
                placeholder="Street, City, Country"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Upload Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
                className="w-full px-3.5 py-2 text-xs text-slate-300 border border-slate-800 rounded-xl bg-slate-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create User Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
