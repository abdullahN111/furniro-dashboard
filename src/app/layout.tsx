import type { Metadata } from "next";
import "@/app/components/globals.css";
import Providers from "@/app/components/providers/Provider";
import AuthProvider from "@/app/components/providers/authProvider";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Furniro Admin — Operations & Commerce Dashboard",
  description: "Enterprise operations, inventory, order fulfillment, and analytics console for Furniro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${montserrat.className} antialiased bg-[--bg] text-[--text] selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <AuthProvider>
          <Providers>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              theme="dark"
              toastOptions={{
                classNames: {
                  toast:
                    "bg-[#111827] text-[#f8fafc] border border-slate-800 shadow-2xl rounded-xl",
                },
              }}
            />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
