"use client";

import { useState } from "react";
// import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdMenu,
  MdClose,
} from "react-icons/md";
import SearchBar from "@/app/dashboard/search/SearchBar";

const Navbar = () => {
  // const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center w-full p-3 sm:p-4 lg:p-5 rounded-lg bg-[--bgSoft]">
      <div className="text-[--textSoft] font-bold capitalize text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
        {/* {pathname.split("/").pop()?.replace(/-/g, " ")} */}
        {session?.user?.name}
      </div>
      <div className="hidden lg:flex items-center gap-[20px]">
        <SearchBar scope="global" />
        <div className="flex items-center gap-[10px]">
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
      </div>
      <div className="lg:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
          {menuOpen ? <MdClose size={20} className="sm:w-6 sm:h-6" /> : <MdMenu size={20} className="sm:w-6 sm:h-6" />}
        </button>
      </div>
      <div
        className={`absolute top-[60px] sm:top-[70px] right-0 w-[200px] sm:w-[250px] bg-[--bgSoft] p-3 sm:p-5 rounded-[10px] shadow-lg transition-all duration-300 ${menuOpen ? "opacity-100 visible z-[1000]" : "opacity-0 invisible"}`}
      >
        <div className="flex flex-col gap-3 sm:gap-[20px]">
          <SearchBar scope="global" />
          <div className="flex flex-col gap-2 sm:gap-[15px]">
            <button className="flex items-center gap-[10px] text-sm sm:text-base">
              <MdOutlineChat size={18} className="sm:w-5 sm:h-5" /> Messages
            </button>
            <button className="flex items-center gap-[10px] text-sm sm:text-base">
              <MdNotifications size={18} className="sm:w-5 sm:h-5" /> Notifications
            </button>
            <button className="flex items-center gap-[10px] text-sm sm:text-base">
              <MdPublic size={18} className="sm:w-5 sm:h-5" /> Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
