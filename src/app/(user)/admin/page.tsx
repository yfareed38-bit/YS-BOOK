"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/store/DbContext";
import { 
  ShieldAlert, Users, Layers, MessageSquare, 
  TrendingUp, BarChart2, Ban, Check, X, ShieldX, Coins 
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, users, posts, reports, resolveReport, deletePost, deleteUserByAdmin } = useDb();

  const [activeSubTab, setActiveSubTab] = useState<"users" | "moderation">("users");

  if (!currentUser) return null;

  // Access Guard
  const isAdmin = currentUser.id === "user_admin";
  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border shadow-sm select-none">
        <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <h3 className="font-extrabold text-lg text-gray-950 dark:text-white mb-2">Access Denied</h3>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          You do not possess the required administrator privileges to access this system configuration panel.
        </p>
        <button 
          onClick={() => router.push("/feed")} 
          className="mt-6 bg-[#1877f2] text-white py-2 px-6 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-sm text-xs"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const handleDeletePost = (reportId: string, postId: string) => {
    deletePost(postId);
    resolveReport(reportId, 'resolved');
  };

  const handleDismissReport = (reportId: string) => {
    resolveReport(reportId, 'dismissed');
  };

  // Stats
  const activeReports = reports.filter(r => r.status === 'pending');
  const revenueEstimate = 48250;

  // Chart data
  const chartData = [
    { month: "Jan", users: 150000, revenue: 12000 },
    { month: "Feb", users: 340000, revenue: 21000 },
    { month: "Mar", users: 620000, revenue: 32000 },
    { month: "Apr", users: 890000, revenue: 41000 },
    { month: "May", users: 1050000, revenue: 48250 }
  ];

  return (
    <div className="space-y-6 text-left select-none">
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800/40 flex items-center gap-3 bg-gradient-to-r from-red-50/20 via-white to-white">
        <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white leading-tight">Admin Dashboard</h2>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider font-bold">System Console</p>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#242526] p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Users</span>
            <p className="text-xl font-black text-gray-900 dark:text-white">{users.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242526] p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Posts</span>
            <p className="text-xl font-black text-gray-900 dark:text-white">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242526] p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Reports Queue</span>
            <p className="text-xl font-black text-gray-900 dark:text-white">{activeReports.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242526] p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Monthly Revenue</span>
            <p className="text-xl font-black text-gray-900 dark:text-white">${revenueEstimate.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User growth */}
        <div className="bg-white dark:bg-[#242526] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800/40">
          <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-6 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-blue-500" />
            <span>User Acquisition</span>
          </h4>
          <div className="h-44 flex items-end gap-3 px-2">
            {chartData.map((d, i) => {
              const maxUsers = 1200000;
              const heightPct = Math.round((d.users / maxUsers) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-[#1877f2]/80 dark:bg-[#1877f2]/50 rounded-t-lg transition hover:bg-[#1877f2]"
                    style={{ height: `${heightPct}%`, minHeight: "15px" }}
                    title={`${d.users.toLocaleString()} users`}
                  />
                  <span className="text-[10px] font-bold text-gray-400">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ad Revenue */}
        <div className="bg-white dark:bg-[#242526] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800/40">
          <h4 className="font-extrabold text-sm text-gray-950 dark:text-white mb-6 flex items-center gap-1.5">
            <BarChart2 className="w-4.5 h-4.5 text-yellow-500" />
            <span>Ad Revenue ($)</span>
          </h4>
          <div className="h-44 flex items-end gap-3 px-2">
            {chartData.map((d, i) => {
              const maxRev = 60000;
              const heightPct = Math.round((d.revenue / maxRev) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-yellow-500/80 dark:bg-yellow-500/50 rounded-t-lg transition hover:bg-yellow-500"
                    style={{ height: `${heightPct}%`, minHeight: "15px" }}
                    title={`$${d.revenue.toLocaleString()}`}
                  />
                  <span className="text-[10px] font-bold text-gray-400">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAILED CONTROLS PANEL */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 overflow-hidden">
        {/* Toggle bar */}
        <div className="flex px-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/10">
          <button
            onClick={() => setActiveSubTab("users")}
            className={`py-3.5 px-5 text-xs font-bold border-b-4 transition ${
              activeSubTab === "users" 
                ? "border-[#1877f2] text-[#1877f2]" 
                : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab("moderation")}
            className={`py-3.5 px-5 text-xs font-bold border-b-4 transition flex items-center gap-1.5 ${
              activeSubTab === "moderation" 
                ? "border-red-500 text-red-500" 
                : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            Reports Queue ({activeReports.length})
          </button>
        </div>

        {/* Tab views */}
        <div className="p-4 overflow-x-auto">
          {activeSubTab === "users" && (
            <table className="w-full text-xs text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Name</th>
                  <th className="pb-3 px-2">Username</th>
                  <th className="pb-3 px-2">Email</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                {users.map((u) => {
                  const isCurrentAdmin = u.id === "user_admin";
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/20">
                      <td className="py-3 px-2 flex items-center gap-2.5">
                        <img src={u.avatar} alt="user logo" className="w-7.5 h-7.5 rounded-full object-cover border" />
                        <span className="font-extrabold text-gray-800 dark:text-gray-150">{u.name}</span>
                        {isCurrentAdmin && <span className="bg-red-50 text-red-600 border border-red-200 text-[8px] font-extrabold px-1.5 rounded">ADMIN</span>}
                      </td>
                      <td className="py-3 px-2 text-gray-500">@{u.username}</td>
                      <td className="py-3 px-2 text-gray-500">{u.email}</td>
                      <td className="py-3 px-2 text-right">
                        {!isCurrentAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you absolutely sure you want to delete and ban user ${u.name}? All posts and settings will be permanently erased.`)) {
                                deleteUserByAdmin(u.id);
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition text-[10px] font-bold ml-auto"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Ban Account</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeSubTab === "moderation" && (
            <div className="space-y-4">
              {activeReports.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8 italic">No pending moderation reports. System secure! ✅</p>
              ) : (
                activeReports.map((r) => {
                  const reporter = users.find(u => u.id === r.reporterId);
                  return (
                    <div 
                      key={r.id}
                      className="border border-red-100 rounded-xl p-4 bg-red-50/5 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="space-y-1 text-left min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[9px] bg-red-50 dark:bg-zinc-800 text-red-500 border border-red-150 px-2 py-0.5 rounded">
                            Reported {r.targetType}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            By {reporter?.name || "Anonymous"} · {new Date(r.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">
                          <strong>Reason:</strong> "{r.reason}"
                        </p>
                        {r.targetExcerpt && (
                          <p className="text-gray-400 italic text-[11px] border-l-2 pl-2 border-gray-200 mt-1 truncate">
                            Content Excerpt: "{r.targetExcerpt}"
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0 select-none">
                        <button
                          onClick={() => handleDeletePost(r.id, r.targetId)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] py-2 px-3 rounded-lg flex items-center gap-1 shadow-sm transition"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Delete Content</span>
                        </button>
                        
                        <button
                          onClick={() => handleDismissReport(r.id)}
                          className="bg-gray-150 hover:bg-gray-200 dark:bg-zinc-850 text-gray-750 dark:text-gray-300 font-bold text-[10px] py-2 px-3 rounded-lg flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
