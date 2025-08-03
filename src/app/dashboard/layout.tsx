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
    <div className="flex">
      <div className="flex-1 lg+:flex-[0.8] bg-[--bgSoft] p-4 sm:p-5">
        <Sidebar />
      </div>

      <div className="flex-[4] lg+:flex-[4.2] p-4 sm:p-5">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
