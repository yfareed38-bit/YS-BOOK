"use client";

import React, { useState } from "react";
import { useDb } from "@/store/DbContext";
import { MarketplaceItem } from "@/store/types";
import { 
  ShoppingBag, Plus, X, Search, Filter, 
  MapPin, Tag, MessageSquare, Trash2, ArrowRight 
} from "lucide-react";

export default function MarketplacePage() {
  const { currentUser, marketplace, createMarketplaceItem, deleteMarketplaceItem, createChat, openChat } = useDb();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceMax, setPriceMax] = useState<number>(2000);

  // Modals states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  // Create Item form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  if (!currentUser) return null;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !image.trim()) return;

    createMarketplaceItem({
      title: title.trim(),
      price: Number(price),
      image: image.trim(),
      location: location.trim() || "Local",
      description: description.trim() || "No description provided.",
      category
    });

    // Reset
    setTitle("");
    setPrice("");
    setLocation("");
    setCategory("Electronics");
    setDescription("");
    setImage("");
    setShowCreateModal(false);
  };

  const handleMessageSeller = (sellerId: string) => {
    setSelectedItem(null);
    const chatId = createChat([sellerId]);
    openChat(chatId);
  };

  // Filter listings
  const filteredItems = marketplace.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesPrice = item.price <= priceMax;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ["All", "Electronics", "Cameras & Video", "Home Goods & Furniture", "Vehicles", "Apparel"];

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left select-none">
      {/* LEFT COLUMN: FILTERS PANEL */}
      <div className="lg:col-span-4 bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-base text-gray-950 dark:text-white flex items-center gap-1.5">
            <ShoppingBag className="w-5 h-5 text-[#1877f2]" />
            <span>Classifieds</span>
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-zinc-800 text-[#1877f2] rounded-full transition"
            title="List an Item"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs ml-2 w-full text-gray-800 dark:text-gray-250"
          />
        </div>

        {/* Category List */}
        <div>
          <h4 className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Categories</span>
          </h4>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? "bg-blue-50 dark:bg-blue-950/20 text-[#1877f2] font-bold"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="px-1 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-450">Max Price</span>
            <span className="font-black text-[#1877f2]">${priceMax}</span>
          </div>
          <input
            type="range"
            min="10"
            max="3000"
            step="10"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1877f2]"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: LISTINGS GRID */}
      <div className="lg:col-span-8">
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-[#242526] p-12 rounded-2xl border text-center shadow-sm">
            <p className="text-sm text-gray-500 font-semibold italic">No marketplace items match your criteria.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 overflow-hidden cursor-pointer hover:shadow-md transition duration-200"
              >
                {/* Product image */}
                <div className="h-44 relative bg-gray-100 dark:bg-zinc-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1877f2] text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow">
                    ${item.price}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 text-left space-y-2">
                  <h4 className="font-bold text-xs text-gray-950 dark:text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-gray-450 font-bold">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {item.location}</span>
                    <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE LISTING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/20">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">List an Item for Sale</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-655"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateItem} className="p-5 space-y-4 text-left max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 14 Pro, Leather Jacket"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block">Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none cursor-pointer"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Cameras & Video">Cameras & Video</option>
                    <option value="Home Goods & Furniture">Home Goods & Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block">Product Photo URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block">Description</label>
                <textarea
                  placeholder="Specify item condition, specifications, reasons for selling..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs"
              >
                List Item for Sale
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-[#242526] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            {/* Image header */}
            <div className="h-56 sm:h-72 relative bg-gray-100 dark:bg-zinc-800">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Description & info panel */}
            <div className="p-5 space-y-4 text-left">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-950 dark:text-white leading-tight">
                    {selectedItem.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedItem.category}</span> · 
                    <span>Listed on {new Date(selectedItem.timestamp).toLocaleDateString()}</span>
                  </span>
                </div>
                <span className="text-xl font-black text-[#1877f2] shrink-0">${selectedItem.price}</span>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
                {selectedItem.description}
              </p>

              <hr className="border-gray-100 dark:border-zinc-800" />

              {/* Seller details row */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2.5 items-center">
                  <img
                    src={selectedItem.sellerAvatar}
                    alt={selectedItem.sellerName}
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-gray-950 dark:text-white leading-tight">
                      {selectedItem.sellerName}
                    </h5>
                    <span className="text-[9px] text-gray-450 flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {selectedItem.location}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {currentUser.id !== selectedItem.sellerId && (
                    <button
                      onClick={() => handleMessageSeller(selectedItem.sellerId)}
                      className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Seller</span>
                    </button>
                  )}

                  {(currentUser.id === selectedItem.sellerId || currentUser.id === "user_admin") && (
                    <button
                      onClick={() => {
                        deleteMarketplaceItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded-xl transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
