"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Post,
  Story,
  Chat,
  Message,
  Group,
  Page,
  MarketplaceItem,
  Event,
  Notification,
  Report,
  Comment,
  GroupFile
} from "./types";

interface DbContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  stories: Story[];
  chats: Chat[];
  groups: Group[];
  pages: Page[];
  marketplace: MarketplaceItem[];
  events: Event[];
  notifications: Notification[];
  reports: Report[];
  // Methods
  login: (email: string, password?: string) => boolean;
  signup: (userData: Omit<User, "id" | "friends" | "followings" | "pendingRequests" | "sentRequests" | "twoFactorEnabled">) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  // Posts
  createPost: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'gif' | 'none', visibility?: 'public' | 'friends' | 'only_me', options?: string[]) => void;
  toggleSavePost: (postId: string) => void;
  addReaction: (postId: string, reactionType: 'like' | 'love' | 'celebrate') => void;
  addComment: (postId: string, content: string, parentId?: string) => void;
  deletePost: (postId: string) => void;
  // Stories
  addStory: (mediaUrl: string, type: 'image' | 'video') => void;
  viewStory: (storyId: string) => void;
  // Messaging
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'video' | 'file', mediaUrl?: string, fileName?: string) => void;
  createChat: (userIds: string[], isGroup?: boolean, name?: string, avatar?: string) => string;
  // Friends System
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (senderId: string) => void;
  rejectFriendRequest: (senderId: string) => void;
  removeFriend: (friendId: string) => void;
  followUser: (userId: string) => void;
  // Groups
  createGroup: (name: string, description: string, privacy: 'public' | 'private', coverPhoto?: string) => string;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  createGroupPost: (groupId: string, content: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'gif' | 'none') => void;
  uploadGroupFile: (groupId: string, file: Omit<GroupFile, "id">) => void;
  // Pages
  createPage: (name: string, bio: string, category: string, avatar?: string, coverPhoto?: string) => string;
  followPage: (pageId: string) => void;
  promotePage: (pageId: string, budget: number, duration: number) => void;
  // Events
  createEvent: (eventData: Omit<Event, "id" | "attendees" | "interested" | "organizerId">) => string;
  rsvpEvent: (eventId: string, status: 'attending' | 'interested' | 'none') => void;
  // Marketplace
  createMarketplaceItem: (itemData: Omit<MarketplaceItem, "id" | "sellerId" | "sellerName" | "sellerAvatar" | "timestamp">) => void;
  deleteMarketplaceItem: (itemId: string) => void;
  // Notifications
  markNotificationsAsRead: () => void;
  // Moderation / Reports
  reportItem: (targetType: 'post' | 'comment' | 'user' | 'group', targetId: string, reason: string) => void;
  resolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;
  deleteUserByAdmin: (userId: string) => void;
  saveDb: (updatedState: any) => void;
  // UI Chat Overlays
  activeChatIds: string[];
  openChat: (chatId: string) => void;
  closeChat: (chatId: string) => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

const SEED_USERS: User[] = [
  {
    id: "user_1",
    name: "John Doe",
    username: "johndoe",
    email: "demo@ysbook.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    bio: "Full Stack Engineer & Technology Enthusiast. Building YS-BOOK!",
    education: "B.S. in Computer Science at Stanford University",
    work: "Lead Architect at YS-Tech Solutions",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    interests: ["Coding", "Gadgets", "Photography", "AI"],
    friends: ["user_2", "user_3", "user_4"],
    followings: ["user_2", "user_3"],
    pendingRequests: [],
    sentRequests: [],
    twoFactorEnabled: false
  },
  {
    id: "user_2",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@ysbook.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
    bio: "UI/UX Designer. Lover of minimal design, pastel palettes, and architecture.",
    education: "M.A. in Interaction Design at RISD",
    work: "Senior Product Designer at DesignStudio",
    location: "New York, NY",
    website: "https://janesmith.design",
    interests: ["Design", "Art", "Travel", "Coffee"],
    friends: ["user_1", "user_3"],
    followings: ["user_1"],
    pendingRequests: [],
    sentRequests: [],
    twoFactorEnabled: true
  },
  {
    id: "user_3",
    name: "Sarah Connor",
    username: "sarahc",
    email: "sarah@ysbook.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    bio: "Business Strategist | Creator. Empowering educational groups and local communities.",
    education: "MBA at Harvard Business School",
    work: "Managing Partner at Connor Consulting",
    location: "Boston, MA",
    website: "https://connorconsulting.com",
    interests: ["Business", "Leadership", "Education", "Books"],
    friends: ["user_1", "user_2", "user_4"],
    followings: ["user_1", "user_4"],
    pendingRequests: [],
    sentRequests: [],
    twoFactorEnabled: false
  },
  {
    id: "user_4",
    name: "David Lee",
    username: "davidl",
    email: "david@ysbook.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80",
    bio: "Vlogger & Digital Content Creator. Capturing moments worldwide 🎥✈️",
    education: "B.A. in Media Studies at UC Berkeley",
    work: "Independent Video Producer & Vlogger",
    location: "Los Angeles, CA",
    website: "https://davidlee.vlog",
    interests: ["Vlogging", "Traveling", "Fitness", "Movies"],
    friends: ["user_1", "user_3"],
    followings: ["user_1", "user_3"],
    pendingRequests: [],
    sentRequests: [],
    twoFactorEnabled: false
  },
  {
    id: "user_admin",
    name: "YS-BOOK Admin",
    username: "admin",
    email: "admin@ysbook.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80",
    bio: "System Administrator for YS-BOOK. Moderating community and managing services.",
    education: "M.S. in Cybersecurity at Georgia Tech",
    work: "Chief Security Officer at YS-BOOK Inc.",
    location: "Global",
    website: "https://ysbook.com",
    interests: ["Cybersecurity", "Servers", "Automation"],
    friends: [],
    followings: [],
    pendingRequests: [],
    sentRequests: [],
    twoFactorEnabled: true
  }
];

