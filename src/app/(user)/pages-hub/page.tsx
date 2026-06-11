"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDb } from "@/store/DbContext";
import PostCard from "@/components/PostCard";
import { 
  Award, Plus, Globe, Megaphone, BarChart3, Users, 
  X, Check, Flame, LayoutDashboard, Compass, Send 
} from "lucide-react";

export default function PagesHubPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("id");
  const { currentUser, pages, followPage, promotePage, createPage, createPost, posts, saveDb } = useDb();

  const [activeTab, setActiveTab] = useState<"home" | "insights">("home");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  // Create page form states
  const [pageName, setPageName] = useState("");
  const [pageBio, setPageBio] = useState("");
  const [pageCategory, setPageCategory] = useState("Local Business");
  const [pageAvatar, setPageAvatar] = useState("");
  const [pageCover, setPageCover] = useState("");

  // Boost promotion states
  const [promoBudget, setPromoBudget] = useState(25);
  const [promoDuration, setPromoDuration] = useState(3);

  // Page Post content
  const [postContent, setPostContent] = useState("");
  const [postMedia, setPostMedia] = useState("");

  if (!currentUser) return null;

  // Selected Page details
  const selectedPage = pages.find(p => p.id === pageId);
  const isFollower = selectedPage?.followers.includes(currentUser.id);
  const isPageAdmin = selectedPage?.adminId === currentUser.id;

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageName.trim()) return;
    const newPageId = createPage(
      pageName.trim(), 
      pageBio.trim(), 
      pageCategory, 
      pageAvatar.trim() ? pageAvatar.trim() : undefined,
      pageCover.trim() ? pageCover.trim() : undefined
    );
    setPageName("");
    setPageBio("");
    setPageCategory("Local Business");
    setPageAvatar("");
    setPageCover("");
    setShowCreateModal(false);
    router.push(`/pages-hub?id=${newPageId}`);
  };

  const handlePromotePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageId) return;
    promotePage(pageId, Number(promoBudget), Number(promoDuration));
    setShowPromoteModal(false);
  };

  const handleCreatePagePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !selectedPage) return;

    // Create post using page avatar and name as author
    const pagePost = {
      id: `post_${Date.now()}`,
      userId: selectedPage.id, // Treat Page ID as Author ID
      userName: selectedPage.name,
      userAvatar: selectedPage.avatar,
      content: postContent.trim(),
      mediaUrl: postMedia.trim() ? postMedia.trim() : undefined,
      mediaType: postMedia.trim() ? ('image' as const) : ('none' as const),
      reactions: {},
      comments: [],
      timestamp: new Date().toISOString(),
      visibility: 'public' as const
    };

    // Add to main feed posts list
    const updatedPosts = [pagePost, ...posts];
    saveDb({ posts: updatedPosts });

    // Force re-render
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }

    setPostContent("");
    setPostMedia("");
    setShowPostModal(false);
  };

  // Group pages by context
  const myPages = pages.filter(p => p.adminId === currentUser.id);
  const followedPages = pages.filter(p => p.adminId !== currentUser.id && p.followers.includes(currentUser.id));
  const suggestedPages = pages.filter(p => !p.followers.includes(currentUser.id) && p.adminId !== currentUser.id);

  // Filter main posts belonging to this Page
  const pagePosts = posts.filter(p => p.userId === selectedPage?.id);

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left select-none">
      {/* LEFT PANEL: PAGES SHORTCUTS */}
      <div className="lg:col-span-4 bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-base text-gray-950 dark:text-white flex items-center gap-1.5">
            <Award className="w-5 h-5 text-[#1877f2]" />
            <span>Pages Hub</span>
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-zinc-800 text-[#1877f2] rounded-full transition"
            title="Create Page"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Managed Pages */}
        <div>
          <h4 className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Pages You Manage ({myPages.length})
          </h4>
          {myPages.length === 0 ? (
            <p className="px-1 text-xs text-gray-400 italic">No managed pages.</p>
          ) : (
            <div className="space-y-1">
              {myPages.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    router.push(`/pages-hub?id=${p.id}`);
                    setActiveTab("home");
                  }}
                  className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition ${
                    pageId === p.id ? "bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-[#1877f2] pl-1" : ""
                  }`}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-250 truncate">{p.name}</p>
                    <span className="text-[9px] text-gray-400 block">{p.followers.length} followers</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Followed Pages */}
        <div>
          <h4 className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Followed Pages ({followedPages.length})
          </h4>
          {followedPages.length === 0 ? (
            <p className="px-1 text-xs text-gray-400 italic">No pages followed yet.</p>
          ) : (
            <div className="space-y-1">
              {followedPages.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    router.push(`/pages-hub?id=${p.id}`);
                    setActiveTab("home");
                  }}
                  className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition ${
                    pageId === p.id ? "bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-[#1877f2] pl-1" : ""
                  }`}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-250 truncate">{p.name}</p>
                    <span className="text-[9px] text-gray-400 block">{p.followers.length} followers</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Pages */}
        <div>
          <h4 className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Suggested for You
          </h4>
          {suggestedPages.length === 0 ? (
            <p className="px-1 text-xs text-gray-400 italic">No suggestions available.</p>
          ) : (
            <div className="space-y-3">
              {suggestedPages.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl border border-gray-150/40 dark:border-zinc-800"
                >
                  <div 
                    onClick={() => router.push(`/pages-hub?id=${p.id}`)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-850 dark:text-gray-250 truncate">{p.name}</p>
                      <span className="text-[9px] text-gray-400 block">{p.followers.length} followers</span>
                    </div>
                  </div>
                  <button
                    onClick={() => followPage(p.id)}
                    className="text-[10px] font-bold text-[#1877f2] bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 py-1.5 px-3 rounded-lg transition shrink-0 font-bold"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: SELECTED PAGE DETAIL */}
      <div className="lg:col-span-8">
        {selectedPage ? (
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 overflow-hidden">
            {/* Cover photo */}
            <div className="h-44 sm:h-56 relative bg-gray-100 dark:bg-zinc-800">
              <img
                src={selectedPage.coverPhoto}
                alt="page cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Overlay details */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 text-white">
                <img
                  src={selectedPage.avatar}
                  alt={selectedPage.name}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-white object-cover shrink-0 shadow-lg"
                />
                <div className="text-left min-w-0 mb-1">
                  <h2 className="text-lg sm:text-2xl font-black truncate leading-tight">{selectedPage.name}</h2>
                  <p className="text-[9px] sm:text-xs text-blue-100 flex items-center gap-1.5 mt-1 font-semibold">
                    <span className="bg-[#1877f2] text-white px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide">✓ Verified Page</span>
                    <span>{selectedPage.category}</span> · 
                    <span>{selectedPage.followers.length} followers</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Actions & Bio Bar */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <p className="text-xs text-gray-500 max-w-md italic">{selectedPage.bio}</p>
              <div className="flex gap-2 shrink-0 select-none">
                {isPageAdmin ? (
                  <button
                    onClick={() => setShowPromoteModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Megaphone className="w-4 h-4 shrink-0" />
                    <span>Boost Page</span>
                  </button>
                ) : (
                  <button
                    onClick={() => followPage(selectedPage.id)}
                    className={`font-bold text-xs py-2 px-4 rounded-xl transition shadow-sm ${
                      isFollower
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white"
                        : "bg-[#1877f2] hover:bg-[#166fe5] text-white"
                    }`}
                  >
                    {isFollower ? "Following" : "Follow Page"}
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 border-b border-gray-100 dark:border-zinc-800 select-none">
              <button
                onClick={() => setActiveTab("home")}
                className={`py-3 px-5 text-xs font-bold border-b-4 transition ${
                  activeTab === "home" 
                    ? "border-[#1877f2] text-[#1877f2]" 
                    : "border-transparent text-gray-500 hover:bg-gray-50"
                }`}
              >
                Home Feed
              </button>
              {isPageAdmin && (
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`py-3 px-5 text-xs font-bold border-b-4 transition flex items-center gap-1.5 ${
                    activeTab === "insights" 
                      ? "border-[#1877f2] text-[#1877f2]" 
                      : "border-transparent text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Insights Dashboard</span>
                </button>
              )}
            </div>

            {/* Tab content */}
            <div className="p-4">
              {activeTab === "home" && (
                <div className="space-y-4">
                  {/* Create Page Post (Only for Admin of this page!) */}
                  {isPageAdmin && (
                    <div className="flex gap-3 bg-gray-50/50 dark:bg-zinc-800/20 p-3.5 rounded-xl border">
                      <img src={selectedPage.avatar} className="w-8 h-8 rounded-full object-cover border" />
                      <button
                        onClick={() => setShowPostModal(true)}
                        className="flex-1 bg-white dark:bg-zinc-800 text-left text-xs px-4 py-2 text-gray-400 rounded-full border border-gray-200 outline-none"
                      >
                        Publish an update as {selectedPage.name}...
                      </button>
                    </div>
                  )}

                  {/* Feed */}
                  <div className="space-y-4">
                    {pagePosts.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-12 italic">No posts published by this page yet.</p>
                    ) : (
                      pagePosts.map(post => (
                        <PostCard key={post.id} post={post} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "insights" && isPageAdmin && (
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center bg-blue-50/30 p-4 rounded-xl border">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-950 dark:text-white flex items-center gap-1.5">
                        <LayoutDashboard className="w-4.5 h-4.5 text-[#1877f2]" />
                        <span>Performance Summary</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Live organic and sponsored tracking metrics.</p>
                    </div>
                  </div>

                  {/* Metrics Cards Grid */}
                  <div className="grid grid-cols-3 gap-4 text-center select-none">
                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 p-4 rounded-xl border">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Page Views</span>
                      <p className="text-2xl font-black text-gray-950 dark:text-white">{selectedPage.views}</p>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 p-4 rounded-xl border">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Weekly Reach</span>
                      <p className="text-2xl font-black text-gray-950 dark:text-white">{selectedPage.reach}</p>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 p-4 rounded-xl border">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Engagement</span>
                      <p className="text-2xl font-black text-gray-950 dark:text-white">{selectedPage.engagement}</p>
                    </div>
                  </div>

                  {/* Promotions List */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                      Active & Past Promotions ({selectedPage.promotions.length})
                    </h4>
                    {selectedPage.promotions.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No boosted promotion campaigns.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedPage.promotions.map(promo => (
                          <div
                            key={promo.id}
                            className="flex justify-between items-center p-3.5 rounded-xl border bg-gray-50/20"
                          >
                            <div>
                              <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                <span>Boost Campaign</span>
                                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                  promo.status === 'active' 
                                    ? "bg-green-50 text-green-600 border border-green-200" 
                                    : "bg-gray-100 text-gray-400"
                                }`}>
                                  {promo.status}
                                </span>
                              </h5>
                              <p className="text-[10px] text-gray-450 mt-1">
                                Budget: ${promo.budget} · Duration: {promo.duration} days
                              </p>
                            </div>
                            <span className="text-xs font-black text-orange-500">
                              +{promo.reachEstimate} estimated reach
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-16 text-center border shadow-sm">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h4 className="font-extrabold text-gray-950 dark:text-white mb-2">Welcome to YS-BOOK Pages</h4>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Select or inspect managed and followed pages from the left dashboard, or configure your new business/creator page!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 bg-[#1877f2] text-white py-2.5 px-6 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs flex items-center gap-1.5 mx-auto"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Create New Page</span>
            </button>
          </div>
        )}
      </div>

      {/* CREATE PAGE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Create Business/Creator Page</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePage} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Page Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions, Jane Vlogs"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Category</label>
                <select
                  value={pageCategory}
                  onChange={(e) => setPageCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] cursor-pointer"
                >
                  <option value="Local Business">Local Business / Company</option>
                  <option value="Content Creator">Content Creator / Artist</option>
                  <option value="Educational Group">Educational Group</option>
                  <option value="E-Commerce">E-Commerce Brand</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Bio / Slogan</label>
                <textarea
                  placeholder="Tell your followers what your page does..."
                  rows={2}
                  value={pageBio}
                  onChange={(e) => setPageBio(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Logo Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={pageAvatar}
                    onChange={(e) => setPageAvatar(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Cover Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={pageCover}
                    onChange={(e) => setPageCover(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs font-bold"
              >
                Create Page
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOOST PROMOTE MODAL */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white flex items-center gap-1">
                <Megaphone className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Boost Campaigns</span>
              </h3>
              <button
                onClick={() => setShowPromoteModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePromotePageSubmit} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Budget Amount ($)</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  required
                  value={promoBudget}
                  onChange={(e) => setPromoBudget(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={promoDuration}
                  onChange={(e) => setPromoDuration(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div className="bg-orange-50/55 dark:bg-zinc-850 p-3 rounded-xl border border-orange-100 flex items-center justify-between text-xs text-orange-600 font-bold">
                <span>Estimated Boost Reach</span>
                <span className="text-sm font-black">+{promoBudget * 30} accounts</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs font-bold"
              >
                Boost Page Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PAGE POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Publish Page Update</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-gray-650"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePagePost} className="p-5 space-y-4 text-left">
              <div>
                <textarea
                  required
                  placeholder="Compose post description..."
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Image attachment URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={postMedia}
                  onChange={(e) => setPostMedia(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs font-bold"
              >
                Publish as Page
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
