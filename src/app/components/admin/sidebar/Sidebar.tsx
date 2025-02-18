"use client";

import { useState } from "react";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
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
      { title: "Teams", path: "/dashboard/teams", icon: <MdPeople /> },
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

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden pt-4 p-[2px] sm:p-2 flex flex-col md:flex-row items-center gap-1 sm:gap-2 text-white rounded-md"
      >
        <MdMenu size={24} />
        <span className="text-sm text-[--textSoft] font-bold">Admin</span>
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-[--bgSoft] p-4 transition-transform duration-300 z-50 w-42 shadow-lg overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-auto`}
      >
        <div className="flex justify-end mb-3 lg:hidden">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <Image
            src="/images/noavatar.png"
            alt="user image"
            width="40"
            height="40"
            className="rounded-full object-cover"
          />
          <div className="flex flex-col text-xs">
            <span className="font-semibold">John Doe</span>
            <span className="text-[--textSoft]">Administrator</span>
          </div>
        </div>

        <ul>
          {menuItems.map((items) => (
            <li key={items.title}>
              <span className="text-[--textSoft] font-bold text-sm my-2 mx-0 block">
                {items.title}
              </span>
              {items.list.map((item) => (
                <MenuLink item={item} key={item.title} />
              ))}
            </li>
          ))}
        </ul>

        <button className="flex items-center gap-2 p-3 my-3 w-full rounded-lg cursor-pointer hover:bg-[#2e374a]">
          <MdLogout /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
