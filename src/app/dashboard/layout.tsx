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
      <div className="lg:flex-1 lg:lg+:flex-[0.8] bg-[--bgSoft] p-2 sm:p-4 lg:p-5">
        <Sidebar />
      </div>

      <div className="flex-1 lg:flex-[4] lg:lg+:flex-[4.2] p-2 sm:p-4 overflow-hidden">
        <Navbar />
        <div className="overflow-x-auto">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
