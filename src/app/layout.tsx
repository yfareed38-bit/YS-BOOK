import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DbProvider } from "@/store/DbContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YS-BOOK | Connect, Share & Grow Together",
  description: "Join millions of people to connect with friends, communities, businesses and creators around the world on YS-BOOK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f0f2f5] text-[#1c1e21] dark:bg-[#18191a] dark:text-[#e4e6eb] transition-colors duration-200">
        <DbProvider>
          {children}
        </DbProvider>
      </body>
    </html>
  );
}
