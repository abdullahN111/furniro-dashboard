"use client";
import { SearchProvider } from "@/app/dashboard/search/SearchContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SearchProvider>{children}</SearchProvider>;
};

export default Providers;
