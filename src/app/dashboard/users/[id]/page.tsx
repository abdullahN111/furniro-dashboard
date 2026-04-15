"use client";

import { updateUser } from "@/app/lib/actions";
import { fetchUser } from "@/app/lib/data";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SingleUserPage = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const { id } = params;
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    // validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
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
        setErrorMessage(data.error);
        return;
      }

      setSuccessMessage("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsStockModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUser((prev: any) => ({
      ...prev,
      [name]:
        name === "isAdmin" || name === "isActive" ? value === "Yes" : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-red-500">User not found</div>;
  }

  const canEdit = (session?.user as { id?: string })?.id === id;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 mt-5" key={id}>
        <div className="flex-1 bg-[--bgSoft] p-5 rounded-2xl font-bold text-[--textSoft] h-max flex flex-col items-center justify-center shadow-md border border-[#2e374a]">
          <div className="w-[180px] h-[180px] relative rounded-full overflow-hidden mb-4 border-4 border-[#2e374a] shadow-lg">
            <Image
              src={user.img || "/images/noavatar.png"}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-lg font-semibold text-[--text]">{user.username}</p>
          <p className="text-xs text-[--textSoft] mt-1">User Profile</p>
        </div>
        <div className="flex-[3] bg-[--bgSoft] p-5 rounded-2xl shadow-md border border-[#2e374a]">
          {!canEdit && (
            <div className="text-orange-500 font-semibold text-center mb-4">
              👁️ View Only - You can only edit your own profile
            </div>
          )}
          <form action={updateUser} className="flex flex-col">
            <input
              type="hidden"
              name="id"
              value={user._id}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <label className="text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={user.username || ""}
              onChange={handleChange}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />

            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              readOnly={!canEdit}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <label className="text-sm">Password</label>
            <input
              type="password"
              name="password"
              readOnly={!canEdit}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value="********"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-2 mb-2 items-start sm:items-center text-sm sm:text-base">
              <Dialog
                open={isStockModalOpen}
                onOpenChange={setIsStockModalOpen}
              >
                <DialogTrigger asChild>
                  <button className="mx-auto bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-[13px] shadow">
                    Change Password
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[--bgSoft] text-[--text] p-6 rounded-xl max-w-md border-0 shadow-xl">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-xl font-semibold text-center">
                      Change Password
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[--textSoft]">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={loading}
                        className="w-full bg-[--bg] text-[--text] border border-[#2e374a] placeholder:text-[--textSoft] focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[--textSoft]">
                        New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        className="w-full bg-[--bg] text-[--text] border border-[#2e374a] placeholder:text-[--textSoft] focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[--textSoft]">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        className="w-full bg-[--bg] text-[--text] border border-[#2e374a] placeholder:text-[--textSoft] focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    {errorMessage && (
                      <div className="bg-red-500/10 text-red-500 px-1 py-2 rounded-md text-[13px]">
                        {errorMessage}
                      </div>
                    )}

                    {successMessage && (
                      <div className="bg-green-500/10 text-green-500 px-1 py-2 rounded-md text-[13px]">
                        {successMessage}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setIsStockModalOpen(false)}
                      disabled={isUpdatingPassword}
                      className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePasswordUpdate}
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <label className="text-sm">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <label className="text-sm">Address</label>
            <textarea
              typeof="text"
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <label className="text-sm">Role</label>
            <select
              name="isAdmin"
              id="isAdmin"
              value={user.isAdmin ? "Yes" : "No"}
              onChange={handleChange}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="Yes">Admin</option>
              <option value="No">Editor</option>
            </select>
            <label className="text-sm">Is Active?</label>
            <select
              name="isActive"
              id="isActive"
              value={user.isActive ? "Yes" : "No"}
              onChange={handleChange}
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <label className="text-sm">Image</label>

            <input
              type="file"
              accept="image/*"
              name="image"
              className="px-4 py-3 border border-[#2e374a] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <button
              className={`w-full px-5 py-5 border-none rounded-md cursor-pointer mt-5 ${
                canEdit
                  ? "bg-teal-500 text-[var(--text)]"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!canEdit}
            >
              {canEdit ? "Update" : "View Only"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SingleUserPage;
