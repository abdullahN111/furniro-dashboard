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

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <Link
      href={item.path}
      onClick={handleClick}
      className={`flex items-center gap-2 sm:gap-[10px] p-2 sm:p-3 lg:p-[18px] hover:bg-[#2e374a] my-1 sm:my-[5px] mx-0 rounded-[10px] text-xs sm:text-sm lg:text-base transition-colors ${
        pathname === item.path ? "bg-[#2e374a]" : ""
      }`}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span className="truncate">{item.title}</span>
    </Link>
  );
};

export default MenuLink;
