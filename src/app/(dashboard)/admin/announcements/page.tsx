"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  class: { id: number; name: string } | null;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements");
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error("API Error:", errorData);
        toast.error(errorData.error || "Failed to load announcements");
        return;
      }
      
      const data = await response.json();
      setAnnouncements(data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Failed to load announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAnnouncement
        ? `/api/announcements/${editingAnnouncement.id}`
        : "/api/announcements";
      const method = editingAnnouncement ? "PUT" : "POST";

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
        toast.error(result.error || "Failed to save announcement");
        return;
      }

      const result = await response.json();
      toast.success(
        editingAnnouncement
          ? "Announcement updated successfully!"
          : "Announcement created successfully!"
      );
      setShowForm(false);
      setEditingAnnouncement(null);
      resetForm();
      await fetchAnnouncements();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save announcement. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
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
        toast.error(result.error || "Failed to delete announcement");
        return;
      }

      toast.success("Announcement deleted successfully!");
      await fetchAnnouncements();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete announcement. Please try again.");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      classId: announcement.class?.id.toString() || "",
      date: new Date(announcement.date).toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      classId: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-svitPrimary">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-svitPrimary">
          Manage Announcements
        </h1>
        <button
          onClick={() => {
            resetForm();
            setEditingAnnouncement(null);
            setShowForm(true);
          }}
          className="bg-svitAccent hover:bg-svitAccentDark text-white px-4 py-2 rounded-md font-medium"
        >
          + Add Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-svitPrimary">
            {editingAnnouncement
              ? "Edit Announcement"
              : "Add New Announcement"}
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
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
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
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-svitPrimary hover:bg-svitPrimaryDark text-white px-6 py-2 rounded-md font-medium"
              >
                {editingAnnouncement ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAnnouncement(null);
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
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr
                key={announcement.id}
                className="border-b hover:bg-svitLight transition-colors"
              >
                <td className="p-3 font-medium">{announcement.title}</td>
                <td className="p-3 text-sm text-gray-600 line-clamp-2">
                  {announcement.description}
                </td>
                <td className="p-3">
                  {new Date(announcement.date).toLocaleDateString()}
                </td>
                <td className="p-3">{announcement.class?.name || "All"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="bg-svitAccent hover:bg-svitAccentDark text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
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