const SEED_POSTS: Post[] = [
  {
    id: "post_1",
    userId: "user_2",
    userName: "Jane Smith",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    content: "Just finished designing the mockup for the new YS-BOOK mobile app layouts! Tried to make the feed extremely smooth with custom light/dark modes and modern glassmorphic buttons. Let me know what you guys think of the typography and structure! 🎨📱✨",
    mediaUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    reactions: {
      user_1: "love",
      user_3: "like",
      user_4: "like"
    },
    comments: [
      {
        id: "comment_1",
        postId: "post_1",
        userId: "user_1",
        userName: "John Doe",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        content: "This looks absolutely premium, Jane! The spacing is spot on, and the visual hierarchy is amazing. Can't wait to implement this in Next.js v16!",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        reactions: { user_2: "like" }
      },
      {
        id: "comment_2",
        postId: "post_1",
        userId: "user_3",
        userName: "Sarah Connor",
        userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        content: "Love the choice of colors! It represents a huge step forward for the brand identity. Keep it up!",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        reactions: {}
      }
    ],
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    visibility: "public"
  },
  {
    id: "post_2",
    userId: "user_4",
    userName: "David Lee",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: "New travel vlog teaser is here! Spent two weeks exploring the volcanic landscapes and hot springs of Iceland. Full 4K video drops tomorrow morning! 🌋❄️✈️ Check out this breathtaking shot from our drone!",
    mediaUrl: "https://images.unsplash.com/photo-1504893524553-ac55fce698be?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    reactions: {
      user_1: "like",
      user_2: "celebrate",
      user_3: "like"
    },
    comments: [],
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    visibility: "public"
  },
  {
    id: "post_3",
    userId: "user_3",
    userName: "Sarah Connor",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    content: "Which business topic should we cover in our next educational webinar? Vote below or write your ideas in the comments!",
    mediaType: "none",
    reactions: {
      user_1: "like",
      user_4: "like"
    },
    comments: [],
    pollOptions: ["Growth Marketing Strategies", "Venture Capital Fundraising", "Building Remote Work Cultures", "AI Automation for SMEs"],
    pollVotes: {
      user_1: 0,
      user_2: 2,
      user_4: 3
    },
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    visibility: "public"
  }
];

