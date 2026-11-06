"use client";

import { useState, useEffect, useRef } from "react";
import {
  MdSearch,
  MdClose,
  MdDashboard,
  MdShoppingBag,
  MdAttachMoney,
  MdLocalShipping,
  MdInsights,
  MdSupervisedUserCircle,
  MdPersonAdd,
  MdArrowForward,
} from "react-icons/md";
import Link from "next/link";

const dashboardRoutes = [
  {
    title: "Dashboard Overview",
    description: "KPI summary, revenue charts, and recent activity",
    path: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Orders Management",
    description: "View, filter, process, and dispatch customer orders",
    path: "/dashboard/orders",
    icon: MdShoppingBag,
  },
  {
    title: "Dispatch Center",
    description: "Track dispatched, shipped, and delivered shipments",
    path: "/dashboard/dispatched-orders",
    icon: MdLocalShipping,
  },
  {
    title: "Revenue & Insights",
    description: "30-day revenue trends and daily order breakdown",
    path: "/dashboard/insights",
    icon: MdInsights,
  },
  {
    title: "Products Catalog",
    description: "Manage furniture inventory, pricing, and stock levels",
    path: "/dashboard/products",
    icon: MdShoppingBag,
  },
  {
    title: "Transactions",
    description: "Monitor Stripe payment intents and statuses",
    path: "/dashboard/transactions",
    icon: MdAttachMoney,
  },
  {
    title: "Users & Permissions",
    description: "Manage administrator and editor accounts",
    path: "/dashboard/users",
    icon: MdSupervisedUserCircle,
  },
  {
    title: "Add New User",
    description: "Create a new admin or editor user account",
    path: "/dashboard/users/add",
    icon: MdPersonAdd,
  },
];

export default function DashboardSearchBox({ close }: { close?: () => void }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    setIsOpen(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRoutes = query.trim()
    ? dashboardRoutes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      )
    : dashboardRoutes;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (close) close();
    }, 180);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-[#111827] border border-slate-800 text-slate-100 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-800 px-4 py-3.5 bg-slate-900/50">
          <MdSearch className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any page or tool..."
            className="w-full bg-transparent border-0 focus:ring-0 text-sm sm:text-base outline-none text-slate-100 placeholder:text-slate-500"
            autoFocus
          />
          <button
            onClick={handleClose}
            className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Close search"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {filteredRoutes.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <p className="text-sm text-slate-400">
                No matching pages found for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <div>
              <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {query.trim() ? "Matching Destinations" : "Quick Navigation"}
              </p>
              <div className="space-y-1">
                {filteredRoutes.map((r) => {
                  const Icon = r.icon;
                  return (
                    <Link
                      key={r.path}
                      href={r.path}
                      onClick={handleClose}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                            {r.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {r.description}
                          </p>
                        </div>
                      </div>
                      <MdArrowForward
                        size={16}
                        className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Click any item to navigate</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
