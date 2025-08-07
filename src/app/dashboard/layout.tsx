import React from "react";
import Sidebar from "@/app/components/admin/sidebar/Sidebar";
import Navbar from "@/app/components/admin/navbar/Navbar";
import Footer from "@/app/components/admin/footer/Footer";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <div className="lg:w-[230px] lg:min-h-screen bg-[--bgSoft] ...">

        <Sidebar />
      </div>

      <div className="flex-1 min-w-0 p-2 sm:p-3 lg:p-5">
        <Navbar />
        <div className="overflow-x-auto">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;