"use client";

import React, { useState } from "react";
import { useDb } from "@/store/DbContext";
import { Post, Comment } from "@/store/types";
import { 
  ThumbsUp, Heart, Sparkles, MessageCircle, Share2, 
  Trash2, Bookmark, BookmarkCheck, ShieldAlert, X, Send, Link as LinkIcon
} from "lucide-react";

export default function PostCard({ post }: { post: Post }) {
  const { 
    currentUser, addReaction, addComment, deletePost, 
    toggleSavePost, reportItem, users, saveDb, posts
  } = useDb();

  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  if (!currentUser) return null;

  const isAuthor = post.userId === currentUser.id;
  const isAdmin = currentUser.id === "user_admin";
  const isSaved = post.savedBy?.includes(currentUser.id);

  // Poll calculation
  const totalVotes = post.pollVotes ? Object.keys(post.pollVotes).length : 0;
  const userVote = post.pollVotes ? post.pollVotes[currentUser.id] : undefined;

  const handleVote = (optionIndex: number) => {
    if (!post.pollVotes) return;
    
    // Toggle vote
    const updatedVotes = { ...post.pollVotes };
    if (updatedVotes[currentUser.id] === optionIndex) {
      delete updatedVotes[currentUser.id];
    } else {
      updatedVotes[currentUser.id] = optionIndex;
    }

    // Update in posts list and save DB
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, pollVotes: updatedVotes } : p);
    saveDb({ posts: updatedPosts });
    
    // Force context re-render by updating db (simulated here)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText("");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    reportItem("post", post.id, reportReason.trim());
    setReportReason("");
    setShowReportModal(false);
  };

  // Reactions calculations
  const reactionKeys = Object.keys(post.reactions);
  const reactionValues = Object.values(post.reactions);
  const userReaction = post.reactions[currentUser.id];

  const reactionCounts = reactionValues.reduce((acc: any, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 p-4 mb-6">
      {/* CARD HEADER */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3 items-center">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div className="text-left">
            <h4 className="font-extrabold text-sm text-gray-950 dark:text-white leading-tight">
              {post.userName}
            </h4>
            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
              {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · 
              {post.visibility === 'public' ? " 🌎" : post.visibility === 'friends' ? " 👥" : " 🔒"}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex gap-1.5 text-gray-400">
          {/* Save Post */}
          <button 
            onClick={() => toggleSavePost(post.id)}
            title={isSaved ? "Unsave Post" : "Save Post"}
            className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-600 transition"
          >
            {isSaved ? (
              <BookmarkCheck className="w-4.5 h-4.5 text-[#1877f2]" />
            ) : (
              <Bookmark className="w-4.5 h-4.5" />
            )}
          </button>

          {/* Report Post */}
          {!isAuthor && (
            <button 
              onClick={() => setShowReportModal(true)}
              title="Report Post"
              className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition"
            >
              <ShieldAlert className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Delete Post */}
          {(isAuthor || isAdmin) && (
            <button 
              onClick={() => deletePost(post.id)}
              title="Delete Post"
              className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="space-y-4">
        <p className="text-sm text-gray-800 dark:text-gray-200 text-left whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {/* Media items */}
        {post.mediaUrl && post.mediaType === 'image' && (
          <div className="rounded-xl overflow-hidden border border-gray-50 dark:border-zinc-800 bg-gray-100 max-h-[450px] flex items-center justify-center">
            <img 
              src={post.mediaUrl} 
              alt="post media" 
              className="object-cover w-full h-full max-h-[450px]"
            />
          </div>
        )}

        {post.mediaUrl && post.mediaType === 'video' && (
          <div className="rounded-xl overflow-hidden border border-gray-50 dark:border-zinc-800 bg-black">
            <video 
              src={post.mediaUrl} 
              controls 
              className="w-full max-h-[400px] object-contain"
            />
          </div>
        )}

        {/* Poll Posts */}
        {post.pollOptions && post.pollOptions.length > 0 && (
          <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 space-y-2 bg-gray-50/50 dark:bg-zinc-800/10 text-left">
            {post.pollOptions.map((option, idx) => {
              const optionVotes = Object.values(post.pollVotes || {}).filter(v => v === idx).length;
              const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
              const isSelected = userVote === idx;

              return (
                <div 
                  key={idx} 
                  onClick={() => handleVote(idx)}
                  className={`relative overflow-hidden p-3 rounded-xl border border-gray-200 dark:border-zinc-700 cursor-pointer flex justify-between items-center transition select-none ${
                    isSelected ? "border-[#1877f2]" : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {/* Vote fill bar */}
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-blue-500/10 dark:bg-blue-500/5 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                  <span className="relative font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    {isSelected && <span className="text-[#1877f2]">✓</span>}
                    <span>{option}</span>
                  </span>
                  <span className="relative text-[10px] font-extrabold text-gray-400">
                    {optionVotes} votes ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FEEDBACK STATS BAR */}
      <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold border-b border-gray-100 dark:border-zinc-800 py-3 mt-4 px-1 select-none">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {reactionCounts.like > 0 && <span className="p-0.5 rounded-full bg-blue-500 text-white shrink-0 z-10 border border-white dark:border-[#242526]"><ThumbsUp className="w-2.5 h-2.5 fill-white" /></span>}
            {reactionCounts.love > 0 && <span className="p-0.5 rounded-full bg-pink-500 text-white shrink-0 z-20 -ml-1 border border-white dark:border-[#242526]"><Heart className="w-2.5 h-2.5 fill-white" /></span>}
            {reactionCounts.celebrate > 0 && <span className="p-0.5 rounded-full bg-yellow-500 text-white shrink-0 z-30 -ml-1 border border-white dark:border-[#242526]"><Sparkles className="w-2.5 h-2.5 fill-white" /></span>}
          </div>
          <span>{reactionKeys.length} reactions</span>
        </div>
        <div>
          <span>{post.comments.length} comments</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-3 text-xs text-gray-500 font-bold border-b border-gray-100 dark:border-zinc-800 py-1.5 relative select-none">
        {/* Like/Reaction Button */}
        <div 
          onMouseEnter={() => setShowReactionsMenu(true)}
          onMouseLeave={() => setShowReactionsMenu(false)}
          className="relative"
        >
          <button 
            onClick={() => addReaction(post.id, 'like')}
            className={`w-full flex items-center justify-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition ${
              userReaction === 'like' ? "text-[#1877f2]" : userReaction === 'love' ? "text-pink-500" : userReaction === 'celebrate' ? "text-yellow-500" : ""
            }`}
          >
            {userReaction === 'love' ? (
              <Heart className="w-4.5 h-4.5 fill-current" />
            ) : userReaction === 'celebrate' ? (
              <Sparkles className="w-4.5 h-4.5 fill-current" />
            ) : (
              <ThumbsUp className="w-4.5 h-4.5 fill-current" />
            )}
            <span className="capitalize">{userReaction || "Like"}</span>
          </button>

          {/* Reactions Hover Drawer */}
          {showReactionsMenu && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-[#242526] border border-gray-100 dark:border-zinc-800 rounded-full shadow-2xl px-3 py-2 flex gap-3 animate-fade-in z-30">
              <button 
                onClick={() => {
                  addReaction(post.id, 'like');
                  setShowReactionsMenu(false);
                }} 
                className="hover:scale-125 transition text-lg"
                title="Like"
              >
                👍
              </button>
              <button 
                onClick={() => {
                  addReaction(post.id, 'love');
                  setShowReactionsMenu(false);
                }} 
                className="hover:scale-125 transition text-lg"
                title="Love"
              >
                ❤️
              </button>
              <button 
                onClick={() => {
                  addReaction(post.id, 'celebrate');
                  setShowReactionsMenu(false);
                }} 
                className="hover:scale-125 transition text-lg"
                title="Celebrate"
              >
                🎉
              </button>
            </div>
          )}
        </div>

        {/* Comment button */}
        <button 
          onClick={() => {
            const input = document.getElementById(`comment-input-${post.id}`);
            input?.focus();
          }}
          className="flex items-center justify-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button 
          onClick={() => setShowShareModal(true)}
          className="flex items-center justify-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition"
        >
          <Share2 className="w-4.5 h-4.5" />
          <span>Share</span>
        </button>
      </div>

      {/* COMMENTS LIST */}
      <div className="pt-3.5 space-y-3">
        {post.comments.length > 0 && (
          <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5 items-start text-xs text-left">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-[#f0f2f5] dark:bg-zinc-800 rounded-2xl px-3 py-2 inline-block">
                    <span className="font-extrabold text-gray-950 dark:text-white block mb-0.5">
                      {comment.userName}
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex gap-3 text-[10px] text-gray-400 font-bold mt-1 px-1">
                    <button className="hover:underline">Like</button>
                    <span>·</span>
                    <span>
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment submission form */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center pt-1.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border shrink-0"
          />
          <div className="flex-1 flex bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-3.5 py-2">
            <input
              id={`comment-input-${post.id}`}
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-gray-850 dark:text-gray-200"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="text-[#1877f2] disabled:opacity-40 hover:scale-105 transition shrink-0 ml-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden select-none">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-gray-950 dark:text-white">Share Post</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 transition"
              >
                <LinkIcon className="w-4.5 h-4.5 text-gray-400" />
                <span className="text-xs font-bold text-gray-750 dark:text-gray-200">
                  {isCopied ? "Link Copied!" : "Copy Post Link"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden select-none">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-gray-950 dark:text-white">Report Content</h3>
              <button 
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Reason for Reporting
                </label>
                <textarea
                  required
                  placeholder="Specify why this content is violating community policies (e.g. copyright infringement, harassment, hate speech)..."
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#1877f2] text-xs text-gray-800 dark:text-gray-200 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white p-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-md text-xs"
              >
                Send Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
