"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDb } from "@/store/DbContext";
import PostCard from "@/components/PostCard";
import { 
  Users, Plus, Globe, Lock, Shield, FileText, 
  ArrowRight, Download, UploadCloud, X, CheckCircle 
} from "lucide-react";

export default function GroupsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");
  const { currentUser, groups, joinGroup, leaveGroup, createGroup, createGroupPost, uploadGroupFile, users } = useDb();

  const [activeTab, setActiveTab] = useState<"discussion" | "members" | "files">("discussion");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Create group form states
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupPrivacy, setGroupPrivacy] = useState<'public' | 'private'>('public');

  // Group post form states
  const [postContent, setPostContent] = useState("");
  const [postMedia, setPostMedia] = useState("");

  // Upload file form states
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  if (!currentUser) return null;

  // Selected Group details
  const selectedGroup = groups.find(g => g.id === groupId);
  const isMember = selectedGroup?.members.includes(currentUser.id);
  const isAdmin = selectedGroup?.adminId === currentUser.id;

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    const newGroupId = createGroup(groupName.trim(), groupDesc.trim(), groupPrivacy);
    setGroupName("");
    setGroupDesc("");
    setGroupPrivacy("public");
    setShowCreateModal(false);
    router.push(`/groups?id=${newGroupId}`);
  };

  const handleCreateGroupPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !groupId) return;
    createGroupPost(
      groupId,
      postContent.trim(),
      postMedia.trim() ? postMedia.trim() : undefined,
      postMedia.trim() ? 'image' : 'none'
    );
    setPostContent("");
    setPostMedia("");
    setShowPostModal(false);
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !groupId) return;
    uploadGroupFile(groupId, {
      name: fileName.trim(),
      size: fileSize.trim() || "1.0 MB",
      uploadedBy: currentUser.name,
      url: "#"
    });
    setFileName("");
    setFileSize("");
    setShowUploadModal(false);
  };

  // Groups list for side panel
  const joinedGroups = groups.filter(g => g.members.includes(currentUser.id));
  const suggestedGroups = groups.filter(g => !g.members.includes(currentUser.id));

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left select-none">
      {/* LEFT COLUMN: LIST OF GROUPS */}
      <div className="lg:col-span-4 bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-base text-gray-950 dark:text-white flex items-center gap-1.5">
            <Users className="w-5 h-5 text-[#1877f2]" />
            <span>Groups</span>
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-zinc-800 text-[#1877f2] rounded-full transition"
            title="Create Group"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* User's Groups */}
        <div>
          <h4 className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Joined Groups ({joinedGroups.length})
          </h4>
          {joinedGroups.length === 0 ? (
            <p className="px-1 text-xs text-gray-400 italic">No groups joined yet.</p>
          ) : (
            <div className="space-y-1">
              {joinedGroups.map(g => (
                <div
                  key={g.id}
                  onClick={() => {
                    router.push(`/groups?id=${g.id}`);
                    setActiveTab("discussion");
                  }}
                  className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition ${
                    groupId === g.id ? "bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-[#1877f2] pl-1" : ""
                  }`}
                >
                  <img
                    src={g.coverPhoto}
                    alt={g.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{g.name}</p>
                    <span className="text-[9px] text-gray-400 block">{g.members.length} members</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Groups */}
        <div>
          <h4 className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Discover Groups
          </h4>
          {suggestedGroups.length === 0 ? (
            <p className="px-1 text-xs text-gray-400 italic">No suggested groups available.</p>
          ) : (
            <div className="space-y-3">
              {suggestedGroups.map(g => (
                <div
                  key={g.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl border border-gray-150/40 dark:border-zinc-800"
                >
                  <div 
                    onClick={() => router.push(`/groups?id=${g.id}`)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <img
                      src={g.coverPhoto}
                      alt={g.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-850 dark:text-gray-250 truncate">{g.name}</p>
                      <span className="text-[9px] text-gray-400 block">{g.members.length} members</span>
                    </div>
                  </div>
                  <button
                    onClick={() => joinGroup(g.id)}
                    className="text-[10px] font-bold text-[#1877f2] bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 py-1.5 px-3 rounded-lg transition shrink-0"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN VIEW */}
      <div className="lg:col-span-8">
        {selectedGroup ? (
          <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 overflow-hidden">
            {/* Cover photo */}
            <div className="h-44 sm:h-56 relative bg-gray-100 dark:bg-zinc-800">
              <img
                src={selectedGroup.coverPhoto}
                alt="group cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-lg sm:text-2xl font-black">{selectedGroup.name}</h2>
                <p className="text-[10px] sm:text-xs text-blue-100 flex items-center gap-1.5 mt-1 font-semibold">
                  {selectedGroup.privacy === 'public' ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{selectedGroup.privacy === 'public' ? "Public Group" : "Private Group"}</span> · 
                  <span>{selectedGroup.members.length} members</span>
                </p>
              </div>
            </div>

            {/* Actions & Description Bar */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <p className="text-xs text-gray-500 max-w-md hidden sm:block italic">{selectedGroup.description}</p>
              <div>
                {isMember ? (
                  <button
                    onClick={() => leaveGroup(selectedGroup.id)}
                    className="bg-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 text-gray-800 dark:text-white font-bold text-xs py-2 px-4 rounded-xl transition"
                  >
                    Joined
                  </button>
                ) : (
                  <button
                    onClick={() => joinGroup(selectedGroup.id)}
                    className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs py-2 px-4 rounded-xl transition shadow-md"
                  >
                    Join Group
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 border-b border-gray-100 dark:border-zinc-800">
              {[
                { id: "discussion", label: "Discussion" },
                { id: "members", label: "Members" },
                { id: "files", label: "Files" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`py-3 px-5 text-xs font-bold border-b-4 transition ${
                    activeTab === t.id 
                      ? "border-[#1877f2] text-[#1877f2]" 
                      : "border-transparent text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab view contents */}
            <div className="p-4">
              {activeTab === "discussion" && (
                <div className="space-y-4">
                  {/* Create group post */}
                  {isMember && (
                    <div className="flex gap-3 bg-gray-50/50 dark:bg-zinc-800/20 p-3.5 rounded-xl border">
                      <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover border" />
                      <button
                        onClick={() => setShowPostModal(true)}
                        className="flex-1 bg-white dark:bg-zinc-800 text-left text-xs px-4 py-2 text-gray-400 rounded-full border border-gray-200 outline-none"
                      >
                        Write something in this group...
                      </button>
                    </div>
                  )}

                  {/* Group posts list */}
                  <div className="space-y-4">
                    {selectedGroup.posts.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-12 italic">No discussion updates yet.</p>
                    ) : (
                      selectedGroup.posts.map(post => (
                        <PostCard key={post.id} post={post} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "members" && (
                <div className="grid sm:grid-cols-2 gap-4 text-left">
                  {selectedGroup.members.map(memberId => {
                    const mUser = users.find(u => u.id === memberId);
                    if (!mUser) return null;
                    const isGroupAdmin = selectedGroup.adminId === memberId;
                    return (
                      <div
                        key={memberId}
                        onClick={() => router.push(`/profile/${mUser.username}`)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-150/40 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <img
                          src={mUser.avatar}
                          alt={mUser.name}
                          className="w-10 h-10 rounded-full object-cover border shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-gray-950 dark:text-white leading-tight truncate flex items-center gap-1">
                            <span>{mUser.name}</span>
                            {isGroupAdmin && (
                              <span title="Group Admin">
                                <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-gray-400">@{mUser.username}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-4">
                  {isMember && (
                    <div className="flex justify-end select-none">
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="text-xs font-bold bg-[#1877f2] text-white py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-[#166fe5] transition"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload File</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {selectedGroup.files.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-12 italic">No shared files in this group library.</p>
                    ) : (
                      selectedGroup.files.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150/60 dark:border-zinc-800 bg-gray-50/20"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                            <div className="text-left min-w-0">
                              <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">{file.name}</h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {file.size} · Uploaded by {file.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-full transition"
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-16 text-center border shadow-sm">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h4 className="font-extrabold text-gray-950 dark:text-white mb-2">Welcome to YS-BOOK Groups</h4>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Select an existing group from the left panel to join discussions, browse member networks, and view documentation, or create your own group!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 bg-[#1877f2] text-white py-2.5 px-6 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs flex items-center gap-1.5 mx-auto"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Create New Group</span>
            </button>
          </div>
        )}
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Create New Group</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Club, Local Football"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-805 outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Description</label>
                <textarea
                  placeholder="What is your group about?"
                  rows={2}
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-805 outline-none focus:ring-1 focus:ring-[#1877f2] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Privacy Setting</label>
                <select
                  value={groupPrivacy}
                  onChange={(e) => setGroupPrivacy(e.target.value as any)}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-805 outline-none focus:ring-1 focus:ring-[#1877f2] cursor-pointer"
                >
                  <option value="public">🌎 Public Group</option>
                  <option value="private">🔒 Private Group</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GROUP POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Create Group Post</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroupPost} className="p-5 space-y-4">
              <div>
                <textarea
                  required
                  placeholder="What's on your mind?"
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Media URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={postMedia}
                  onChange={(e) => setPostMedia(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs"
              >
                Post inside Group
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD FILE MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Upload File</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadFile} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. project_requirements.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">File Size</label>
                <input
                  type="text"
                  placeholder="e.g. 2.4 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs"
              >
                Confirm Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
