"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDb } from "@/store/DbContext";
import PostCard from "@/components/PostCard";
import CreatePostCard from "@/components/CreatePostCard";
import { 
  Camera, Briefcase, GraduationCap, MapPin, Globe, 
  Heart, MessageSquare, Plus, Check, UserMinus, UserCheck, 
  Settings as SettingsIcon, Edit3, X, UserX, Key
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    currentUser, users, posts, updateProfile, sendFriendRequest, 
    acceptFriendRequest, rejectFriendRequest, removeFriend, createChat, openChat 
  } = useDb();

  const usernameParam = params.username as string;
  const tabParam = searchParams.get("tab") || "posts";

  // Find user by username
  const profileUser = users.find(u => u.username.toLowerCase() === usernameParam.toLowerCase());

  // Edit details states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    work: "",
    education: "",
    location: "",
    website: "",
    interests: ""
  });

  useEffect(() => {
    if (profileUser) {
      setEditData({
        name: profileUser.name,
        bio: profileUser.bio,
        work: profileUser.work,
        education: profileUser.education,
        location: profileUser.location,
        website: profileUser.website,
        interests: profileUser.interests.join(", ")
      });
    }
  }, [profileUser]);

  if (!profileUser) {
    return (
      <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border shadow-sm">
        <UserX className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h4 className="font-extrabold text-gray-950 dark:text-white mb-2">User Not Found</h4>
        <p className="text-sm text-gray-400">The profile you are trying to view does not exist on YS-BOOK.</p>
        <button 
          onClick={() => router.push("/feed")} 
          className="mt-6 bg-[#1877f2] text-white py-2 px-6 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-sm text-xs"
        >
          Go to Feed
        </button>
      </div>
    );
  }

  const isMe = currentUser?.id === profileUser.id;

  // Filter posts created by this user
  const userPosts = posts.filter(p => p.userId === profileUser.id);

  // Friend status logic
  const isFriend = currentUser?.friends.includes(profileUser.id);
  const sentReq = currentUser?.sentRequests.includes(profileUser.id);
  const recvReq = currentUser?.pendingRequests.includes(profileUser.id);

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editData.name,
      bio: editData.bio,
      work: editData.work,
      education: editData.education,
      location: editData.location,
      website: editData.website,
      interests: editData.interests.split(",").map(i => i.trim()).filter(i => i !== "")
    });
    setShowEditModal(false);
  };

  const handleEditPhoto = (type: 'avatar' | 'cover') => {
    const promptMsg = type === 'avatar' ? 'Enter new profile photo URL:' : 'Enter new cover photo URL:';
    const currentUrl = type === 'avatar' ? profileUser.avatar : profileUser.coverPhoto;
    const url = prompt(promptMsg, currentUrl);
    if (url && url.trim()) {
      updateProfile({ [type === 'avatar' ? 'avatar' : 'coverPhoto']: url.trim() });
    }
  };

  const handleMessageClick = () => {
    const chatId = createChat([profileUser.id]);
    openChat(chatId);
  };

  const setTab = (tab: string) => {
    router.push(`/profile/${profileUser.username}?tab=${tab}`);
  };

  return (
    <div className="space-y-6">
      {/* PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-[#242526] rounded-t-3xl rounded-b-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 overflow-hidden relative">
        {/* Cover image container */}
        <div className="h-48 sm:h-64 relative bg-gray-100 dark:bg-zinc-800">
          <img 
            src={profileUser.coverPhoto} 
            alt="profile cover" 
            className="w-full h-full object-cover"
          />
          {isMe && (
            <button 
              onClick={() => handleEditPhoto('cover')}
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-gray-800 dark:text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 flex items-center gap-1.5 transition select-none cursor-pointer"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Edit Cover Photo</span>
            </button>
          )}
        </div>

        {/* Profile details container */}
        <div className="px-6 pb-6 pt-16 sm:pt-4 relative flex flex-col sm:flex-row items-center sm:items-end sm:justify-between gap-6 border-b border-gray-100 dark:border-zinc-800">
          {/* Avatar frame */}
          <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 shrink-0 relative group">
            <img 
              src={profileUser.avatar} 
              alt={profileUser.name} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-[#242526] object-cover shadow-lg"
            />
            {isMe && (
              <button 
                onClick={() => handleEditPhoto('avatar')}
                className="absolute bottom-1 right-1 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white p-2 rounded-full shadow-md border border-white dark:border-[#242526] hover:bg-white transition"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User info */}
          <div className="sm:ml-44 text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              {profileUser.name}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-0.5">@{profileUser.username}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed max-w-lg">
              {profileUser.bio}
            </p>
          </div>

          {/* User Actions */}
          <div className="flex gap-2.5 shrink-0 select-none">
            {isMe ? (
              <button 
                onClick={() => setShowEditModal(true)}
                className="bg-gray-100 hover:bg-gray-250/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                {/* Friend Management Buttons */}
                {isFriend ? (
                  <button 
                    onClick={() => removeFriend(profileUser.id)}
                    className="bg-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 text-gray-800 dark:text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <UserCheck className="w-4 h-4 text-green-500" />
                    <span>Friends</span>
                  </button>
                ) : sentReq ? (
                  <button 
                    disabled
                    className="bg-blue-50 text-blue-500 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Request Sent</span>
                  </button>
                ) : recvReq ? (
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => acceptFriendRequest(profileUser.id)}
                      className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    <button 
                      onClick={() => rejectFriendRequest(profileUser.id)}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-gray-850 dark:text-gray-200 font-bold text-xs py-2.5 px-4 rounded-xl transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => sendFriendRequest(profileUser.id)}
                    className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Friend</span>
                  </button>
                )}

                {/* Message button */}
                <button 
                  onClick={handleMessageClick}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-850 dark:text-gray-200 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* PROFILE NAVIGATION TABS */}
        <div className="flex px-4 select-none bg-gray-50/50 dark:bg-zinc-900/10">
          {[
            { id: "posts", label: "Posts" },
            { id: "about", label: "About" },
            { id: "friends", label: "Friends" },
            { id: "settings", label: "Settings" }
          ].map((tab) => {
            const isActive = tabParam === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`py-3.5 px-5 text-xs font-bold border-b-4 transition ${
                  isActive 
                    ? "border-[#1877f2] text-[#1877f2]" 
                    : "border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* PROFILE BODY TABS ROUTER */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ABOUT SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 text-left">
            <h3 className="font-extrabold text-base text-gray-950 dark:text-white mb-4">Intro</h3>
            
            <div className="space-y-3.5 text-xs text-gray-600 dark:text-gray-300">
              {profileUser.work && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                  <span>Works as <strong className="font-bold text-gray-800 dark:text-gray-150">{profileUser.work}</strong></span>
                </div>
              )}
              {profileUser.education && (
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                  <span>Studied at <strong className="font-bold text-gray-800 dark:text-gray-150">{profileUser.education}</strong></span>
                </div>
              )}
              {profileUser.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                  <span>Lives in <strong className="font-bold text-gray-800 dark:text-gray-150">{profileUser.location}</strong></span>
                </div>
              )}
              {profileUser.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                  <a 
                    href={profileUser.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#1877f2] font-semibold hover:underline truncate"
                  >
                    {profileUser.website}
                  </a>
                </div>
              )}
            </div>

            {profileUser.interests.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Interests
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profileUser.interests.map((interest, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-100 dark:bg-zinc-800 text-gray-750 dark:text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN TABS DISPLAY */}
        <div className="lg:col-span-7">
          {tabParam === "posts" && (
            <div className="space-y-4">
              {isMe && <CreatePostCard />}
              
              <div className="space-y-4">
                {userPosts.length === 0 ? (
                  <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border shadow-sm">
                    <p className="text-sm text-gray-500 font-semibold">No posts published yet.</p>
                  </div>
                ) : (
                  userPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </div>
          )}

          {tabParam === "about" && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/40 text-left space-y-6">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white border-b pb-2">About Details</h3>
              <div className="grid sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Work</h4>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800/20 p-3 rounded-xl">
                    {profileUser.work || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Education</h4>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800/20 p-3 rounded-xl">
                    {profileUser.education || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Current City</h4>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800/20 p-3 rounded-xl">
                    {profileUser.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Website</h4>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800/20 p-3 rounded-xl truncate">
                    {profileUser.website || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {tabParam === "friends" && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/40 text-left space-y-6">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white border-b pb-2">
                Friends Directory ({profileUser.friends.length})
              </h3>
              {profileUser.friends.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No friends added yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {profileUser.friends.map(friendId => {
                    const friend = users.find(u => u.id === friendId);
                    if (!friend) return null;
                    return (
                      <div
                        key={friend.id}
                        onClick={() => router.push(`/profile/${friend.username}`)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/80 hover:bg-gray-50 dark:hover:bg-zinc-800/80 cursor-pointer transition"
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover border shrink-0"
                        />
                        <div className="min-w-0 text-left">
                          <h4 className="font-bold text-xs text-gray-950 dark:text-white leading-tight truncate">
                            {friend.name}
                          </h4>
                          <span className="text-[10px] text-gray-400">@{friend.username}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tabParam === "settings" && (
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800/40 text-left space-y-6">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white border-b pb-2">Account Privacy</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/20">
                  <div>
                    <h4 className="font-bold text-xs text-gray-950 dark:text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Secure your YS-BOOK profile using secondary verification.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (!isMe) return;
                      updateProfile({ twoFactorEnabled: !profileUser.twoFactorEnabled });
                    }}
                    disabled={!isMe}
                    className={`py-1.5 px-3.5 rounded-lg text-[10px] font-bold shadow-sm transition ${
                      profileUser.twoFactorEnabled 
                        ? "bg-red-50 text-red-600 border border-red-200" 
                        : "bg-[#1877f2] text-white hover:bg-[#166fe5]"
                    }`}
                  >
                    {profileUser.twoFactorEnabled ? "Disable" : "Enable"}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/20">
                  <div>
                    <h4 className="font-bold text-xs text-gray-950 dark:text-white">Profile Visibility</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Control who can lookup or inspect your post directory.</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-zinc-700 py-1 px-3 rounded-full uppercase shrink-0">
                    Public
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-[#242526] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/20">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Edit Profile Details</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditProfileSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-left">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Display Name</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={2}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2] resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Work Title</label>
                  <input
                    type="text"
                    value={editData.work}
                    onChange={(e) => setEditData(prev => ({ ...prev, work: e.target.value }))}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Education Institution</label>
                  <input
                    type="text"
                    value={editData.education}
                    onChange={(e) => setEditData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">City / Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Website URL</label>
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Interests (Comma-separated)</label>
                <input
                  type="text"
                  value={editData.interests}
                  onChange={(e) => setEditData(prev => ({ ...prev, interests: e.target.value }))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs"
              >
                Save Profile updates
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
