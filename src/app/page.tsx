"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/store/DbContext";
import { 
  Users, Share2, Compass, TrendingUp, Grid, Shield, 
  Smartphone, Award, BarChart3, Plus, ArrowRight, X, Laptop, MessageSquare, PlayCircle, Calendar, ShoppingBag
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { currentUser, login, signup } = useDb();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/feed");
    }
  }, [currentUser, router]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("demo@ysbook.com");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");

  // Signup Form States
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    work: "",
    education: "",
    location: "",
    website: "",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  });
  const [signupError, setSignupError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const success = login(loginEmail, loginPassword);
    if (success) {
      router.push("/feed");
    } else {
      setLoginError("Invalid email address. Try 'demo@ysbook.com'.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!signupData.name || !signupData.email || !signupData.username) {
      setSignupError("Name, username, and email are required.");
      return;
    }

    try {
      signup({
        name: signupData.name,
        username: signupData.username.toLowerCase().replace(/\s+/g, ""),
        email: signupData.email,
        bio: signupData.bio || "Hello, I am new to YS-BOOK!",
        work: signupData.work || "Professional",
        education: signupData.education || "Graduate",
        location: signupData.location || "Earth",
        website: signupData.website || "",
        avatar: signupData.avatar,
        coverPhoto: signupData.coverPhoto,
        interests: []
      });
      setShowSignupModal(false);
      router.push("/feed");
    } catch (err) {
      setSignupError("Registration failed. Please check details.");
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans overflow-x-hidden bg-[#f0f2f5]">
      {/* SECTION 1 - HERO SECTION */}
      <header className="bg-gradient-to-br from-[#1877f2]/10 via-white to-[#1877f2]/5 pt-12 pb-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo Bar */}
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-4xl font-extrabold text-[#1877f2] tracking-tight hover:scale-105 transition-transform duration-200">
              YS-BOOK
            </h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowSignupModal(true)} 
                className="text-sm font-semibold text-[#1877f2] bg-white border border-[#1877f2]/20 py-2.5 px-5 rounded-full hover:bg-gray-50 transition shadow-sm"
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1c1e21] leading-tight tracking-tight">
                Connect, Share & <br className="hidden sm:inline" />
                <span className="text-[#1877f2] bg-gradient-to-r from-[#1877f2] to-[#3b5998] bg-clip-text text-transparent">Grow Together</span> on YS-BOOK
              </h2>
              <p className="text-lg sm:text-xl text-[#606770] leading-relaxed max-w-xl">
                Join millions of people to connect with friends, communities, businesses and creators around the world.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-[#1877f2] text-white py-3 px-8 rounded-full text-base font-bold shadow-md hover:bg-[#166fe5] transition transform hover:-translate-y-0.5"
                >
                  Create Free Account
                </button>
                <a
                  href="#preview"
                  className="bg-white text-gray-700 py-3 px-8 rounded-full text-base font-bold shadow-sm hover:bg-gray-50 transition border border-gray-200"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Column: Login Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition bg-gray-50/50"
                    />
                  </div>
                  
                  {loginError && (
                    <p className="text-xs text-red-500 font-semibold">{loginError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#1877f2] text-white p-4 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-base"
                  >
                    Log In
                  </button>

                  <div className="text-center py-2 border-b border-gray-100">
                    <a href="#" className="text-xs text-[#1877f2] hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="bg-[#42b72a] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#36a420] transition inline-block text-sm"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-6">
                <strong>Demo Credentials:</strong> Use <code className="bg-gray-200 px-1 py-0.5 rounded text-red-600">demo@ysbook.com</code> with any password.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2 - PLATFORM PREVIEW */}
      <section id="preview" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Experience the Interface</h3>
          <p className="text-[#606770] max-w-2xl mx-auto mb-16 text-lg">
            Immerse yourself in our beautifully tailored workspaces designed for sharing news, storytelling, connecting via Messenger, and hosting groups.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#f0f2f5] p-4 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-white flex items-center justify-center">
                <Laptop className="w-16 h-16 text-[#1877f2] group-hover:scale-110 transition duration-300" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">News Feed</h4>
              <p className="text-sm text-gray-500 mt-2">Publish rich texts, photo and video galleries, and view what your circles are talking about.</p>
            </div>

            <div className="bg-[#f0f2f5] p-4 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-white flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-[#e91e63] group-hover:scale-110 transition duration-300" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Stories Hub</h4>
              <p className="text-sm text-gray-500 mt-2">Post 24-hour vertical clips or slides and react with colorful expressions instantly.</p>
            </div>

            <div className="bg-[#f0f2f5] p-4 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-white flex items-center justify-center">
                <MessageSquare className="w-16 h-16 text-[#00c6ff] group-hover:scale-110 transition duration-300" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Instant Messenger</h4>
              <p className="text-sm text-gray-500 mt-2">Send swift audio responses, files, photos, or chat in floating windows while scrolling.</p>
            </div>

            <div className="bg-[#f0f2f5] p-4 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-white flex items-center justify-center">
                <Users className="w-16 h-16 text-[#4caf50] group-hover:scale-110 transition duration-300" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Groups Circle</h4>
              <p className="text-sm text-gray-500 mt-2">Form private or public circles, host events, and share resource directories easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - WHY CHOOSE YS-BOOK */}
      <section className="py-24 bg-[#f0f2f5] border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-16">Why Choose YS-BOOK</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#1877f2]" />
              </div>
              <h4 className="font-bold text-gray-950 text-xl mb-3">Connect</h4>
              <p className="text-sm text-[#606770] leading-relaxed">
                Build meaningful relationships, add contacts, and explore mutual directories effortlessly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6 text-pink-500" />
              </div>
              <h4 className="font-bold text-gray-950 text-xl mb-3">Share</h4>
              <p className="text-sm text-[#606770] leading-relaxed">
                Publish status updates, images, video assets, and keep your circles close to your everyday moments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-[#4caf50]" />
              </div>
              <h4 className="font-bold text-gray-950 text-xl mb-3">Discover</h4>
              <p className="text-sm text-[#606770] leading-relaxed">
                Explore local business pages, join interesting groups, RSVP to events, and discover classified products.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h4 className="font-bold text-gray-950 text-xl mb-3">Grow</h4>
              <p className="text-sm text-[#606770] leading-relaxed">
                Scale your small business pages, check analytics, run campaigns, and engage with fans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - MAIN FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">An All-In-One Social Hub</h3>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              YS-BOOK gathers a massive array of features to satisfy communities, businesses, creators, and individuals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Laptop, title: "News Feed", desc: "Interactive feed with reactions, nested comments, polls, and sharing." },
              { icon: PlayCircle, title: "Stories", desc: "Vibrant story carousel expiring in 24 hours with view counters." },
              { icon: MessageSquare, title: "Messenger", desc: "Live chat tabs, media sharing, and immediate response automation." },
              { icon: Users, title: "Groups", desc: "Community circles with dedicated moderation and file folders." },
              { icon: Award, title: "Pages", desc: "Professional and creator profiles to build a loyal audience." },
              { icon: Calendar, title: "Events Planner", desc: "Coordinate meetups, invite buddies, and manage calendar RSVPs." },
              { icon: ShoppingBag, title: "Marketplace", desc: "Buy and sell items locally with price and category filtering." },
              { icon: PlayCircle, title: "Live Streaming", desc: "Simulated live events, chat logs, and real-time reactions." }
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1877f2] flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-950 text-base">{f.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - COMMUNITIES */}
      <section className="py-24 bg-[#f0f2f5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Thriving Communities</h3>
          <p className="text-[#606770] max-w-2xl mx-auto mb-16 text-base">
            Explore dedicated segments populated with thousands of interactive community feeds.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Technology & AI", bg: "bg-blue-600" },
              { name: "Sports & Fitness", bg: "bg-green-600" },
              { name: "Global Education", bg: "bg-purple-600" },
              { name: "Business & Venture", bg: "bg-orange-600" },
              { name: "Media & Entertainment", bg: "bg-pink-600" }
            ].map((c, i) => (
              <span 
                key={i} 
                className={`${c.bg} text-white font-bold py-3 px-6 rounded-full text-sm shadow-sm cursor-pointer hover:scale-105 transition-transform duration-150`}
              >
                #{c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - CREATOR & BUSINESS TOOLS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-extrabold text-[#1877f2] uppercase tracking-wider bg-blue-50 py-1.5 px-3 rounded-full">
                For Brands & Artists
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 mb-6 leading-tight">
                Enterprise-Grade Growth <br />& Creator Tools
              </h3>
              <p className="text-[#606770] text-base leading-relaxed mb-8">
                Build your professional footprint using custom Pages, get precise insights regarding views, engagement, and reach, and run focused promotions with budget limits.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Custom Business Pages", desc: "Create your unique logo, bio, category tags, and list links." },
                  { title: "Audience Analytics", desc: "Track daily reach, follower increments, and average views." },
                  { title: "Promotions Panel", desc: "Boost your page with flexible budgets and clear predictions." }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1877f2] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-950 text-base">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1877f2]/10 to-transparent p-8 rounded-3xl border border-blue-100 flex flex-col items-center">
              <BarChart3 className="w-32 h-32 text-[#1877f2] mb-6 animate-pulse" />
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-full max-w-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400">PAGE INSIGHTS</span>
                  <span className="text-xs font-extrabold text-green-500">+24% this week</span>
                </div>
                <div className="h-4 bg-[#f0f2f5] rounded-full overflow-hidden mb-2">
                  <div className="w-[78%] h-full bg-[#1877f2] rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Reach: 5.3K</span>
                  <span>Followers: +480</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - MOBILE APPS */}
      <section className="py-24 bg-[#f0f2f5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-4">YS-BOOK Mobile Experience</h3>
          <p className="text-[#606770] max-w-xl mx-auto mb-12 text-base">
            Never miss a notification. Access your feed, chat rooms, and stories on the move with our Android and iOS applications.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-black text-white py-3 px-6 rounded-xl flex items-center gap-3 shadow-md hover:bg-gray-900 transition text-left">
              <Smartphone className="w-6 h-6 text-white" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Download on the</p>
                <p className="text-sm font-bold -mt-0.5">App Store</p>
              </div>
            </button>
            
            <button className="bg-black text-white py-3 px-6 rounded-xl flex items-center gap-3 shadow-md hover:bg-gray-900 transition text-left">
              <Smartphone className="w-6 h-6 text-white" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Get it on</p>
                <p className="text-sm font-bold -mt-0.5">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8 - TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold text-gray-900 text-center mb-16">Stories from the Community</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "YS-BOOK has completely changed how our developer workspace operates. The file directories inside groups and instant chat make coordination seamless.",
                author: "Sarah J.",
                role: "Core Tech Lead"
              },
              {
                text: "I set up my custom creator page, uploaded my vlogs, and hit over 18,000 weekly reach within days. The integrated analytics tool is super intuitive.",
                author: "David L.",
                role: "Digital Vlogger"
              },
              {
                text: "The Marketplace has made local classification ads reliable and neat. I listed my office chair and sold it within four hours! Highly recommend.",
                author: "Emma R.",
                role: "Local Community Leader"
              }
            ].map((t, i) => (
              <div key={i} className="bg-[#f0f2f5] p-8 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <p className="text-sm text-gray-600 italic">"{t.text}"</p>
                <div className="mt-6">
                  <h5 className="font-bold text-gray-950 text-base">{t.author}</h5>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 - STATISTICS */}
      <section className="py-16 bg-[#1877f2] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-black mb-2">1M+</p>
              <p className="text-xs sm:text-sm text-blue-100 uppercase tracking-widest font-bold">Active Users</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black mb-2">500K+</p>
              <p className="text-xs sm:text-sm text-blue-100 uppercase tracking-widest font-bold">Daily Posts</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black mb-2">10K+</p>
              <p className="text-xs sm:text-sm text-blue-100 uppercase tracking-widest font-bold">Groups & Pages</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black mb-2">100+</p>
              <p className="text-xs sm:text-sm text-blue-100 uppercase tracking-widest font-bold">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 - FINAL CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="text-4xl font-extrabold text-gray-950 tracking-tight">Join the YS-BOOK Community Today</h3>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            Create your account to start writing updates, networking inside groups, uploading videos, and marketing your services.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={() => setShowSignupModal(true)}
              className="bg-[#1877f2] text-white py-3.5 px-8 rounded-full text-base font-bold shadow-md hover:bg-[#166fe5] transition transform hover:-translate-y-0.5"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 space-y-4">
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookies Policy</a>
            <a href="#" className="hover:underline">Ad Choices</a>
            <a href="#" className="hover:underline">Careers</a>
            <a href="#" className="hover:underline">Developers</a>
          </div>
          <p>© 2026 YS-BOOK, Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* SIGNUP MODAL */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-950">Sign Up</h3>
                <p className="text-xs text-gray-400 mt-1">It's quick and easy.</p>
              </div>
              <button 
                onClick={() => setShowSignupModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSignup} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="janedoe"
                    value={signupData.username}
                    onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Bio / Catchphrase</label>
                <textarea
                  placeholder="Tell people about yourself..."
                  rows={2}
                  value={signupData.bio}
                  onChange={(e) => setSignupData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Occupation / Work</label>
                  <input
                    type="text"
                    placeholder="Software Engineer"
                    value={signupData.work}
                    onChange={(e) => setSignupData(prev => ({ ...prev, work: e.target.value }))}
                    className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
                  <input
                    type="text"
                    placeholder="Stanford University"
                    value={signupData.education}
                    onChange={(e) => setSignupData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={signupData.location}
                    onChange={(e) => setSignupData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Website Link</label>
                  <input
                    type="url"
                    placeholder="https://mysite.com"
                    value={signupData.website}
                    onChange={(e) => setSignupData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1877f2] bg-gray-50/50 text-sm"
                  />
                </div>
              </div>

              {signupError && (
                <p className="text-xs text-red-500 font-bold">{signupError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#42b72a] text-white p-4 rounded-xl font-bold hover:bg-[#36a420] transition shadow-md text-base"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
