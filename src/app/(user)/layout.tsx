"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/store/DbContext";
import Navbar from "@/components/Navbar";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import FloatingChat from "@/components/FloatingChat";

export default function UserAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useDb();

  useEffect(() => {
    // If database has loaded (users array populated) but no user is set, redirect to landing
    if (currentUser === null) {
      const stored = localStorage.getItem("ysbook_db");
      if (!stored) {
        router.push("/");
      } else {
        const parsed = JSON.parse(stored);
        if (!parsed.currentUserId) {
          router.push("/");
        }
      }
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-[#18191a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#1877f2] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Checking auth session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] dark:bg-[#18191a] overflow-hidden select-none">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Core Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar navigation */}
        <SidebarLeft />
        
        {/* Scrollable Center Feed container */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-6 xl:pl-68 lg:pr-76 bg-[#f0f2f5] dark:bg-[#18191a] transition-all duration-200">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Right Sidebar online list */}
        <SidebarRight />
      </div>
      
      {/* Floating Messenger Boxes overlay */}
      <FloatingChat />
    </div>
  );
}
