"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDb } from "@/store/DbContext";
import { 
  Home, Tv, Users2, Store, Calendar, Award, 
  ShieldAlert, Settings, User as UserIcon, BookOpen
} from "lucide-react";

export default function SidebarLeft() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, groups, pages } = useDb();

  if (!currentUser) return null;

  // Filter groups current user is a member of
  const myGroups = groups.filter(g => g.members.includes(currentUser.id));
  
  // Filter pages current user follows or administers
  const myPages = pages.filter(p => p.adminId === currentUser.id || p.followers.includes(currentUser.id));

  const navItems = [
    { icon: Home, label: "News Feed", path: "/feed" },
    { icon: Tv, label: "Watch Videos", path: "/watch" },
    { icon: Users2, label: "Groups Circle", path: "/groups" },
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: Calendar, label: "Events Planner", path: "/events" },
    { icon: Award, label: "Pages Hub", path: "/pages-hub" }
  ];

  return (
    <aside className="w-64 fixed left-0 top-14 bottom-0 bg-transparent overflow-y-auto hidden xl:block p-3 select-none border-r border-gray-100 dark:border-zinc-800/20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
      {/* Profile shortcut */}
      <div 
        onClick={() => router.push(`/profile/${currentUser.username}`)}
        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/60 dark:hover:bg-zinc-800 cursor-pointer transition mb-3"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full object-cover border border-white dark:border-zinc-700"
        />
        <span className="font-extrabold text-sm text-gray-950 dark:text-white truncate">
          {currentUser.name}
        </span>
      </div>

      {/* Main navigation shortcuts */}
      <div className="space-y-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
          return (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3.5 p-2.5 rounded-xl cursor-pointer transition ${
                isActive 
                  ? "bg-blue-50 dark:bg-blue-950/20 text-[#1877f2] font-bold" 
                  : "hover:bg-gray-200/60 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1877f2]" : "text-gray-500"}`} />
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
          );
        })}

        {currentUser.id === "user_admin" && (
          <div
            onClick={() => router.push("/admin")}
            className={`flex items-center gap-3.5 p-2.5 rounded-xl cursor-pointer transition ${
              pathname === "/admin" 
                ? "bg-red-50 dark:bg-red-950/20 text-red-600 font-bold" 
                : "hover:bg-red-50/50 dark:hover:bg-red-950/10 text-red-500 font-semibold"
            }`}
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-sm">Admin Moderation</span>
          </div>
        )}
      </div>

      <hr className="my-4 border-gray-200 dark:border-zinc-800" />

      {/* Your Shortcuts (Groups/Pages) */}
      <div className="space-y-4">
        <div>
          <h4 className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            Your Groups
          </h4>
          {myGroups.length === 0 ? (
            <p className="px-3 text-[11px] text-gray-400 italic">No groups joined yet.</p>
          ) : (
            <div className="space-y-1">
              {myGroups.slice(0, 5).map(g => (
                <div
                  key={g.id}
                  onClick={() => router.push(`/groups?id=${g.id}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 dark:hover:bg-zinc-800 cursor-pointer transition"
                >
                  <img
                    src={g.coverPhoto}
                    alt={g.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                  />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{g.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            Your Pages
          </h4>
          {myPages.length === 0 ? (
            <p className="px-3 text-[11px] text-gray-400 italic">No pages followed yet.</p>
          ) : (
            <div className="space-y-1">
              {myPages.slice(0, 5).map(p => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/pages-hub?id=${p.id}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 dark:hover:bg-zinc-800 cursor-pointer transition"
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                  />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-8 px-3 text-[10px] text-gray-400 dark:text-gray-500 space-y-1">
        <p className="flex flex-wrap gap-x-2">
          <a href="#" className="hover:underline">Privacy</a> · 
          <a href="#" className="hover:underline">Terms</a> · 
          <a href="#" className="hover:underline">Advertising</a> · 
          <a href="#" className="hover:underline">Cookies</a>
        </p>
        <p>YS-BOOK © 2026</p>
      </div>
    </aside>
  );
}
