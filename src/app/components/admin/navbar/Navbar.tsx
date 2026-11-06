"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MdPublic,
  MdMenu,
  MdSearch,
  MdPerson,
} from "react-icons/md";
import Link from "next/link";
import DashboardSearchBox from "@/app/dashboard/search/DashboardSearchBox";
import { useSearch } from "@/app/dashboard/search/SearchContext";

const getRouteMeta = (pathname: string) => {
  if (pathname === "/dashboard") {
    return {
      title: "Dashboard Overview",
      subtitle: "Real-time store metrics, fulfillment status, and activity",
    };
  }
  if (pathname.startsWith("/dashboard/orders/order/")) {
    return {
      title: "Order Details",
      subtitle: "Inspect line items, customer billing, and fulfillment state",
    };
  }
  if (pathname.startsWith("/dashboard/orders")) {
    return {
      title: "Orders Management",
      subtitle: "Track, filter, process, and dispatch customer orders",
    };
  }
  if (pathname.startsWith("/dashboard/dispatched-orders")) {
    return {
      title: "Order Dispatch Center",
      subtitle: "Monitor dispatched, in-transit, and delivered shipments",
    };
  }
  if (pathname.startsWith("/dashboard/insights")) {
    return {
      title: "Revenue & Insights",
      subtitle: "30-day revenue performance and daily order breakdown",
    };
  }
  if (pathname.startsWith("/dashboard/products/product/")) {
    return {
      title: "Product Details",
      subtitle: "Inspect catalog specifications and adjust inventory levels",
    };
  }
  if (pathname.startsWith("/dashboard/products")) {
    return {
      title: "Products Catalog",
      subtitle: "Manage store inventory, pricing, discounts, and stock",
    };
  }
  if (pathname.startsWith("/dashboard/transactions")) {
    return {
      title: "Stripe Transactions",
      subtitle: "Live payment intents and settlement records",
    };
  }
  if (pathname.startsWith("/dashboard/users/add")) {
    return {
      title: "Create User Account",
      subtitle: "Provision a new administrator or editor profile",
    };
  }
  if (pathname.startsWith("/dashboard/users/")) {
    return {
      title: "User Profile & Security",
      subtitle: "Manage account details, role permissions, and password",
    };
  }
  if (pathname.startsWith("/dashboard/users")) {
    return {
      title: "Users & Roles",
      subtitle: "Manage team access and administrative permissions",
    };
  }
  return {
    title: "Furniro Admin",
    subtitle: "Operations & Commerce Management",
  };
};

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { setIsSidebarOpen } = useSearch();
  const [openSearch, setOpenSearch] = useState(false);

  const { title, subtitle } = getRouteMeta(pathname);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b0f19]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <MdMenu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">
              {title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-400 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs sm:text-sm transition-all"
            title="Quick Jump (Ctrl+K)"
          >
            <MdSearch size={18} className="text-indigo-400" />
            <span className="hidden md:inline">Quick Jump...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              Ctrl K
            </kbd>
          </button>

          <Link
            href="https://furniro-abd.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
            title="Open live storefront"
          >
            <MdPublic size={17} className="text-emerald-400" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>

          {session?.user?.id && (
            <Link
              href={`/dashboard/users/${session.user.id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-xs sm:text-sm font-medium transition-colors"
              title="View your profile"
            >
              <MdPerson size={17} />
              <span className="hidden sm:inline capitalize max-w-[110px] truncate">
                {session.user.name?.split(" ")[0] || "Profile"}
              </span>
            </Link>
          )}
        </div>
      </div>

      {openSearch && (
        <DashboardSearchBox close={() => setOpenSearch(false)} />
      )}
    </header>
  );
};

export default Navbar;
