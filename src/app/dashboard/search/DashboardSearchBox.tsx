"use client";

import { useState, useEffect, useRef } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import Link from "next/link";

const dashboardRoutes = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Orders", path: "/dashboard/orders" },
  { title: "Users", path: "/dashboard/users" },
  { title: "Products", path: "/dashboard/products" },
  { title: "Transactions", path: "/dashboard/transactions" },
  { title: "Reports", path: "/dashboard/dispatched-orders" },
];

export default function DashboardSearchBox({ close }: { close?: () => void }) {
  const [query, setQuery] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState<typeof dashboardRoutes>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredRoutes([]);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredRoutes(
      dashboardRoutes.filter((r) =>
        r.title.toLowerCase().includes(lower)
      )
    );
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (close) close();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-[--bgSoft] text-[--text] w-full max-w-2xl mt-20 mx-6 sm:mx-10 rounded-lg shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-10"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
   
        <div className="flex items-center border-b border-gray-700 p-3 md:p-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dashboard..."
              className="block w-full pl-10 pr-4 py-[10px] md:py-3 border-0 focus:ring-0 text-base sm:text-[17px] md:text-lg outline-none bg-transparent text-[--text]"
              autoFocus
            />
          </div>
          <button
            onClick={handleClose}
            className="ml-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <MdClose className="h-5 md:h-6 w-5 md:w-6 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query && filteredRoutes.length === 0 ? (
            <div className="p-5 md:p-6 text-center text-gray-400">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {filteredRoutes.length > 0 && (
                <div>
                  <p className="px-5 md:px-6 py-3 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Pages
                  </p>
                  {filteredRoutes.map((r) => (
                    <Link
                      key={r.path}
                      href={r.path}
                      onClick={handleClose}
                      className="flex items-center px-5 md:px-6 py-3 md:py-4 hover:bg-gray-800 border-b border-gray-700 transition-colors text-lg"
                    >
                      {r.title}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
