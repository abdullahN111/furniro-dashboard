"use client";

import { useState, useEffect } from "react";
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
      {
        title: "Reports",
        path: "/dashboard/dispatched-orders",
        icon: <MdAnalytics />,
      },
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

  const closeSidebar = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar");
      const menuButton = document.querySelector(".menu-button");

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-14 left-4 z-40 p-2 sm:p-4 text-white rounded-md bg-[--bgSoft] menu-button"
      >
        <MdMenu size={20} className="sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[--bgSoft] p-3 sm:p-4 transition-transform duration-300 z-50 w-[180px] sm:w-[200px] lg:w-[220px] overflow-y-auto sidebar ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex justify-end mb-3 lg:hidden">
          <button
            onClick={closeSidebar}
            className="text-white hover:text-[--textSoft] p-1"
          >
            <MdClose size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Image
            src="/images/noavatar.png"
            alt="user image"
            width="32"
            height="32"
            className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10"
          />
          <div className="flex flex-col text-xs min-w-0 flex-1">
            <span className="font-semibold text-xs sm:text-sm truncate">
              {session?.user?.name || "Loading..."}
            </span>
            <span className="text-[--textSoft] text-xs truncate">
              {(session?.user as { role?: string })?.role === "admin"
                ? "Administrator"
                : "Editor"}
            </span>
          </div>
        </div>

        <ul className="space-y-3 sm:space-y-4">
          {menuItems.map((category) => (
            <li key={category.title}>
              <span className="text-[--textSoft] font-bold text-xs sm:text-sm block mb-2 sm:mb-3">
                {category.title}
              </span>
              <div className="space-y-1">
                {category.list.map((item) => (
                  <MenuLink
                    item={item}
                    key={item.title}
                    onItemClick={closeSidebar}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 sm:p-3 mt-4 sm:mt-6 w-full rounded-lg cursor-pointer hover:bg-[#2e374a] text-sm sm:text-base"
        >
          <MdLogout className="w-4 h-4 sm:w-5 sm:h-5" /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
