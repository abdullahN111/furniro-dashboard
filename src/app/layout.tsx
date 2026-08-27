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
  title: "Dashboard",
  description: "A dashboard for your company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <AuthProvider>
          <Providers>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast:
                    "bg-[#2e374a] text-[var(--text)] border border-[#2e374a] shadow-lg",
                },
              }}
            />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
