"use client";

import React, { useState } from "react";
import { useDb } from "@/store/DbContext";
import { Image, Video, BarChart2, Smile, X, Globe, Users, Lock, Plus } from "lucide-react";

export default function CreatePostCard() {
  const { currentUser, createPost } = useDb();
  const [showModal, setShowModal] = useState(false);
  
  // Post states
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'gif' | 'none'>('none');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'only_me'>('public');
  
  // Poll States
  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  if (!currentUser) return null;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl.trim() && (!isPoll || pollOptions.every(o => !o.trim()))) return;

    // Filter empty poll options
    const filteredOptions = isPoll ? pollOptions.filter(o => o.trim() !== "") : undefined;

    createPost(
      content,
      mediaUrl ? mediaUrl.trim() : undefined,
      mediaType,
      visibility,
      filteredOptions
    );

    // Reset States
    setContent("");
    setMediaUrl("");
    setMediaType("none");
    setVisibility("public");
    setIsPoll(false);
    setPollOptions(["", ""]);
    setShowModal(false);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 mb-6">
      {/* Top row */}
      <div className="flex gap-3 items-center">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border"
        />
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 bg-[#f0f2f5] hover:bg-gray-200/80 dark:bg-[#3a3b3c] dark:hover:bg-zinc-700/80 rounded-full px-5 py-3 text-left text-sm text-gray-500 dark:text-gray-400 font-medium cursor-pointer transition select-none outline-none border-none"
        >
          What's on your mind, {currentUser.name.split(" ")[0]}?
        </button>
      </div>

      <hr className="my-3 border-gray-100 dark:border-zinc-800" />

      {/* Bottom row */}
      <div className="flex justify-between items-center text-xs text-gray-500 font-bold select-none px-2">
        <button 
          onClick={() => {
            setMediaType("image");
            setShowModal(true);
          }}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition text-emerald-500"
        >
          <Image className="w-5 h-5" />
          <span className="hidden sm:inline">Photo/Video</span>
        </button>

        <button 
          onClick={() => {
            setIsPoll(true);
            setShowModal(true);
          }}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition text-[#1877f2]"
        >
          <BarChart2 className="w-5 h-5" />
          <span className="hidden sm:inline">Create Poll</span>
        </button>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition text-yellow-500"
        >
          <Smile className="w-5 h-5" />
          <span className="hidden sm:inline">Feeling/Activity</span>
        </button>
      </div>

      {/* CREATE POST MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden transform transition-all">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-gray-950 dark:text-white text-center flex-1">
                {isPoll ? "Create Poll Post" : "Create Post"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsPoll(false);
                  setPollOptions(["", ""]);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <form onSubmit={handleCreatePost} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* User profile details */}
              <div className="flex gap-3 items-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border shrink-0"
                />
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-gray-950 dark:text-white leading-tight">
                    {currentUser.name}
                  </h4>
                  {/* Visibility Dropdown */}
                  <div className="relative mt-1">
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as any)}
                      className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-lg px-2.5 py-1 flex items-center gap-1.5 outline-none border-none cursor-pointer"
                    >
                      <option value="public">🌎 Public</option>
                      <option value="friends">👥 Friends</option>
                      <option value="only_me">🔒 Only me</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={isPoll ? 2 : 4}
                className="w-full text-base placeholder-gray-400 focus:outline-none bg-transparent resize-none border-none dark:text-gray-200"
              />

              {/* Poll Fields */}
              {isPoll && (
                <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-zinc-800/20">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Poll Options
                  </span>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        required={idx < 2}
                        value={opt}
                        onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                        className="flex-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(idx)}
                          className="text-gray-400 hover:text-red-500 shrink-0 p-1"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptions.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="text-xs font-bold text-[#1877f2] flex items-center gap-1 hover:underline pt-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>
              )}

              {/* Media URL Box */}
              {!isPoll && (
                <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-zinc-800/20">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Add Media (Optional)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'none', label: '❌ None' },
                      { val: 'image', label: '🖼️ Image' },
                      { val: 'video', label: '🎥 Video' }
                    ].map((t) => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => setMediaType(t.val as any)}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          mediaType === t.val 
                            ? "bg-blue-50 dark:bg-blue-950/20 border-[#1877f2] text-[#1877f2]" 
                            : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {mediaType !== 'none' && (
                    <input
                      type="url"
                      placeholder="Insert Media URL (e.g. https://images.unsplash.com/...)"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#1877f2]"
                    />
                  )}
                </div>
              )}

              {/* Submit Row */}
              <button
                type="submit"
                disabled={!content.trim() && !mediaUrl.trim() && (!isPoll || pollOptions.every(o => !o.trim()))}
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md disabled:opacity-40 disabled:hover:bg-[#1877f2] text-sm"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
