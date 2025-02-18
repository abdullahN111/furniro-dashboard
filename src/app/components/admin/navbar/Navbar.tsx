"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
  MdMenu,
  MdClose,
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center w-full p-4 sm:p-5 rounded-lg bg-[--bgSoft]">
      <div className="text-[--textSoft] font-bold capitalize">
        {pathname.split("/").pop()}
      </div>
      <div className="hidden lg:flex items-center gap-[20px]">
        <div className="flex items-center gap-[10px] bg-[#2e374a] p-[10px] rounded-[10px]">
          <MdSearch size={20} />
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent border-none outline-none text-[--text]"
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
      </div>
      <div className="lg:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>
      <div
        className={`absolute top-[70px] right-0 w-[250px] bg-[--bgSoft] p-5 rounded-[10px] shadow-lg transition-all duration-300 ${menuOpen ? "opacity-100 visible z-[1000]" : "opacity-0 invisible"}`}
      >
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[10px] bg-[#2e374a] p-[10px] rounded-[10px]">
            <MdSearch size={20} />
            <input
              type="text"
              placeholder="Search.."
              className="bg-transparent border-none outline-none text-[--text]"
            />
          </div>
          <div className="flex flex-col gap-[15px]">
            <button className="flex items-center gap-[10px]">
              <MdOutlineChat size={20} /> Messages
            </button>
            <button className="flex items-center gap-[10px]">
              <MdNotifications size={20} /> Notifications
            </button>
            <button className="flex items-center gap-[10px]">
              <MdPublic size={20} /> Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;


