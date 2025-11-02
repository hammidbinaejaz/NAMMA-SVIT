"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  class: { id: number; name: string } | null;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    classId: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error("API Error:", errorData);
        toast.error(errorData.error || "Failed to load events");
        return;
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          classId: formData.classId ? parseInt(formData.classId) : null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let result;
        try {
          result = JSON.parse(errorText);
        } catch {
          result = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error("Save error:", result);
        toast.error(result.error || "Failed to save event");
        return;
      }

      const result = await response.json();
      toast.success(editingEvent ? "Event updated successfully!" : "Event created successfully!");
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      await fetchEvents();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save event. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        let result;
        try {
          result = JSON.parse(errorText);
        } catch {
          result = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error("Delete error:", result);
        toast.error(result.error || "Failed to delete event");
        return;
      }

      toast.success("Event deleted successfully!");
      await fetchEvents();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete event. Please try again.");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    setFormData({
      title: event.title,
      description: event.description,
      startTime: startDate.toISOString().slice(0, 16),
      endTime: endDate.toISOString().slice(0, 16),
      classId: event.class?.id.toString() || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
    setFormData({
      title: "",
      description: "",
      startTime: now.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
      classId: "",
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-svitPrimary">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-svitPrimary">Manage Events</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="bg-svitAccent hover:bg-svitAccentDark text-white px-4 py-2 rounded-md font-medium"
        >
          + Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-svitPrimary">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Class ID (optional)
              </label>
              <input
                type="number"
                value={formData.classId}
                onChange={(e) =>
                  setFormData({ ...formData, classId: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-svitPrimary hover:bg-svitPrimaryDark text-white px-6 py-2 rounded-md font-medium"
              >
                {editingEvent ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-svitPrimary text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Start Time</th>
              <th className="p-3 text-left">End Time</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b hover:bg-svitLight transition-colors"
              >
                <td className="p-3 font-medium">{event.title}</td>
                <td className="p-3 text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </td>
                <td className="p-3">
                  {new Date(event.startTime).toLocaleString()}
                </td>
                <td className="p-3">
                  {new Date(event.endTime).toLocaleString()}
                </td>
                <td className="p-3">{event.class?.name || "All"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-svitAccent hover:bg-svitAccentDark text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


