"use client";

import { MdSearch, MdClose } from "react-icons/md";
import { useSearch } from "./SearchContext";

interface LocalSearchBarProps {
  scope?: "global" | "page";
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

const LocalSearchBar = ({
  scope = "global",
  value,
  onChange,
  placeholder = "Search records...",
}: LocalSearchBarProps) => {
  const {
    globalSearchQuery,
    setGlobalSearchQuery,
    pageSearchQuery,
    setPageSearchQuery,
  } = useSearch();

  const isGlobal = scope === "global";
  const currentValue =
    value !== undefined
      ? value
      : isGlobal
        ? globalSearchQuery
        : pageSearchQuery;

  const handleChange = (nextValue: string) => {
    if (onChange) {
      onChange(nextValue);
    } else if (isGlobal) {
      setGlobalSearchQuery(nextValue);
    } else {
      setPageSearchQuery(nextValue);
    }
  };

  return (
    <div className="relative flex-1 min-w-[200px] max-w-md flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 px-3.5 py-2 rounded-xl transition-all">
      <MdSearch size={18} className="text-slate-400 shrink-0 mr-2.5" />
      <input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent border-none outline-none text-sm text-slate-100 placeholder:text-slate-500 w-full min-w-0"
      />
      {currentValue && (
        <button
          type="button"
          onClick={() => handleChange("")}
          className="ml-1.5 text-slate-400 hover:text-slate-200 p-0.5 rounded-md transition-colors"
          aria-label="Clear search"
        >
          <MdClose size={15} />
        </button>
      )}
    </div>
  );
};

export default LocalSearchBar;
