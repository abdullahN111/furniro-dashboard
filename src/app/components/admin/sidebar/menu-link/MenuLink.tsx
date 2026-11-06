"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const MenuLink = ({
  item,
  onItemClick,
}: {
  item: MenuItem;
  onItemClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive =
    item.path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.path || pathname.startsWith(`${item.path}/`);

  return (
    <Link
      href={item.path}
      onClick={onItemClick}
      className={`group relative flex items-center gap-3 px-3.5 py-2.5 my-1 rounded-xl text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
      )}
      <span
        className={`flex-shrink-0 text-lg transition-colors ${
          isActive
            ? "text-indigo-400"
            : "text-slate-400 group-hover:text-slate-200"
        }`}
      >
        {item.icon}
      </span>
      <span className="truncate">{item.title}</span>
    </Link>
  );
};

export default MenuLink;
