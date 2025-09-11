import type { Metadata } from "next";
import "@/app/components/globals.css";
import Providers from "@/app/components/providers/Provider";
import AuthProvider from "@/app/components/providers/authProvider";
import {Montserrat} from "next/font/google"


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
      <body
        className={`${montserrat.className} antialiased`}
      >
        <AuthProvider>

        <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
