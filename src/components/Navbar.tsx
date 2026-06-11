"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDb } from "@/store/DbContext";
import { 
  Search, Home, Tv, Users2, Store, Bell, MessageSquare, 
  ChevronDown, LogOut, ShieldAlert, Settings, User as UserIcon, X, Sun, Moon
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, notifications, markNotificationsAsRead, users, groups, pages } = useDb();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<{ id: string; name: string; type: string; url: string }[]>([]);

  // Notification count
  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  // Handle Search input
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const suggestions: { id: string; name: string; type: string; url: string }[] = [];
      
      // Filter people
      users.filter(u => u.id !== currentUser?.id && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
        .forEach(u => suggestions.push({ id: u.id, name: u.name, type: "Person", url: `/profile/${u.username}` }));

      // Filter groups
      groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 2)
        .forEach(g => suggestions.push({ id: g.id, name: g.name, type: "Group", url: `/groups?id=${g.id}` }));

      // Filter pages
      pages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 2)
        .forEach(p => suggestions.push({ id: p.id, name: p.name, type: "Page", url: `/pages-hub?id=${p.id}` }));

      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, users, groups, pages, currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (url: string) => {
    router.push(url);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleNotifClick = () => {
    setShowNotifMenu(!showNotifMenu);
    setShowProfileMenu(false);
    if (!showNotifMenu) {
      markNotificationsAsRead();
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!currentUser) return null;

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-[#242526] h-14 border-b border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between px-4">
      {/* LEFT: BRAND AND SEARCH */}
      <div className="flex items-center gap-2 flex-1 max-w-[28%]">
        <div 
          onClick={() => router.push("/feed")}
          className="text-3xl font-black text-[#1877f2] cursor-pointer hover:scale-105 transition-transform shrink-0"
        >
          YS
        </div>
        
        {/* Search Wrapper */}
        <div className="relative hidden md:block w-full max-w-[240px]">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-3 py-1.5 w-full">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search YS-BOOK"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-800 dark:text-gray-200"
            />
          </form>

          {/* Search Suggestions Dropdown */}
          {searchSuggestions.length > 0 && (
            <div className="absolute top-11 left-0 w-80 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden py-2 z-50">
              <p className="text-[10px] font-bold text-gray-400 px-4 pb-1 uppercase tracking-wider">Search suggestions</p>
              {searchSuggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSuggestionClick(s.url)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer text-sm"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{s.name}</span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-full">{s.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: PRIMARY TABS */}
      <div className="flex items-center justify-center gap-1 sm:gap-4 md:gap-8 flex-1 max-w-[44%]">
        {[
          { icon: Home, label: "Home Feed", path: "/feed" },
          { icon: Tv, label: "Watch Platform", path: "/watch" },
          { icon: Users2, label: "Groups Circle", path: "/groups" },
          { icon: Store, label: "Marketplace", path: "/marketplace" }
        ].map((tab, idx) => {
          const isActive = pathname === tab.path || pathname?.startsWith(tab.path + "/");
          return (
            <div
              key={idx}
              onClick={() => router.push(tab.path)}
              title={tab.label}
              className={`flex-1 max-w-[80px] h-14 flex items-center justify-center border-b-4 cursor-pointer transition-all duration-200 ${
                isActive 
                  ? "border-[#1877f2] text-[#1877f2]" 
                  : "border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-6 h-6" />
            </div>
          );
        })}
      </div>

      {/* RIGHT: ACCOUNT CONTROLS */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 max-w-[28%]">
        {/* Admin Warning Badge */}
        {currentUser.id === "user_admin" && (
          <div 
            onClick={() => router.push("/admin")}
            title="Moderation Console"
            className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full hidden lg:flex items-center gap-1.5 transition text-xs font-extrabold border border-red-200"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Admin</span>
          </div>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={handleNotifClick}
            className={`p-2.5 rounded-full bg-[#f0f2f5] hover:bg-gray-200 dark:bg-[#3a3b3c] dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 transition ${
              showNotifMenu ? "bg-blue-50 text-[#1877f2]" : ""
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#242526]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifMenu && (
            <div className="absolute top-12 right-0 w-80 bg-white dark:bg-[#242526] rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
                <span className="font-extrabold text-gray-950 dark:text-white">Notifications</span>
                <button 
                  onClick={() => setShowNotifMenu(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-8">No notifications yet.</p>
                ) : (
                  notifications
                    .filter(n => n.userId === currentUser.id)
                    .map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotifMenu(false);
                          if (n.type === "message") {
                            // trigger messaging drawer, handled by floating chats
                          } else if (n.type === "friend_request" || n.type === "accept_request") {
                            router.push(`/profile/${users.find(u => u.id === n.senderId)?.username || ""}`);
                          } else {
                            router.push("/feed");
                          }
                        }}
                        className={`flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-gray-50 dark:border-zinc-800 transition ${
                          !n.read ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                        }`}
                      >
                        <img
                          src={n.senderAvatar}
                          alt={n.senderName}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="text-xs">
                          <p className="text-gray-800 dark:text-gray-200">
                            <strong className="font-bold text-gray-950 dark:text-white">{n.senderName}</strong> {n.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-1 p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
            />
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:inline" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-12 right-0 w-64 bg-white dark:bg-[#242526] rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 overflow-hidden z-50">
              <div 
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push(`/profile/${currentUser.username}`);
                }}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="text-left">
                  <h4 className="font-bold text-sm text-gray-950 dark:text-white leading-tight">{currentUser.name}</h4>
                  <span className="text-xs text-gray-400">View profile</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push(`/profile/${currentUser.username}?tab=about`);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 flex items-center gap-3 transition"
                >
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span>About & Info</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push(`/profile/${currentUser.username}?tab=settings`);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 flex items-center gap-3 transition"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Privacy Settings</span>
                </button>

                {currentUser.id === "user_admin" && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/admin");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 text-red-600 flex items-center gap-3 transition font-semibold"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span>Admin Controls</span>
                  </button>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 flex items-center gap-3 transition font-semibold"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
