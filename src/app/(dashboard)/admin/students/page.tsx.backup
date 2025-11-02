"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Teacher {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
}

export default function AdminFacultyPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "O+",
    sex: "MALE",
    birthday: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teachers");
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error("API Error:", errorData);
        toast.error(errorData.error || "Failed to load faculty");
        return;
      }
      
      const data = await response.json();
      setTeachers(data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Failed to load faculty. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTeacher
        ? `/api/teachers/${editingTeacher.id}`
        : "/api/teachers";
      const method = editingTeacher ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        toast.error(result.error || "Failed to save faculty");
        return;
      }

      const result = await response.json();
      toast.success(
        editingTeacher ? "Faculty updated successfully!" : "Faculty created successfully!"
      );
      setShowForm(false);
      setEditingTeacher(null);
      resetForm();
      await fetchTeachers();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save faculty. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?"))
      return;

    try {
      const response = await fetch(`/api/teachers/${id}`, {
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
        toast.error(result.error || "Failed to delete faculty");
        return;
      }

      toast.success("Faculty deleted successfully!");
      await fetchTeachers();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete faculty. Please try again.");
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      username: teacher.username,
      password: "",
      name: teacher.name,
      surname: teacher.surname,
      email: teacher.email || "",
      phone: teacher.phone || "",
      address: "",
      bloodType: "O+",
      sex: "MALE",
      birthday: "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
      bloodType: "O+",
      sex: "MALE",
      birthday: "",
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-svitPrimary">Loading faculty...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-svitPrimary">
          Manage Faculty
        </h1>
        <button
          onClick={() => {
            resetForm();
            setEditingTeacher(null);
            setShowForm(true);
          }}
          className="bg-svitAccent hover:bg-svitAccentDark text-white px-4 py-2 rounded-md font-medium"
        >
          + Add Faculty
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-svitPrimary">
            {editingTeacher ? "Edit Faculty" : "Add New Faculty"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {editingTeacher
                    ? "New Password (leave blank to keep)"
                    : "Password *"}
                </label>
                <input
                  type="password"
                  required={!editingTeacher}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Surname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.surname}
                  onChange={(e) =>
                    setFormData({ ...formData, surname: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-svitPrimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
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
                {editingTeacher ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTeacher(null);
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
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b hover:bg-svitLight transition-colors"
              >
                <td className="p-3">
                  {teacher.name} {teacher.surname}
                </td>
                <td className="p-3">{teacher.username}</td>
                <td className="p-3">{teacher.email || "-"}</td>
                <td className="p-3">{teacher.phone || "-"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="bg-svitAccent hover:bg-svitAccentDark text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
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


