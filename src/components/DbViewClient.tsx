"use client";

import { useEffect, useState } from "react";

interface DbViewClientProps {
  initialData?: {
    students?: any[];
    parents?: any[];
    classes?: any[];
  };
}

export default function DbViewClient({ initialData }: DbViewClientProps) {
  const [students, setStudents] = useState<any[]>(initialData?.students || []);
  const [loading, setLoading] = useState(!initialData);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students?preview=true");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch DB data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) fetchData();
  }, []);

  if (loading) return <p className="text-gray-400">Loading students...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">Database View</h1>
      <button
        onClick={fetchData}
        className="mb-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
      >
        Refresh
      </button>
      <table className="min-w-full text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            <th className="py-2">ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-gray-800">
              <td className="py-2">{s.id}</td>
              <td>{s.name}</td>
              <td>{s.username}</td>
              <td>{s.class?.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

