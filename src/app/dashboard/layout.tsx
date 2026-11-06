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
    <div className="flex min-h-screen w-full bg-[--bg] text-[--text]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
          {children}
        </main>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
