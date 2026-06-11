"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDb } from "@/store/DbContext";
import PostCard from "@/components/PostCard";
import { Users, Search, Globe, Award, Calendar, ChevronRight } from "lucide-react";

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { users, groups, pages, posts } = useDb();

  // Filter People
  const matchedUsers = users.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  // Filter Groups
  const matchedGroups = groups.filter(g => 
    g.name.toLowerCase().includes(query.toLowerCase()) || 
    g.description.toLowerCase().includes(query.toLowerCase())
  );

  // Filter Pages
  const matchedPages = pages.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.bio.toLowerCase().includes(query.toLowerCase())
  );

  // Filter Posts
  const matchedPosts = posts.filter(post => 
    post.content.toLowerCase().includes(query.toLowerCase()) && 
    (post.visibility === 'public')
  );

  const totalResults = matchedUsers.length + matchedGroups.length + matchedPages.length + matchedPosts.length;

  return (
    <div className="space-y-6 text-left select-none">
      {/* Search Header */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-950 dark:text-white leading-tight">
            Search Results
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-semibold">
            {totalResults} results found for "{query}"
          </p>
        </div>
      </div>

      {totalResults === 0 ? (
        <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border shadow-sm">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="font-extrabold text-gray-950 dark:text-white mb-2">No Results Found</h4>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            We couldn't find any people, groups, pages, or posts matching your query. Double-check spelling or try other keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PEOPLE SECTION */}
          {matchedUsers.length > 0 && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-150/45 dark:border-zinc-800 text-left space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b pb-2">
                People
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {matchedUsers.map(u => (
                  <div
                    key={u.id}
                    onClick={() => router.push(`/profile/${u.username}`)}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border shrink-0"
                      />
                      <div className="min-w-0 text-left">
                        <h4 className="font-bold text-xs text-gray-950 dark:text-white leading-tight truncate">
                          {u.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 truncate">@{u.username} · {u.location}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-450 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GROUPS SECTION */}
          {matchedGroups.length > 0 && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-150/45 dark:border-zinc-800 text-left space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b pb-2">
                Groups
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {matchedGroups.map(g => (
                  <div
                    key={g.id}
                    onClick={() => router.push(`/groups?id=${g.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={g.coverPhoto}
                        alt={g.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 text-left">
                        <h4 className="font-bold text-xs text-gray-950 dark:text-white leading-tight truncate">
                          {g.name}
                        </h4>
                        <p className="text-[10px] text-gray-450 truncate flex items-center gap-1">
                          <Globe className="w-3 h-3 text-gray-450" />
                          <span>{g.privacy === 'public' ? 'Public' : 'Private'} Group · {g.members.length} members</span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-450 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGES SECTION */}
          {matchedPages.length > 0 && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-150/45 dark:border-zinc-800 text-left space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b pb-2">
                Pages
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {matchedPages.map(p => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/pages-hub?id=${p.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover border shrink-0"
                      />
                      <div className="min-w-0 text-left">
                        <h4 className="font-bold text-xs text-gray-950 dark:text-white leading-tight truncate flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="bg-[#1877f2] text-white px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0">Page</span>
                        </h4>
                        <p className="text-[10px] text-gray-405 truncate">{p.category} · {p.followers.length} followers</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-450 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POSTS SECTION */}
          {matchedPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-left pl-2">
                Posts matching "{query}"
              </h3>
              {matchedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
