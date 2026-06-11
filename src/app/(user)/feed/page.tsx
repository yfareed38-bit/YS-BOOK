"use client";

import React from "react";
import { useDb } from "@/store/DbContext";
import StoryTray from "@/components/StoryTray";
import CreatePostCard from "@/components/CreatePostCard";
import PostCard from "@/components/PostCard";
import { Smile } from "lucide-react";

export default function FeedPage() {
  const { posts, currentUser } = useDb();

  if (!currentUser) return null;

  // Filter posts that are visible to this user
  // Visible if: post is public, or post is friends and author is a friend (or user himself), or post is only_me and author is the user
  const visiblePosts = posts.filter(post => {
    if (post.userId === currentUser.id) return true;
    if (post.visibility === 'public') return true;
    if (post.visibility === 'friends' && currentUser.friends.includes(post.userId)) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* 24-Hour Stories horizontal tray */}
      <StoryTray />
      
      {/* "What's on your mind?" publication widget */}
      <CreatePostCard />
      
      {/* Feed list */}
      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border border-gray-100 dark:border-zinc-800 shadow-sm">
            <Smile className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="font-extrabold text-gray-950 dark:text-white mb-2">Welcome to YS-BOOK!</h4>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Your feed is empty. Start by creating a post or adding some friends to see their stories and updates!
            </p>
          </div>
        ) : (
          visiblePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
