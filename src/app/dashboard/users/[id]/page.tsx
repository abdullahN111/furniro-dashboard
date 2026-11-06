/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateUser } from "@/app/lib/actions";
import { fetchUser } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdLockOutline } from "react-icons/md";

const SingleUserPage = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const { id } = params;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isSubmittingRef = useRef(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const isOwnProfile = (session?.user as any)?.id === user?._id;
  const isSessionAdmin = (session?.user as any)?.role === "admin";
  const canEditProfile = isOwnProfile || isSessionAdmin;

  const handlePasswordUpdate = async () => {
    if (isSubmittingRef.current) return;
    setErrorMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters");
      return;
    }

    isSubmittingRef.current = true;
    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update password");
        return;
      }

      toast.success("Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
      isSubmittingRef.current = false;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser(id);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    setUser((prev: any) => ({
      ...prev,
      [name]:
        name === "isAdmin" || name === "isActive" ? value === "Yes" : value,
    }));
  };

  if (loading) {
    return (
      <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
        <p className="text-lg font-bold text-white mb-2">User Not Found</p>
        <Link
          href="/dashboard/users"
          className="text-indigo-400 hover:underline text-sm"
        >
          Return to Users
        </Link>
      </div>
    );
  }

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      await updateUser(formData);
      toast.success("User profile updated successfully.");
      router.push("/dashboard/users");
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" key={id}>
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
        <div className="lg:col-span-4 bg-[#111827] p-6 rounded-2xl flex flex-col items-center text-center shadow-lg border border-slate-800/90">
          <div className="w-36 h-36 relative rounded-full overflow-hidden mb-4 border-4 border-slate-800 shadow-xl">
            <Image
              src={user.img || "/images/noavatar.png"}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-lg font-bold text-white">{user.username}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {user.isAdmin ? "Administrator" : "Editor"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                user.isActive !== false
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-300 border-rose-500/30"
              }`}
            >
              {user.isActive !== false ? "Active" : "Inactive"}
            </span>
          </div>

          {isOwnProfile && (
            <div className="w-full pt-5 mt-5 border-t border-slate-800">
              <Dialog
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <MdLockOutline size={16} className="text-indigo-400" />
                    <span>Change Password</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#111827] text-slate-100 p-6 rounded-2xl max-w-md border border-slate-800 shadow-2xl">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg font-bold text-white">
                      Update Account Password
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-3 space-y-4">
                    <div>
                      <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="mt-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-xl text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-2.5">
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordModalOpen(false)}
                      disabled={isUpdatingPassword}
                      className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold px-4"
                      onClick={handlePasswordUpdate}
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 bg-[#111827] p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800/90">
          <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-slate-800">
            Profile Information
          </h3>

          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <input type="hidden" name="id" value={user._id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={user.username || ""}
                  onChange={handleChange}
                  disabled={!canEditProfile}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-950 text-slate-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                  disabled={!canEditProfile}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Role Permission
                </label>
                <select
                  name="isAdmin"
                  id="isAdmin"
                  value={user.isAdmin ? "Yes" : "No"}
                  onChange={handleChange}
                  disabled={!isSessionAdmin}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500 disabled:opacity-60"
                >
                  <option value="Yes">Administrator</option>
                  <option value="No">Editor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Account Active Status
                </label>
                <select
                  name="isActive"
                  id="isActive"
                  value={user.isActive !== false ? "Yes" : "No"}
                  onChange={handleChange}
                  disabled={!isSessionAdmin}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500 disabled:opacity-60"
                >
                  <option value="Yes">Active</option>
                  <option value="No">Deactivated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Update Avatar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  disabled={!canEditProfile}
                  className="w-full px-3.5 py-2 text-xs text-slate-300 border border-slate-800 rounded-xl bg-slate-900 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                rows={3}
                value={user.address || ""}
                onChange={handleChange}
                disabled={!canEditProfile}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 outline-none focus:border-indigo-500 disabled:opacity-60"
              />
            </div>

            {canEditProfile && (
              <div className="pt-4 flex justify-end">
                <button
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving Changes..." : "Save Profile Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
