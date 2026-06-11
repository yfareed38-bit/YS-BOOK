export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  education: string;
  work: string;
  location: string;
  website: string;
  interests: string[];
  friends: string[]; // User IDs
  followings: string[]; // User IDs
  pendingRequests: string[]; // User IDs of people who sent requests to this user
  sentRequests: string[]; // User IDs of people this user sent requests to
  twoFactorEnabled: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  parentId?: string; // For nested replies
  reactions: { [userId: string]: 'like' | 'love' | 'celebrate' };
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'gif' | 'none';
  reactions: { [userId: string]: 'like' | 'love' | 'celebrate' };
  comments: Comment[];
  timestamp: string;
  visibility: 'public' | 'friends' | 'only_me';
  isScheduled?: boolean;
  scheduleTime?: string;
  pollOptions?: string[];
  pollVotes?: { [userId: string]: number }; // userId -> optionIndex
  savedBy?: string[]; // userIds who saved this post
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  type: 'image' | 'video';
  viewers: string[]; // User IDs
  reactions: { [userId: string]: string };
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  messages: Message[];
  isGroup: boolean;
  name?: string;
  avatar?: string;
}

export interface GroupFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  url: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  coverPhoto: string;
  adminId: string;
  moderators: string[];
  members: string[]; // User IDs
  posts: Post[];
  files: GroupFile[];
  events: string[]; // Event IDs
}

export interface Page {
  id: string;
  name: string;
  bio: string;
  category: string;
  avatar: string;
  coverPhoto: string;
  followers: string[]; // User IDs
  adminId: string;
  views: number;
  reach: number;
  engagement: number;
  promotions: { id: string; budget: number; duration: number; status: 'active' | 'paused' | 'completed'; reachEstimate: number }[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  description: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  category: string;
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  coverPhoto: string;
  organizerId: string;
  attendees: string[]; // User IDs
  interested: string[]; // User IDs
}

export interface Notification {
  id: string;
  userId: string; // Recipient
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'like' | 'comment' | 'friend_request' | 'accept_request' | 'message' | 'group_update' | 'page_invite';
  targetId: string; // Post ID, Group ID, Chat ID, etc.
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'post' | 'comment' | 'user' | 'group';
  targetId: string;
  targetExcerpt?: string; // Preview text of reported item
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
