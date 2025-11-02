"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Users, Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { PerformanceBadge } from "@/components/PerformancePredictor";

export default function Page() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        toast.error("Failed to fetch students");
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <Users className="w-6 h-6" /> Students ({students.length})
        </h1>
        <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-b border-gray-500 focus:border-yellow-500 outline-none p-2 text-gray-200"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p className="text-gray-400 text-sm mt-6">No students found.</p>
      ) : (
        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6"
        >
          {filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              layout
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-yellow-400">
                  {student.name}
                </h2>
                <p className="text-sm text-gray-400">{student.department}</p>
              </div>
              <div className="flex justify-between items-center mt-3 text-gray-400">
                <PerformanceBadge performance={student.performance} />

		<div className="flex gap-2">
                  <Edit2 className="w-4 h-4 cursor-pointer hover:text-yellow-400" />
                  <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

