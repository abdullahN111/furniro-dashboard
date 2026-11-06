"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LocalSearchBar from "@/app/dashboard/search/LocalSearchBar";
import { fetchUsers } from "@/app/lib/data";
import Image from "next/image";
import UserActions from "./UserActions";
import { useSession } from "next-auth/react";
import { MdPersonAdd } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  _id: string;
  username: string;
  email: string;
  img?: string;
  createdAt?: string;
  isAdmin: boolean;
  isActive?: boolean;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const getUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        (u._id || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
  }, [searchQuery, users]);

  if (loading) {
    return (
      <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const adminsCount = users.filter((u) => u.isAdmin).length;
  const isCurrentUserAdmin =
    (session?.user as { role?: string })?.role === "admin";

  return (
    <div className="bg-[#111827] w-full p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-white text-base sm:text-lg font-bold">
            Team Members &amp; Access Control
          </h2>
          <p className="text-xs text-slate-400">
            Showing {filteredUsers.length} of {users.length} registered accounts ({adminsCount} admin{adminsCount !== 1 ? "s" : ""})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LocalSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search name or email..."
          />
          {isCurrentUserAdmin && (
            <Link
              href="/dashboard/users/add"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <MdPersonAdd size={17} />
              <span>Add User</span>
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-800/80">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                  No users match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell className="font-mono text-xs text-slate-400">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.img || "/images/noavatar.png"}
                        alt={user.username}
                        width={38}
                        height={38}
                        className="rounded-full object-cover w-9 h-9 border border-slate-700 shrink-0"
                      />
                      <span className="font-semibold text-slate-100">
                        {user.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        user.isAdmin
                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {user.isAdmin ? "Administrator" : "Editor"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        user.isActive !== false
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {user.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <UserActions
                      viewLink={`/dashboard/users/${user._id}`}
                      userId={user._id}
                      isAdmin={user.isAdmin}
                      adminsCount={adminsCount}
                      onUserDeleted={getUsers}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={user.img || "/images/noavatar.png"}
                  alt={user.username}
                  width={42}
                  height={42}
                  className="rounded-full object-cover w-10 h-10 border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${
                  user.isAdmin
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {user.isAdmin ? "Admin" : "Editor"}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <UserActions
                viewLink={`/dashboard/users/${user._id}`}
                userId={user._id}
                isAdmin={user.isAdmin}
                adminsCount={adminsCount}
                onUserDeleted={getUsers}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
