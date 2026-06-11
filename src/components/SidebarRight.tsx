"use client";

import React from "react";
import { useDb } from "@/store/DbContext";
import { ExternalLink, Sparkles } from "lucide-react";

export default function SidebarRight() {
  const { currentUser, users, createChat, openChat } = useDb();

  if (!currentUser) return null;

  // Contacts: other seeded users in the network
  const contacts = users.filter(u => u.id !== currentUser.id);

  const handleContactClick = (contactId: string) => {
    const chatId = createChat([contactId]);
    openChat(chatId);
  };

  const ads = [
    {
      title: "Vercel Next.js Deployments",
      link: "https://vercel.com",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      description: "Deploy YS-BOOK globally in seconds with serverless scalability and analytics."
    },
    {
      title: "Premium Office Gadgets",
      link: "#",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80",
      description: "Enhance your desk space. Get 20% off ergonomic mice and mechanical boards today!"
    }
  ];

  return (
    <aside className="w-72 fixed right-0 top-14 bottom-0 bg-transparent overflow-y-auto hidden lg:block p-4 select-none border-l border-gray-100 dark:border-zinc-800/20 scrollbar-thin">
      {/* SECTION 1: SPONSORED ADS */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span>Sponsored</span>
        </h4>
        <div className="space-y-4">
          {ads.map((ad, idx) => (
            <a
              key={idx}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 dark:hover:bg-zinc-800 transition cursor-pointer group"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-20 h-14 rounded-lg object-cover border shrink-0"
              />
              <div className="text-left min-w-0">
                <h5 className="text-xs font-bold text-gray-950 dark:text-white leading-tight flex items-center gap-1 group-hover:text-[#1877f2] transition duration-150">
                  <span className="truncate">{ad.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 shrink-0 transition" />
                </h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-normal line-clamp-2">
                  {ad.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-zinc-800" />

      {/* SECTION 2: CONTACTS */}
      <div>
        <div className="flex justify-between items-center mb-3 px-2">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Contacts
          </h4>
          <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full uppercase">
            Online
          </span>
        </div>

        {contacts.length === 0 ? (
          <p className="px-2 text-xs text-gray-400 italic">No other users in network.</p>
        ) : (
          <div className="space-y-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact.id)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 dark:hover:bg-zinc-800 cursor-pointer transition"
              >
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full object-cover border border-white dark:border-zinc-700"
                  />
                  {/* Online Dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#242526]"></span>
                </div>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {contact.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
