"use client";

import React, { useState, useEffect } from "react";
import { useDb } from "@/store/DbContext";
import PostCard from "@/components/PostCard";
import { Tv, Plus, X, Video } from "lucide-react";

export default function WatchPage() {
  const { posts, currentUser, createPost } = useDb();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  if (!currentUser) return null;

  // Filter posts that are videos
  const videoPosts = posts.filter(p => p.mediaType === 'video');

  // Seed default videos if none exist to make it look premium
  useEffect(() => {
    const hasVideos = posts.some(p => p.mediaType === 'video');
    if (!hasVideos) {
      // Create two default video posts using stable public streams
      createPost(
        "Big Buck Bunny - An amazing classic short open source film. Check out the high-definition rendering and details! 🐰🍿",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "video",
        "public"
      );
      createPost(
        "Elephants Dream - The world's first open-source 3D animated movie, created entirely in Blender! Breathtaking scenes. 🐘⚙️",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "video",
        "public"
      );
    }
  }, [posts, createPost]);

  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    createPost(
      videoTitle.trim(),
      videoUrl.trim(),
      "video",
      "public"
    );

    setVideoTitle("");
    setVideoUrl("");
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Tv className="w-6 h-6 text-[#1877f2]" />
          <h2 className="text-lg font-black text-gray-950 dark:text-white">Watch Video Feed</h2>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#1877f2] text-white hover:bg-[#166fe5] font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video</span>
        </button>
      </div>

      {/* VIDEO FEED */}
      <div className="space-y-4">
        {videoPosts.length === 0 ? (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border shadow-sm">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-bounce" />
            <h4 className="font-extrabold text-gray-950 dark:text-white mb-2">No Videos Yet</h4>
            <p className="text-sm text-gray-400">Loading default public video feeds or click upload above to add yours!</p>
          </div>
        ) : (
          videoPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* UPLOAD VIDEO MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Publish Video Post</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-655"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadVideo} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Video Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My new animated short clip!"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Video Stream URL (.mp4)</label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://commondatastorage.googleapis.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] dark:text-white"
                />
              </div>

              <div className="text-[10px] text-gray-400">
                Ensure the URL links directly to a raw video stream format (like an .mp4 file) so the browser can play it back correctly.
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs font-bold"
              >
                Publish Video
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
