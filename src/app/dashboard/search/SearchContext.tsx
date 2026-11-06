"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SearchContextType {
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  pageSearchQuery: string;
  setPageSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [pageSearchQuery, setPageSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Clear page-level search & close mobile drawer whenever route changes
  useEffect(() => {
    setPageSearchQuery("");
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <SearchContext.Provider
      value={{
        globalSearchQuery,
        setGlobalSearchQuery,
        pageSearchQuery,
        setPageSearchQuery,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
