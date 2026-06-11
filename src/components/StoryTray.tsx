"use client";

import React, { useState } from "react";
import { useDb } from "@/store/DbContext";
import { Plus, X, Eye, Heart, Laugh, ChevronLeft, ChevronRight } from "lucide-react";

export default function StoryTray() {
  const { currentUser, stories, addStory, viewStory, users } = useDb();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoryUrl, setNewStoryUrl] = useState("");

  if (!currentUser) return null;

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryUrl.trim()) return;
    addStory(newStoryUrl.trim(), "image");
    setNewStoryUrl("");
    setShowCreateModal(false);
  };

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    const story = stories[index];
    if (story) {
      viewStory(story.id);
    }
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      handleOpenStory(activeStoryIndex + 1);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      handleOpenStory(activeStoryIndex - 1);
    }
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="mb-6 relative">
      {/* Scrollable Story Cards Row */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
        {/* Card 1: Add Story (CurrentUser) */}
        <div 
          onClick={() => setShowCreateModal(true)}
          className="w-28 h-44 rounded-2xl bg-white dark:bg-[#242526] border border-gray-100 dark:border-zinc-800/40 relative flex flex-col justify-between shrink-0 overflow-hidden cursor-pointer shadow-sm group"
        >
          <div className="h-32 overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
          <div className="absolute top-[114px] left-1/2 -translate-x-1/2 bg-[#1877f2] border-4 border-white dark:border-[#242526] w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 z-10">
            <Plus className="w-5 h-5" />
          </div>
          <div className="bg-white dark:bg-[#242526] h-12 pt-3 text-center">
            <p className="text-[10px] font-black text-gray-800 dark:text-gray-200 leading-tight">Create Story</p>
          </div>
        </div>

        {/* Dynamic stories */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => handleOpenStory(index)}
            className="w-28 h-44 rounded-2xl relative shrink-0 overflow-hidden cursor-pointer shadow-sm group border border-gray-100 dark:border-zinc-800/30"
          >
            {/* Story image */}
            <img
              src={story.mediaUrl}
              alt="story thumbnail"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
            {/* Avatar circle */}
            <img
              src={story.userAvatar}
              alt="story user"
              className="absolute top-3 left-3 w-8 h-8 rounded-full border-2 border-[#1877f2] object-cover"
            />
            {/* User name label */}
            <span className="absolute bottom-3 left-3 right-3 text-[10px] font-bold text-white truncate text-left">
              {story.userName}
            </span>
          </div>
        ))}
      </div>

      {/* CREATE STORY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-gray-950 dark:text-white">Create a Story</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStory} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Story Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newStoryUrl}
                  onChange={(e) => setNewStoryUrl(e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#1877f2] text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="text-xs text-gray-400">
                Provide a public photo URL. Try searching Unsplash for beautiful visual stories.
              </div>
              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md"
              >
                Share Story
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY VIEWER */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col justify-between p-4 md:p-8 select-none">
          {/* Header info */}
          <div className="flex justify-between items-center text-white z-10 max-w-xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <img
                src={activeStory.userAvatar}
                alt="user avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#1877f2]"
              />
              <div className="text-left">
                <h4 className="font-bold text-sm leading-tight">{activeStory.userName}</h4>
                <span className="text-[10px] text-zinc-400">
                  {new Date(activeStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <div className="flex items-center gap-1 text-xs">
                <Eye className="w-4 h-4" />
                <span>{activeStory.viewers.length} views</span>
              </div>
              <button 
                onClick={() => setActiveStoryIndex(null)}
                className="hover:text-white p-1 hover:bg-zinc-800 rounded-full transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Slide Body */}
          <div className="relative flex-1 flex items-center justify-center max-w-xl mx-auto w-full my-4">
            {/* Left Nav Button */}
            {activeStoryIndex! > 0 && (
              <button 
                onClick={prevStory}
                className="absolute left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 z-10 transition hidden sm:block"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="w-full h-full max-h-[75vh] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-900 flex items-center justify-center">
              <img
                src={activeStory.mediaUrl}
                alt="story content"
                className="object-contain w-full h-full"
              />
            </div>

            {/* Right Nav Button */}
            {activeStoryIndex! < stories.length - 1 && (
              <button 
                onClick={nextStory}
                className="absolute right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 z-10 transition hidden sm:block"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Viewers & Interactions bar */}
          <div className="text-center text-white z-10 max-w-xl mx-auto w-full space-y-4">
            {/* Reactions summary */}
            <div className="flex justify-center gap-2">
              <span className="p-2 bg-zinc-900 rounded-full text-lg cursor-pointer hover:scale-110 transition">❤️</span>
              <span className="p-2 bg-zinc-900 rounded-full text-lg cursor-pointer hover:scale-110 transition">😂</span>
              <span className="p-2 bg-zinc-900 rounded-full text-lg cursor-pointer hover:scale-110 transition">😮</span>
              <span className="p-2 bg-zinc-900 rounded-full text-lg cursor-pointer hover:scale-110 transition">👍</span>
            </div>
            
            {/* Viewer names */}
            {activeStory.viewers.length > 0 && (
              <div className="text-[10px] text-zinc-400">
                Viewed by: {activeStory.viewers.map(id => {
                  const u = users.find(user => user.id === id);
                  return u ? u.name : "Anonymous";
                }).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
