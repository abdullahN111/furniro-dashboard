"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "@/app/dashboard/search/SearchBar";
import { useSearch } from "@/app/dashboard/search/SearchContext";
import { fetchUsers } from "@/app/lib/data";
import Image from "next/image";
import UserActions from "./UserActions";
import { useSession} from "next-auth/react";


type User = {
  _id: string;
  username: string;
  email: string;
  img: string;
  createdAt: string;
  isAdmin: boolean;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const { pageSearchQuery } = useSearch();

  const filteredUsers = useMemo(() => {
    if (!pageSearchQuery) return users;
    return users.filter(
      (u) =>
        u._id.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [pageSearchQuery, users]);

  return (
    <div className="container bg-[--bgSoft] w-full p-4 rounded-[10px] mt-5">
      <div className="mt-2 mb-3 flex justify-between">
        <SearchBar scope="page" />
        {(session?.user as { role?: string })?.role === "admin"? (
          <Link href="/dashboard/users/add">
          <button className="bg-[#3f3fad] hover:bg-[#3f3faddc] text-white px-3 py-2 rounded-md text-xs sm:text-sm shadow">
            Add User
          </button>
        </Link>
        ): (
          <div>
          <button className="bg-[#3f3fad] text-white px-3 py-2 rounded-md text-xs sm:text-sm shadow opacity-70">
            Add User
          </button>
        </div>
        )}
      </div>

      <div className="hidden lg+:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#2e374a] text-white">
              <th className="p-[10px] text-left">ID</th>
              <th className="p-[10px] text-left">Image</th>
              <th className="p-[10px] text-left">Name</th>
              <th className="p-[10px] text-left">Email</th>
              {/* <th className="p-[10px] text-left">Created At</th> */}
              <th className="p-[10px] text-left">Role</th>
              <th className="p-[10px] text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className="bg-[--bgSoft] text-white hover:bg-zinc-100/50"
              >
                <td className="p-[10px] text-left">{index + 1}</td>
                <td className="p-[10px] text-left">
                  <Image
                    src={user.img || "/images/noavatar.png"}
                    alt={user.username}
                    width={50}
                    height={50}
                    className="rounded-[200%] object-cover w-[50px] h-[50px] cursor-pointer"
                  />
                </td>
                <td className="p-[10px] text-left">{user.username}</td>
                <td className="p-[10px] text-left">{user.email}</td>
                {/* <td className="p-[10px] text-left">{user.createdAt}</td> */}
                <td className="p-[10px] text-left">
                  {user.isAdmin ? "Admin" : "Editor"}
                </td>

                <td className="p-[10px] text-left flex gap-2 mt-2">
                  <UserActions
                    viewLink={`/dashboard/users/${user._id}`}
                    userId={user._id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg+:hidden flex flex-col gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={user._id}
            className="p-3 sm:p-4 border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]"
          >
            <div className="mb-2">
              <Image
                src={user.img || "/images/noavatar.png"}
                alt={user.username}
                width={50}
                height={50}
                className="rounded-[200%] object-cover w-[50px] h-[50px] cursor-pointer mb-4"
              />
              <p className="text-sm sm:text-[15px] text-white mb-2">
                ID: {index + 1}
              </p>
            </div>
            <p className="text-sm sm:text-[15px] text-white mb-2">
              Name: {user.username}
            </p>
            <p className="text-sm sm:text-[15px] text-white mb-2">
              Email: {user.email}
            </p>
            {/* <p className="text-sm sm:text-[15px] text-white mb-2">
              Created At: {user.createdAt}
            </p> */}
            <p className="text-sm sm:text-[15px] text-white mb-2">
              Role: {user.isAdmin ? "Admin" : "Editor"}
            </p>

            <div className="flex gap-2 mt-2">
              <UserActions
                viewLink={`/dashboard/users/${user._id}`}
                userId={user._id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
