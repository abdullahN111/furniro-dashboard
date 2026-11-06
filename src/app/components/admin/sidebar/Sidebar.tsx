"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdInsights,
  MdLocalShipping,
  MdLogout,
  MdClose,
  MdInventory2,
} from "react-icons/md";
import MenuLink from "./menu-link/MenuLink";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/app/dashboard/search/SearchContext";

const menuItems = [
  {
    title: "Overview & Commerce",
    list: [
      { title: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
      { title: "Orders", path: "/dashboard/orders", icon: <MdShoppingBag /> },
      {
        title: "Products",
        path: "/dashboard/products",
        icon: <MdInventory2 />,
      },
      {
        title: "Transactions",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney />,
      },
    ],
  },
  {
    title: "Fulfillment & Analytics",
    list: [
      {
        title: "Dispatch Center",
        path: "/dashboard/dispatched-orders",
        icon: <MdLocalShipping />,
      },
      { title: "Insights", path: "/dashboard/insights", icon: <MdInsights /> },
    ],
  },
  {
    title: "Administration",
    list: [
      {
        title: "Users & Roles",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
    ],
  },
];

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSearch();
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string>("/images/noavatar.png");

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    let active = true;
    fetch(`/api/users/${encodeURIComponent(userId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.img) {
          setAvatarUrl(data.img);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#111827] border-r border-slate-800/90 flex flex-col justify-between p-4 transition-transform duration-300 z-50 w-[260px] shrink-0 overflow-y-auto sidebar ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-5 mb-4 border-b border-slate-800/80">
            <Link
              href="/dashboard"
              onClick={closeSidebar}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center p-1.5">
                <Image
                  src="/images/Logo.png"
                  alt="Furniro Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white leading-none">
                  Furniro
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 mt-1">
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={closeSidebar}
              className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close navigation menu"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6">
            {menuItems.map((category) => (
              <div key={category.title}>
                <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  {category.title}
                </span>
                <div className="space-y-0.5">
                  {category.list.map((item) => (
                    <MenuLink
                      item={item}
                      key={item.title}
                      onItemClick={closeSidebar}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Footer Card */}
        <div className="pt-4 mt-6 border-t border-slate-800/80 space-y-2">
          <Link
            href={
              session?.user?.id
                ? `/dashboard/users/${session.user.id}`
                : "/dashboard/users"
            }
            onClick={closeSidebar}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 transition-colors"
          >
            <Image
              src={avatarUrl || "/images/noavatar.png"}
              alt="User avatar"
              width={36}
              height={36}
              className="rounded-full object-cover w-9 h-9 ring-2 ring-indigo-500/30 shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-sm text-slate-100 truncate">
                {session?.user?.name || "Account"}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {isAdmin ? "Administrator" : "Editor"}
              </span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 w-full rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <MdLogout className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
