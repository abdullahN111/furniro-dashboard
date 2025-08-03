import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/components/globals.css";
import Providers from "@/app/components/providers/Provider";
import AuthProvider from "@/app/components/providers/authProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>

        <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