const SEED_STORIES: Story[] = [
  {
    id: "story_1",
    userId: "user_2",
    userName: "Jane Smith",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1500620800310-888de8a45217?auto=format&fit=crop&w=400&q=80",
    type: "image",
    viewers: ["user_1"],
    reactions: { user_1: "❤️" },
    timestamp: new Date().toISOString()
  },
  {
    id: "story_2",
    userId: "user_4",
    userName: "David Lee",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
    type: "image",
    viewers: ["user_1", "user_3"],
    reactions: {},
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const SEED_CHATS: Chat[] = [
  {
    id: "chat_1",
    participants: ["user_1", "user_2"],
    isGroup: false,
    messages: [
      {
        id: "msg_1",
        senderId: "user_2",
        content: "Hi John! Did you review the design layouts I sent yesterday?",
        type: "text",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        read: true
      },
      {
        id: "msg_2",
        senderId: "user_1",
        content: "Hey Jane! Yes, I saw them. They look absolutely gorgeous! Love the color palette.",
        type: "text",
        timestamp: new Date(Date.now() - 3600000 * 4.9).toISOString(),
        read: true
      },
      {
        id: "msg_3",
        senderId: "user_2",
        content: "Awesome! Let me know if you need any adjustments or separate icons.",
        type: "text",
        timestamp: new Date(Date.now() - 3600000 * 4.8).toISOString(),
        read: true
      }
    ]
  },
  {
    id: "chat_2",
    participants: ["user_1", "user_3"],
    isGroup: false,
    messages: [
      {
        id: "msg_4",
        senderId: "user_3",
        content: "Hi John, do you want to join our Business webinar tomorrow?",
        type: "text",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        read: true
      },
      {
        id: "msg_5",
        senderId: "user_1",
        content: "Hi Sarah, absolutely! What time does it start?",
        type: "text",
        timestamp: new Date(Date.now() - 3600000 * 23.8).toISOString(),
        read: true
      }
    ]
  }
];

const SEED_GROUPS: Group[] = [
  {
    id: "group_1",
    name: "Technology & Coding Hub",
    description: "A community for software engineers, designers, creators, and technology leaders to discuss Next.js, React, AI, and developer tools.",
    privacy: "public",
    coverPhoto: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    adminId: "user_1",
    moderators: ["user_2"],
    members: ["user_1", "user_2", "user_3", "user_4"],
    posts: [
      {
        id: "gpost_1",
        userId: "user_1",
        userName: "John Doe",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        content: "Welcome everyone to the YS Technology & Coding Hub! Feel free to share your projects, ask coding questions, or discuss new software developments. Let's grow together! 🚀💻",
        mediaType: "none",
        reactions: { user_2: "like", user_3: "celebrate" },
        comments: [],
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        visibility: "public"
      }
    ],
    files: [
      {
        id: "file_1",
        name: "nextjs15_cheat_sheet.pdf",
        size: "1.2 MB",
        uploadedBy: "John Doe",
        url: "#"
      }
    ],
    events: ["event_1"]
  },
  {
    id: "group_2",
    name: "YS Fitness & Health Community",
    description: "Local community group focusing on wellness, daily exercises, nutrition tips, and community marathons.",
    privacy: "private",
    coverPhoto: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    adminId: "user_4",
    moderators: [],
    members: ["user_4", "user_1", "user_3"],
    posts: [],
    files: [],
    events: []
  }
];

const SEED_PAGES: Page[] = [
  {
    id: "page_1",
    name: "YS-Tech Solutions",
    bio: "Enterprise web solutions, IT consultancies, and innovative software development frameworks.",
    category: "Business & Technology",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    followers: ["user_1", "user_2", "user_3", "user_4"],
    adminId: "user_1",
    views: 1240,
    reach: 5320,
    engagement: 789,
    promotions: [
      { id: "promo_1", budget: 150, duration: 5, status: "completed", reachEstimate: 4500 },
      { id: "promo_2", budget: 50, duration: 2, status: "active", reachEstimate: 1500 }
    ]
  },
  {
    id: "page_2",
    name: "David Lee Vlogs",
    bio: "Exploring the world, testing local cuisines, and documenting the journey of life one video at a time.",
    category: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    followers: ["user_1", "user_3"],
    adminId: "user_4",
    views: 3500,
    reach: 18400,
    engagement: 4200,
    promotions: []
  }
];

const SEED_MARKETPLACE: MarketplaceItem[] = [
  {
    id: "market_1",
    title: "MacBook Pro M2 - 16GB / 512GB (Space Gray)",
    price: 1250,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    location: "San Francisco, CA",
    description: "Selling my lightly used MacBook Pro. Excellent condition, no scratches, battery health is at 94%. Comes with the original box and Apple charger. Ideal for programming, editing, or office work.",
    sellerId: "user_1",
    sellerName: "John Doe",
    sellerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    category: "Electronics",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "market_2",
    title: "Fuji XT-3 Mirrorless Camera with 18-55mm Kit Lens",
    price: 850,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
    location: "New York, NY",
    description: "Great camera for hybrid photo/video shooters. Fully functional, lens is clean and free of dust. Includes three batteries, battery charger, and camera strap.",
    sellerId: "user_2",
    sellerName: "Jane Smith",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    category: "Cameras & Video",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: "market_3",
    title: "Ergonomic Office Chair - Mesh Back & Lumbar Support",
    price: 180,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=400&q=80",
    location: "Boston, MA",
    description: "Premium mesh office chair. Fully adjustable armrests, height, tilt lock, and structural lumbar support. Moving out of state, must sell by Sunday!",
    sellerId: "user_3",
    sellerName: "Sarah Connor",
    sellerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    category: "Home Goods & Furniture",
    timestamp: new Date(Date.now() - 3600000 * 32).toISOString()
  }
];

const SEED_EVENTS: Event[] = [
  {
    id: "event_1",
    title: "Vite + Next.js developer roundtable and discussions",
    date: "2026-06-25",
    time: "18:00",
    location: "TechSpace SF & Live Online Link",
    description: "Join local community builders, engineers, and creators as we debate and showcase performance tuning in modern fullstack web frameworks. Refreshments provided!",
    coverPhoto: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    organizerId: "user_1",
    attendees: ["user_1", "user_2", "user_4"],
    interested: ["user_3"]
  },
  {
    id: "event_2",
    title: "Annual Boston Entrepreneur Summit 2026",
    date: "2026-07-10",
    time: "09:00",
    location: "Boston Marriott Copley Place",
    description: "A premier gathering of founders, growth strategists, angels, and creators talking marketing strategies, automation, and leadership.",
    coverPhoto: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    organizerId: "user_3",
    attendees: ["user_3", "user_1"],
    interested: ["user_2", "user_4"]
  }
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    userId: "user_1",
    senderId: "user_2",
    senderName: "Jane Smith",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    type: "like",
    targetId: "post_1",
    message: "liked your comment on her post.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false
  },
  {
    id: "notif_2",
    userId: "user_1",
    senderId: "user_3",
    senderName: "Sarah Connor",
    senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    type: "friend_request",
    targetId: "user_3",
    message: "sent you a friend request.",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    read: false
  }
];

const SEED_REPORTS: Report[] = [
  {
    id: "rep_1",
    reporterId: "user_2",
    targetType: "post",
    targetId: "post_2",
    targetExcerpt: "New travel vlog teaser is here! Spent two weeks exploring...",
    reason: "Potential copyright infringement of drone photos",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: "pending"
  }
];

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeChatIds, setActiveChatIds] = useState<string[]>([]);

  const openChat = (chatId: string) => {
    if (!activeChatIds.includes(chatId)) {
      setActiveChatIds(prev => [...prev.filter(id => id !== chatId), chatId].slice(-3));
    }
  };

  const closeChat = (chatId: string) => {
    setActiveChatIds(prev => prev.filter(id => id !== chatId));
  };

  // Load from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ysbook_db");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUsers(parsed.users || []);
          setPosts(parsed.posts || []);
          setStories(parsed.stories || []);
          setChats(parsed.chats || []);
          setGroups(parsed.groups || []);
          setPages(parsed.pages || []);
          setMarketplace(parsed.marketplace || []);
          setEvents(parsed.events || []);
          setNotifications(parsed.notifications || []);
          setReports(parsed.reports || []);

          if (parsed.currentUserId) {
            const user = parsed.users.find((u: User) => u.id === parsed.currentUserId);
            setCurrentUser(user || null);
          }
        } catch (e) {
          console.error("Failed parsing localStorage DB, resetting seed:", e);
          resetDb();
        }
      } else {
        resetDb();
      }
    }
  }, []);

  const resetDb = () => {
    setUsers(SEED_USERS);
    setPosts(SEED_POSTS);
    setStories(SEED_STORIES);
    setChats(SEED_CHATS);
    setGroups(SEED_GROUPS);
    setPages(SEED_PAGES);
    setMarketplace(SEED_MARKETPLACE);
    setEvents(SEED_EVENTS);
    setNotifications(SEED_NOTIFICATIONS);
    setReports(SEED_REPORTS);
    // Log in John Doe as default
    setCurrentUser(SEED_USERS[0]);

    const state = {
      users: SEED_USERS,
      posts: SEED_POSTS,
      stories: SEED_STORIES,
      chats: SEED_CHATS,
      groups: SEED_GROUPS,
      pages: SEED_PAGES,
      marketplace: SEED_MARKETPLACE,
      events: SEED_EVENTS,
      notifications: SEED_NOTIFICATIONS,
      reports: SEED_REPORTS,
      currentUserId: SEED_USERS[0].id
    };
    localStorage.setItem("ysbook_db", JSON.stringify(state));
  };

  const saveDb = (updatedState: Partial<{
    users: User[];
    posts: Post[];
    stories: Story[];
    chats: Chat[];
    groups: Group[];
    pages: Page[];
    marketplace: MarketplaceItem[];
    events: Event[];
    notifications: Notification[];
    reports: Report[];
    currentUserId: string | null;
  }>) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ysbook_db");
      let currentFullState = stored ? JSON.parse(stored) : {};
      
      const newFullState = {
        ...currentFullState,
        ...updatedState
      };
      
      localStorage.setItem("ysbook_db", JSON.stringify(newFullState));
    }
  };

  // Auth Operations
  const login = (email: string, password?: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      saveDb({ users, posts, stories, chats, groups, pages, marketplace, events, notifications, reports, currentUserId: foundUser.id });
      return true;
    }
    return false;
  };

  const signup = (userData: Omit<User, "id" | "friends" | "followings" | "pendingRequests" | "sentRequests" | "twoFactorEnabled">) => {
    const newId = `user_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      friends: [],
      followings: [],
      pendingRequests: [],
      sentRequests: [],
      twoFactorEnabled: false
    };

    const newUsers = [...users, newUser];
    setUsers(newUsers);
    setCurrentUser(newUser);
    saveDb({ users: newUsers, currentUserId: newId });
  };

  const logout = () => {
    setCurrentUser(null);
    saveDb({ currentUserId: null });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    const newUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    
    // Also update name/avatar in posts/comments/marketplace items
    const newPosts = posts.map(p => {
      let changed = false;
      let newP = { ...p };
      if (p.userId === currentUser.id) {
        if (updates.name) { newP.userName = updates.name; changed = true; }
        if (updates.avatar) { newP.userAvatar = updates.avatar; changed = true; }
      }
      const newComments = p.comments.map(c => {
        if (c.userId === currentUser.id) {
          return {
            ...c,
            userName: updates.name || c.userName,
            userAvatar: updates.avatar || c.userAvatar
          };
        }
        return c;
      });
      return { ...newP, comments: newComments };
    });

    const newMarket = marketplace.map(m => {
      if (m.sellerId === currentUser.id) {
        return {
          ...m,
          sellerName: updates.name || m.sellerName,
          sellerAvatar: updates.avatar || m.sellerAvatar
        };
      }
      return m;
    });

    setUsers(newUsers);
    setCurrentUser(updatedUser);
    setPosts(newPosts);
    setMarketplace(newMarket);
    saveDb({ users: newUsers, posts: newPosts, marketplace: newMarket, currentUserId: currentUser.id });
  };

  // Posts
  const createPost = (
    content: string,
    mediaUrl?: string,
    mediaType: 'image' | 'video' | 'gif' | 'none' = 'none',
    visibility: 'public' | 'friends' | 'only_me' = 'public',
    pollOptions?: string[]
  ) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      mediaUrl,
      mediaType,
      reactions: {},
      comments: [],
      timestamp: new Date().toISOString(),
      visibility,
      pollOptions: pollOptions && pollOptions.length > 0 ? pollOptions : undefined,
      pollVotes: pollOptions && pollOptions.length > 0 ? {} : undefined
    };

    const newPosts = [newPost, ...posts];
    setPosts(newPosts);
    saveDb({ posts: newPosts });
  };

  const deletePost = (postId: string) => {
    const newPosts = posts.filter(p => p.id !== postId);
    setPosts(newPosts);
    // Also remove from reports if any
    const newReports = reports.filter(r => !(r.targetType === 'post' && r.targetId === postId));
    setReports(newReports);
    saveDb({ posts: newPosts, reports: newReports });
  };

  const toggleSavePost = (postId: string) => {
    if (!currentUser) return;
    const newPosts = posts.map(p => {
      if (p.id === postId) {
        const savedBy = p.savedBy || [];
        const isSaved = savedBy.includes(currentUser.id);
        const newSaved = isSaved 
          ? savedBy.filter(id => id !== currentUser.id) 
          : [...savedBy, currentUser.id];
        return { ...p, savedBy: newSaved };
      }
      return p;
    });
    setPosts(newPosts);
    saveDb({ posts: newPosts });
  };

  const addReaction = (postId: string, reactionType: 'like' | 'love' | 'celebrate') => {
    if (!currentUser) return;
    const newPosts = posts.map(p => {
      if (p.id === postId) {
        const currentReactions = { ...p.reactions };
        if (currentReactions[currentUser.id] === reactionType) {
          delete currentReactions[currentUser.id]; // remove reaction
        } else {
          currentReactions[currentUser.id] = reactionType; // add/update reaction
          
          // Trigger notification to the author
          if (p.userId !== currentUser.id) {
            const notifId = `notif_${Date.now()}`;
            const newNotif: Notification = {
              id: notifId,
              userId: p.userId,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderAvatar: currentUser.avatar,
              type: "like",
              targetId: p.id,
              message: `reacted to your post: "${p.content.substring(0, 25)}..."`,
              timestamp: new Date().toISOString(),
              read: false
            };
            setNotifications(prev => {
              const updated = [newNotif, ...prev];
              saveDb({ notifications: updated });
              return updated;
            });
          }
        }
        return { ...p, reactions: currentReactions };
      }
      return p;
    });
    setPosts(newPosts);
    saveDb({ posts: newPosts });
  };

  const addComment = (postId: string, content: string, parentId?: string) => {
    if (!currentUser) return;
    const commentId = `comment_${Date.now()}`;
    const newComment: Comment = {
      id: commentId,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      parentId,
      reactions: {}
    };

    const newPosts = posts.map(p => {
      if (p.id === postId) {
        // Find post owner for notification
        if (p.userId !== currentUser.id) {
          const notifId = `notif_${Date.now()}`;
          const newNotif: Notification = {
            id: notifId,
            userId: p.userId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            type: "comment",
            targetId: p.id,
            message: `commented on your post: "${content.substring(0, 25)}..."`,
            timestamp: new Date().toISOString(),
            read: false
          };
          setNotifications(prev => {
            const updated = [newNotif, ...prev];
            saveDb({ notifications: updated });
            return updated;
          });
        }
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });
    setPosts(newPosts);
    saveDb({ posts: newPosts });
  };

  // Stories
  const addStory = (mediaUrl: string, type: 'image' | 'video') => {
    if (!currentUser) return;
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      mediaUrl,
      type,
      viewers: [],
      reactions: {},
      timestamp: new Date().toISOString()
    };

    const newStories = [newStory, ...stories];
    setStories(newStories);
    saveDb({ stories: newStories });
  };

  const viewStory = (storyId: string) => {
    if (!currentUser) return;
    const newStories = stories.map(s => {
      if (s.id === storyId && !s.viewers.includes(currentUser.id)) {
        return {
          ...s,
          viewers: [...s.viewers, currentUser.id]
        };
      }
      return s;
    });
    setStories(newStories);
    saveDb({ stories: newStories });
  };

  // Messaging System
  const createChat = (userIds: string[], isGroup: boolean = false, name?: string, avatar?: string) => {
    if (!currentUser) return "";
    const participants = Array.from(new Set([currentUser.id, ...userIds]));
    
    // Check if chat already exists for 1-to-1 chat
    if (!isGroup && participants.length === 2) {
      const existing = chats.find(c => !c.isGroup && c.participants.includes(participants[0]) && c.participants.includes(participants[1]));
      if (existing) return existing.id;
    }

    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      participants,
      isGroup,
      name: isGroup ? (name || "New Group Chat") : undefined,
      avatar: isGroup ? (avatar || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=150&q=80") : undefined,
      messages: []
    };

    const newChats = [newChat, ...chats];
    setChats(newChats);
    saveDb({ chats: newChats });
    return newChatId;
  };

  const sendMessage = (
    chatId: string,
    content: string,
    type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text',
    mediaUrl?: string,
    fileName?: string
  ) => {
    if (!currentUser) return;
    const messageId = `msg_${Date.now()}`;
    const newMessage: Message = {
      id: messageId,
      senderId: currentUser.id,
      content,
      type,
      mediaUrl,
      fileName,
      timestamp: new Date().toISOString(),
      read: false
    };

    const newChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });
    setChats(newChats);
    saveDb({ chats: newChats });

    // Simulate real-time replies for UX
    const currentChat = chats.find(c => c.id === chatId);
    if (currentChat && !currentChat.isGroup) {
      const otherParticipantId = currentChat.participants.find(p => p !== currentUser.id);
      const otherUser = users.find(u => u.id === otherParticipantId);
      
      if (otherUser && otherUser.id !== "user_admin") {
        setTimeout(() => {
          const replyId = `msg_${Date.now() + 1}`;
          const replies = [
            `Hey ${currentUser.name.split(" ")[0]}! Thanks for messaging. That sounds really interesting! 👍`,
            `Wow! I was just thinking about that. Let me look into it and get back to you!`,
            `Yes, definitely! Are we meeting up for this or should we call? 📞`,
            `Great! I'm online right now. Let me send you the file or link.`,
            `Haha, that's awesome! 😂 Let's sync up later today.`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const mockReply: Message = {
            id: replyId,
            senderId: otherUser.id,
            content: randomReply,
            type: "text",
            timestamp: new Date().toISOString(),
            read: false
          };

          setChats(prevChats => {
            const updated = prevChats.map(ch => {
              if (ch.id === chatId) {
                return { ...ch, messages: [...ch.messages, mockReply] };
              }
              return ch;
            });
            saveDb({ chats: updated });
            return updated;
          });

          // Add notification
          const newNotif: Notification = {
            id: `notif_${Date.now()}`,
            userId: currentUser.id,
            senderId: otherUser.id,
            senderName: otherUser.name,
            senderAvatar: otherUser.avatar,
            type: "message",
            targetId: chatId,
            message: `sent you a message: "${randomReply.substring(0, 25)}..."`,
            timestamp: new Date().toISOString(),
            read: false
          };

          setNotifications(prev => {
            const updated = [newNotif, ...prev];
            saveDb({ notifications: updated });
            return updated;
          });
        }, 2000);
      }
    }
  };

  // Friends System
  const sendFriendRequest = (targetUserId: string) => {
    if (!currentUser) return;
    const newUsers = users.map(u => {
      if (u.id === targetUserId && !u.pendingRequests.includes(currentUser.id)) {
        return {
          ...u,
          pendingRequests: [...u.pendingRequests, currentUser.id]
        };
      }
      if (u.id === currentUser.id && !u.sentRequests.includes(targetUserId)) {
        return {
          ...u,
          sentRequests: [...u.sentRequests, targetUserId]
        };
      }
      return u;
    });

    // Send notification
    const notifId = `notif_${Date.now()}`;
    const newNotif: Notification = {
      id: notifId,
      userId: targetUserId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: "friend_request",
      targetId: currentUser.id,
      message: "sent you a friend request.",
      timestamp: new Date().toISOString(),
      read: false
    };

    setUsers(newUsers);
    setCurrentUser(newUsers.find(u => u.id === currentUser.id) || null);
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      saveDb({ notifications: updated, users: newUsers });
      return updated;
    });
  };

  const acceptFriendRequest = (senderId: string) => {
    if (!currentUser) return;
    const newUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          friends: [...u.friends, senderId],
          pendingRequests: u.pendingRequests.filter(id => id !== senderId)
        };
      }
      if (u.id === senderId) {
        return {
          ...u,
          friends: [...u.friends, currentUser.id],
          sentRequests: u.sentRequests.filter(id => id !== currentUser.id)
        };
      }
      return u;
    });

    const notifId = `notif_${Date.now()}`;
    const newNotif: Notification = {
      id: notifId,
      userId: senderId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: "accept_request",
      targetId: currentUser.id,
      message: "accepted your friend request.",
      timestamp: new Date().toISOString(),
      read: false
    };

    setUsers(newUsers);
    setCurrentUser(newUsers.find(u => u.id === currentUser.id) || null);
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      saveDb({ notifications: updated, users: newUsers });
      return updated;
    });
  };

  const rejectFriendRequest = (senderId: string) => {
    if (!currentUser) return;
    const newUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          pendingRequests: u.pendingRequests.filter(id => id !== senderId)
        };
      }
      if (u.id === senderId) {
        return {
          ...u,
          sentRequests: u.sentRequests.filter(id => id !== currentUser.id)
        };
      }
      return u;
    });

    setUsers(newUsers);
    setCurrentUser(newUsers.find(u => u.id === currentUser.id) || null);
    saveDb({ users: newUsers });
  };

  const removeFriend = (friendId: string) => {
    if (!currentUser) return;
    const newUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          friends: u.friends.filter(id => id !== friendId)
        };
      }
      if (u.id === friendId) {
        return {
          ...u,
          friends: u.friends.filter(id => id !== currentUser.id)
        };
      }
      return u;
    });

    setUsers(newUsers);
    setCurrentUser(newUsers.find(u => u.id === currentUser.id) || null);
    saveDb({ users: newUsers });
  };

  const followUser = (userId: string) => {
    if (!currentUser) return;
    const isFollowing = currentUser.followings.includes(userId);
    const newUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          followings: isFollowing 
            ? u.followings.filter(id => id !== userId) 
            : [...u.followings, userId]
        };
      }
      return u;
    });
    setUsers(newUsers);
    setCurrentUser(newUsers.find(u => u.id === currentUser.id) || null);
    saveDb({ users: newUsers });
  };

  // Groups
  const createGroup = (name: string, description: string, privacy: 'public' | 'private', coverPhoto?: string) => {
    if (!currentUser) return "";
    const groupId = `group_${Date.now()}`;
    const newGroup: Group = {
      id: groupId,
      name,
      description,
      privacy,
      coverPhoto: coverPhoto || "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
      adminId: currentUser.id,
      moderators: [],
      members: [currentUser.id],
      posts: [],
      files: [],
      events: []
    };

    const newGroups = [...groups, newGroup];
    setGroups(newGroups);
    saveDb({ groups: newGroups });
    return groupId;
  };

  const joinGroup = (groupId: string) => {
    if (!currentUser) return;
    const newGroups = groups.map(g => {
      if (g.id === groupId && !g.members.includes(currentUser.id)) {
        return {
          ...g,
          members: [...g.members, currentUser.id]
        };
      }
      return g;
    });
    setGroups(newGroups);
    saveDb({ groups: newGroups });
  };

  const leaveGroup = (groupId: string) => {
    if (!currentUser) return;
    const newGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(id => id !== currentUser.id),
          moderators: g.moderators.filter(id => id !== currentUser.id)
        };
      }
      return g;
    });
    setGroups(newGroups);
    saveDb({ groups: newGroups });
  };

  const createGroupPost = (
    groupId: string,
    content: string,
    mediaUrl?: string,
    mediaType: 'image' | 'video' | 'gif' | 'none' = 'none'
  ) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      mediaUrl,
      mediaType,
      reactions: {},
      comments: [],
      timestamp: new Date().toISOString(),
      visibility: "public"
    };

    const newGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          posts: [newPost, ...g.posts]
        };
      }
      return g;
    });
    setGroups(newGroups);
    saveDb({ groups: newGroups });
  };

  const uploadGroupFile = (groupId: string, file: Omit<GroupFile, "id">) => {
    const newFile: GroupFile = {
      ...file,
      id: `file_${Date.now()}`
    };
    const newGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          files: [...g.files, newFile]
        };
      }
      return g;
    });
    setGroups(newGroups);
    saveDb({ groups: newGroups });
  };

  // Pages
  const createPage = (name: string, bio: string, category: string, avatar?: string, coverPhoto?: string) => {
    if (!currentUser) return "";
    const pageId = `page_${Date.now()}`;
    const newPage: Page = {
      id: pageId,
      name,
      bio,
      category,
      avatar: avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
      coverPhoto: coverPhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      followers: [currentUser.id],
      adminId: currentUser.id,
      views: 0,
      reach: 0,
      engagement: 0,
      promotions: []
    };

    const newPages = [...pages, newPage];
    setPages(newPages);
    saveDb({ pages: newPages });
    return pageId;
  };

  const followPage = (pageId: string) => {
    if (!currentUser) return;
    const newPages = pages.map(p => {
      if (p.id === pageId) {
        const isFollowing = p.followers.includes(currentUser.id);
        const newFollowers = isFollowing 
          ? p.followers.filter(id => id !== currentUser.id) 
          : [...p.followers, currentUser.id];
        return {
          ...p,
          followers: newFollowers
        };
      }
      return p;
    });
    setPages(newPages);
    saveDb({ pages: newPages });
  };

  const promotePage = (pageId: string, budget: number, duration: number) => {
    const newPages = pages.map(p => {
      if (p.id === pageId) {
        const estReach = budget * 30;
        const newPromo = {
          id: `promo_${Date.now()}`,
          budget,
          duration,
          status: 'active' as const,
          reachEstimate: estReach
        };
        return {
          ...p,
          reach: p.reach + estReach,
          promotions: [...p.promotions, newPromo]
        };
      }
      return p;
    });
    setPages(newPages);
    saveDb({ pages: newPages });
  };

  // Events
  const createEvent = (eventData: Omit<Event, "id" | "attendees" | "interested" | "organizerId">) => {
    if (!currentUser) return "";
    const eventId = `event_${Date.now()}`;
    const newEvent: Event = {
      ...eventData,
      id: eventId,
      organizerId: currentUser.id,
      attendees: [currentUser.id],
      interested: []
    };

    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    saveDb({ events: newEvents });
    return eventId;
  };

  const rsvpEvent = (eventId: string, status: 'attending' | 'interested' | 'none') => {
    if (!currentUser) return;
    const newEvents = events.map(e => {
      if (e.id === eventId) {
        let attendees = [...e.attendees];
        let interested = [...e.interested];

        attendees = attendees.filter(id => id !== currentUser.id);
        interested = interested.filter(id => id !== currentUser.id);

        if (status === 'attending') {
          attendees.push(currentUser.id);
        } else if (status === 'interested') {
          interested.push(currentUser.id);
        }

        return {
          ...e,
          attendees,
          interested
        };
      }
      return e;
    });
    setEvents(newEvents);
    saveDb({ events: newEvents });
  };

  // Marketplace
  const createMarketplaceItem = (itemData: Omit<MarketplaceItem, "id" | "sellerId" | "sellerName" | "sellerAvatar" | "timestamp">) => {
    if (!currentUser) return;
    const newItem: MarketplaceItem = {
      ...itemData,
      id: `market_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      timestamp: new Date().toISOString()
    };

    const newMarket = [newItem, ...marketplace];
    setMarketplace(newMarket);
    saveDb({ marketplace: newMarket });
  };

  const deleteMarketplaceItem = (itemId: string) => {
    const newMarket = marketplace.filter(m => m.id !== itemId);
    setMarketplace(newMarket);
    saveDb({ marketplace: newMarket });
  };

  // Notifications
  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    const newNotifs = notifications.map(n => n.userId === currentUser.id ? { ...n, read: true } : n);
    setNotifications(newNotifs);
    saveDb({ notifications: newNotifs });
  };

  // Reports / Moderation
  const reportItem = (targetType: 'post' | 'comment' | 'user' | 'group', targetId: string, reason: string) => {
    if (!currentUser) return;
    let targetExcerpt = "";
    if (targetType === "post") {
      const p = posts.find(post => post.id === targetId);
      if (p) targetExcerpt = p.content.substring(0, 50);
    }

    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      targetType,
      targetId,
      targetExcerpt,
      reason,
      timestamp: new Date().toISOString(),
      status: "pending"
    };

    const newReports = [newReport, ...reports];
    setReports(newReports);
    saveDb({ reports: newReports });
  };

  const resolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    const newReports = reports.map(r => r.id === reportId ? { ...r, status } : r);
    setReports(newReports);
    saveDb({ reports: newReports });
  };

  const deleteUserByAdmin = (userId: string) => {
    // Cannot delete active admin
    if (userId === "user_admin") return;
    const newUsers = users.filter(u => u.id !== userId);
    setUsers(newUsers);
    // Remove user's posts
    const newPosts = posts.filter(p => p.userId !== userId);
    setPosts(newPosts);
    // Clean reports target or reporter
    const newReports = reports.filter(r => !(r.targetType === 'user' && r.targetId === userId) && r.reporterId !== userId);
    setReports(newReports);
    // Remove from group memberships
    const newGroups = groups.map(g => ({
      ...g,
      members: g.members.filter(id => id !== userId),
      moderators: g.moderators.filter(id => id !== userId)
    }));
    setGroups(newGroups);

    saveDb({ users: newUsers, posts: newPosts, reports: newReports, groups: newGroups });
    
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  return (
    <DbContext.Provider
      value={{
        currentUser,
        users,
        posts,
        stories,
        chats,
        groups,
        pages,
        marketplace,
        events,
        notifications,
        reports,
        login,
        signup,
        logout,
        updateProfile,
        createPost,
        toggleSavePost,
        addReaction,
        addComment,
        deletePost,
        addStory,
        viewStory,
        sendMessage,
        createChat,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        followUser,
        createGroup,
        joinGroup,
        leaveGroup,
        createGroupPost,
        uploadGroupFile,
        createPage,
        followPage,
        promotePage,
        createEvent,
        rsvpEvent,
        createMarketplaceItem,
        deleteMarketplaceItem,
        markNotificationsAsRead,
        reportItem,
        resolveReport,
        deleteUserByAdmin,
        saveDb,
        activeChatIds,
        openChat,
        closeChat
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
};
