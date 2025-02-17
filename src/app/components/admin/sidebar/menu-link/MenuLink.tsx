"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const MenuLink = ({ item }: { item: MenuItem }) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.path}
      className={`flex items-center gap-[10px] p-[18px] hover:bg-[#2e374a] my-[5px] mx-0 rounded-[10px] ${
        pathname === item.path ? "bg-[#2e374a]" : ""
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;
