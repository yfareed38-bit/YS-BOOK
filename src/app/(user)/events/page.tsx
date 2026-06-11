"use client";

import React, { useState } from "react";
import { useDb } from "@/store/DbContext";
import { Calendar, Plus, X, MapPin, Clock, Users, Check, Sparkles } from "lucide-react";

export default function EventsPage() {
  const { currentUser, events, rsvpEvent, createEvent, users } = useDb();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");

  if (!currentUser) return null;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    createEvent({
      title: title.trim(),
      date,
      time: time || "12:00",
      location: location.trim() || "TBD",
      description: description.trim() || "No description provided.",
      coverPhoto: coverPhoto.trim() || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
    });

    // Reset
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
    setCoverPhoto("");
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#1877f2]" />
          <h2 className="text-lg font-black text-gray-950 dark:text-white">Events Planner</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#1877f2] text-white hover:bg-[#166fe5] font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* EVENTS FEED */}
      <div className="space-y-6">
        {events.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-12 italic">No upcoming events planned.</p>
        ) : (
          events.map((event) => {
            const isGoing = event.attendees.includes(currentUser.id);
            const isInterested = event.interested.includes(currentUser.id);

            return (
              <div 
                key={event.id}
                className="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/40 overflow-hidden"
              >
                {/* Cover Photo */}
                <div className="h-40 sm:h-52 relative bg-gray-100 dark:bg-zinc-800">
                  <img
                    src={event.coverPhoto}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white dark:bg-zinc-900 rounded-xl px-3.5 py-1.5 shadow-md text-center shrink-0 border border-gray-150">
                    <span className="text-[10px] font-extrabold text-blue-500 uppercase block leading-none">
                      {new Date(event.date).toLocaleDateString([], { month: 'short' })}
                    </span>
                    <span className="text-lg font-black text-gray-800 dark:text-white block mt-0.5 leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{event.attendees.length} attending</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Attendance Avatar Pile */}
                  {event.attendees.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                      <div className="flex -space-x-2.5 overflow-hidden">
                        {event.attendees.slice(0, 5).map(id => {
                          const u = users.find(user => user.id === id);
                          return u ? (
                            <img
                              key={id}
                              src={u.avatar}
                              alt={u.name}
                              className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white dark:ring-[#242526] object-cover shrink-0"
                            />
                          ) : null;
                        })}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">
                        Attending: {event.attendees.map(id => {
                          const u = users.find(user => user.id === id);
                          return u ? u.name.split(" ")[0] : "Anonymous";
                        }).join(", ")}
                      </span>
                    </div>
                  )}

                  {/* RSVP Buttons bar */}
                  <div className="flex gap-2 pt-2 select-none border-t border-gray-100 dark:border-zinc-800">
                    <button
                      onClick={() => rsvpEvent(event.id, 'attending')}
                      className={`flex-1 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                        isGoing
                          ? "bg-green-500 text-white shadow-sm"
                          : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white"
                      }`}
                    >
                      {isGoing && <Check className="w-4 h-4" />}
                      <span>{isGoing ? "Going" : "Mark Going"}</span>
                    </button>

                    <button
                      onClick={() => rsvpEvent(event.id, 'interested')}
                      className={`flex-1 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                        isInterested
                          ? "bg-yellow-500 text-white shadow-sm"
                          : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white"
                      }`}
                    >
                      {isInterested && <Sparkles className="w-4 h-4 text-white" />}
                      <span>{isInterested ? "Interested" : "Mark Interested"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-gray-950 dark:text-white">Create New Event</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-655"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="p-5 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextJS Roundtable"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-1 focus:ring-[#1877f2] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Location / Online Link</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, TechSpace"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Description</label>
                <textarea
                  placeholder="Event details..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Cover Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverPhoto}
                  onChange={(e) => setCoverPhoto(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1877f2] text-white p-3.5 rounded-xl font-bold hover:bg-[#166fe5] transition shadow-md text-xs font-bold"
              >
                Schedule Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
