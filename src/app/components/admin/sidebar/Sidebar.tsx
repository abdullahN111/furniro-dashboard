"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  // MdPeople,
  // MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import MenuLink from "./menu-link/MenuLink";
import Image from "next/image";

const menuItems = [
  {
    title: "Pages",
    list: [
      { title: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
      {
        title: "Products",
        path: "/dashboard/products",
        icon: <MdShoppingBag />,
      },
      { title: "Orders", path: "/dashboard/orders", icon: <MdShoppingBag /> },
      {
        title: "Transactions",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney />,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      { title: "Revenue", path: "/dashboard/revenue", icon: <MdWork /> },
      { title: "Reports", path: "/dashboard/reports", icon: <MdAnalytics /> },
      // { title: "Teams", path: "/dashboard/teams", icon: <MdPeople /> },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      // {
      //   title: "Settings",
      //   path: "/dashboard/settings",
      //   icon: <MdOutlineSettings />,
      // },
      { title: "Help", path: "/dashboard/help", icon: <MdHelpCenter /> },
    ],
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg+:hidden fixed top-2 left-2 z-40 p-4 text-white rounded-md bg-[--bgSoft]"
      >
        <MdMenu size={24} />
      </button>

      <div
        className={`fixed lg+:sticky top-0 left-0 h-screen lg+:h-fit bg-[--bgSoft] p-4 transition-transform duration-300 z-50 w-[220px] overflow-y-auto sidebar ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg+:translate-x-0`}
      >
        <div className="flex justify-end mb-3 lg+:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-[--textSoft]"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/images/noavatar.png"
            alt="user image"
            width="40"
            height="40"
            className="rounded-full object-cover"
          />
          <div className="flex flex-col text-xs">
            <span className="font-semibold">
              {session?.user?.name || "Loading..."}
            </span>
            <span className="text-[--textSoft]">
              {(session?.user as { role?: string })?.role === "admin"
                ? "Administrator"
                : "Editor"}
            </span>
          </div>
        </div>

        <ul className="space-y-4">
          {menuItems.map((category) => (
            <li key={category.title}>
              <span className="text-[--textSoft] font-bold text-sm block mb-3">
                {category.title}
              </span>
              <div className="space-y-1">
                {category.list.map((item) => (
                  <MenuLink item={item} key={item.title} />
                ))}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 mt-6 w-full rounded-lg cursor-pointer hover:bg-[#2e374a]"
        >
          <MdLogout /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
