"use client";

import { useMemo } from "react";
import Link from "next/link";
// import Image from "next/image";
import SearchBar from "@/app/dashboard/search/SearchBar";
import { useSearch } from "@/app/dashboard/search/SearchContext";

const Users = () => {
  const { pageSearchQuery } = useSearch();
  const users = useMemo(
    () => [
      {
        id: "U001",
        name: "John Doe",
        email: "johndoe@example.com",
        role: "Admin",
      },
      {
        id: "U002",
        name: "Alice Green",
        email: "alicegreen@example.com",
        role: "Editor",
      },
      {
        id: "U003",
        name: "Michael Brown",
        email: "michaelbrown@example.com",
        role: "User",
      },
      {
        id: "U004",
        name: "Emma Smith",
        email: "emmasmith@example.com",
        role: "Moderator",
      },
      {
        id: "U005",
        name: "Sophia White",
        email: "sophiawhite@example.com",
        role: "User",
      },
    ],
    []
  );
  const filteredUsers = useMemo(() => {
    if (!pageSearchQuery) return users;
    return users.filter(
      (u) =>
        u.id.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [pageSearchQuery, users]);


  return (
    <div className="container bg-[--bgSoft] w-full p-4 rounded-[10px] mt-5">
      <div className="mt-2 mb-3 flex justify-between">
        <SearchBar scope="page" />
        <button className="bg-[#3f3fad] hover:bg-[#3f3faddc] text-white px-3 rounded-md text-xs sm:text-sm shadow">
          Add User
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-[#2e374a] text-white">
              <th className="p-[10px] text-left w-[0.5/4]">ID</th>
              <th className="p-[10px] text-left w-[1.2/4]">Name</th>
              <th className="p-[10px] text-left w-[1.8/4]">Email</th>
              <th className="p-[10px] text-left w-1/4">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="bg-[--bgSoft] text-white hover:bg-zinc-100/50"
              >
                <td className="p-[10px] text-left">
                  <Link href="/" className="">
                    {user.id}
                  </Link>
                </td>
                <td className="p-[10px] text-left">
                  <Link href="/" className="">
                    {user.name}
                  </Link>
                </td>
                <td className="p-[10px] text-left">
                  <Link href="/" className="">
                    {user.email}
                  </Link>
                </td>
                <td className="p-[10px] text-left">
                  <Link href="/" className="">
                    {user.role}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-3 sm:p-4 border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]"
          >
            <p className="text-sm sm:text-[15px] text-white mb-2">
              ID:{" "}
              <Link href="/" className="">
                {user.id}
              </Link>
            </p>
            <p className="text-sm sm:text-[15px] text-white mb-2">
              Name:{" "}
              <Link href="/" className="">
                {user.name}
              </Link>
            </p>
            <p className="text-sm sm:text-[15px] text-white mb-2">
              Email:{" "}
              <Link href="/" className="">
                {user.email}
              </Link>
            </p>
            <p className="text-sm sm:text-[15px] text-white mb-2">
              Role:{" "}
              <Link href="/" className="">
                {user.role}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
