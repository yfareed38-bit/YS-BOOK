"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDb } from "@/store/DbContext";
import { X, Send, Image, Paperclip, Smile, Minus } from "lucide-react";

interface ChatWindowProps {
  chatId: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onClose }) => {
  const { currentUser, chats, users, sendMessage } = useDb();
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chats.find(c => c.id === chatId);
  if (!chat) return null;

  // Find other participant details
  const otherParticipantId = chat.participants.find(id => id !== currentUser?.id);
  const otherUser = users.find(u => u.id === otherParticipantId);

  // Auto scroll to bottom
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.messages, isMinimized]);

  // Simulate typing indicator when chatbot replies
  useEffect(() => {
    if (chat.messages.length > 0) {
      const lastMsg = chat.messages[chat.messages.length - 1];
      if (lastMsg.senderId === currentUser?.id) {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [chat.messages, currentUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(chatId, inputText.trim(), "text");
    setInputText("");
  };

  const handleSimulatedAttachment = (type: 'image' | 'file') => {
    if (type === 'image') {
      sendMessage(chatId, "Sent a photo", "image", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80");
    } else {
      sendMessage(chatId, "Sent a resource file", "file", "#", "documentation_file.zip");
    }
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="w-48 bg-[#1877f2] text-white p-3 rounded-t-xl shadow-lg border border-b-0 border-[#1877f2] flex items-center justify-between cursor-pointer hover:bg-[#166fe5] transition duration-150 select-none shrink-0"
      >
        <span className="text-xs font-bold truncate">
          {chat.isGroup ? (chat.name || "Group") : (otherUser?.name || "Chat")}
        </span>
        <div className="flex gap-1.5 items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white/80 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-76 h-96 bg-white dark:bg-[#242526] rounded-t-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col select-none shrink-0">
      {/* HEADER */}
      <div className="bg-[#1877f2] text-white px-3.5 py-2.5 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={chat.isGroup ? (chat.avatar || "") : (otherUser?.avatar || "")}
            alt="chat avatar"
            className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div className="text-left min-w-0">
            <h4 className="text-xs font-extrabold truncate leading-tight">
              {chat.isGroup ? chat.name : otherUser?.name}
            </h4>
            <span className="text-[9px] text-blue-100 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
              Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-white/80 shrink-0">
          <button onClick={() => setIsMinimized(true)} className="hover:text-white transition">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClose} className="hover:text-white transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MESSAGES VIEW */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2 bg-[#f0f2f5]/40 dark:bg-zinc-900/10">
        {chat.messages.length === 0 ? (
          <p className="text-[10px] text-gray-400 text-center py-12">No messages. Say hello! 👋</p>
        ) : (
          chat.messages.map((m) => {
            const isMe = m.senderId === currentUser?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-1.5`}>
                {!isMe && (
                  <img
                    src={otherUser?.avatar}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="max-w-[75%]">
                  {m.type === "text" && (
                    <div 
                      className={`text-xs px-3 py-2 rounded-2xl break-words ${
                        isMe 
                          ? "bg-[#1877f2] text-white rounded-br-none" 
                          : "bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                  )}

                  {m.type === "image" && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 max-w-sm">
                      <img src={m.mediaUrl} alt="chat attachment" className="object-cover w-full max-h-32" />
                    </div>
                  )}

                  {m.type === "file" && (
                    <a 
                      href={m.mediaUrl} 
                      className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 hover:underline"
                    >
                      <Paperclip className="w-4.5 h-4.5 text-gray-400" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold truncate">{m.fileName}</p>
                        <span className="text-[8px] text-gray-400 block">Download file</span>
                      </div>
                    </a>
                  )}

                  <span className={`text-[8px] text-gray-400 mt-0.5 block ${isMe ? "text-right" : "text-left"}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start items-center gap-1.5">
            <img src={otherUser?.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover shrink-0" />
            <div className="bg-gray-200 dark:bg-zinc-800 px-3 py-2 rounded-full flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2">
        <div className="flex gap-1.5 text-gray-400 dark:text-gray-500 shrink-0">
          <button 
            type="button" 
            onClick={() => handleSimulatedAttachment("image")}
            title="Attach Image"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Image className="w-4.5 h-4.5" />
          </button>
          <button 
            type="button" 
            onClick={() => handleSimulatedAttachment("file")}
            title="Attach File"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Aa"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 text-xs p-2.5 rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] border-none outline-none focus:ring-1 focus:ring-[#1877f2] text-gray-800 dark:text-gray-200"
        />

        <button 
          type="submit" 
          disabled={!inputText.trim()}
          className="text-[#1877f2] disabled:opacity-40 shrink-0 hover:scale-105 transition"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
};

export default function FloatingChat() {
  const { activeChatIds, closeChat } = useDb();

  return (
    <div className="fixed bottom-0 right-4 z-50 flex items-end gap-3 max-w-[calc(100vw-300px)] overflow-x-auto select-none p-1 pointer-events-none">
      <div className="flex gap-3 items-end pointer-events-auto">
        {activeChatIds.map((chatId) => (
          <ChatWindow 
            key={chatId} 
            chatId={chatId} 
            onClose={() => closeChat(chatId)} 
          />
        ))}
      </div>
    </div>
  );
}
