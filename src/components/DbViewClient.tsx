"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Database, Users, UserCheck, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

interface DbViewClientProps {
  initialData: {
    students: any[];
    parents: any[];
    classes: any[];
  };
}

export default function DbViewClient({ initialData }: DbViewClientProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setLoading(true);
    router.refresh();
    // Simulate refresh delay
    setTimeout(() => setLoading(false), 500);
  };

  const TableSkeleton = () => (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-[#FFD24A]" />
          <div>
            <h1 className="text-2xl font-semibold text-white">Database View</h1>
            <p className="text-sm text-gray-400">Quick preview of records</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFD24A]/20 hover:bg-[#FFD24A]/30 text-[#FFD24A] rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FFD24A]" />
            <h2 className="font-semibold text-white">Students ({data.students.length})</h2>
          </div>
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {data.students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm"
                >
                  <div className="font-medium text-white">
                    {student.name} {student.surname}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {student.username} • {student.class?.name || "No Class"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Parents */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-[#FFD24A]" />
            <h2 className="font-semibold text-white">Parents ({data.parents.length})</h2>
          </div>
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {data.parents.map((parent) => (
                <div
                  key={parent.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm"
                >
                  <div className="font-medium text-white">
                    {parent.name} {parent.surname}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {parent.username} • {parent.email || "No email"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Classes */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-[#FFD24A]" />
            <h2 className="font-semibold text-white">Classes ({data.classes.length})</h2>
          </div>
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {data.classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm"
                >
                  <div className="font-medium text-white">{classItem.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {classItem._count.students}/{classItem.capacity} students
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

