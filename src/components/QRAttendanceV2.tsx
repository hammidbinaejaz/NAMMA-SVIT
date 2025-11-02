"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Scan, CheckCircle2, XCircle, Shield } from "lucide-react";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import { Activity } from "lucide-react";

interface ScanResult {
  studentId: string;
  studentName: string;
  timestamp: Date;
  duplicate: boolean;
}

export default function QRAttendanceV2() {
  const [qrData, setQrData] = useState<string>("");
  const [scanMode, setScanMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    // Generate QR data
    const classId = "1";
    const sessionId = Date.now().toString();
    const qrValue = JSON.stringify({
      classId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: "attendance",
    });
    setQrData(qrValue);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FACC15", "#2563EB", "#10B981"],
    });
  };

  const handleScan = () => {
    setScanMode(true);
    setScanned(false);

    // Mock scan
    setTimeout(() => {
      const mockStudentId = `student-${Date.now()}`;
      const mockStudentName = "Student " + Math.floor(Math.random() * 100);
      
      // Check if already scanned (duplicate detection)
      const isDuplicate = scanResults.some(
        (r) => r.studentId === mockStudentId
      );

      if (isDuplicate) {
        toast.error("❌ Duplicate scan detected! Student already marked present.");
        setScanMode(false);
        return;
      }

      const result: ScanResult = {
        studentId: mockStudentId,
        studentName: mockStudentName,
        timestamp: new Date(),
        duplicate: false,
      };

      setScanResults([...scanResults, result]);
      setScanned(true);
      triggerConfetti();
      toast.success("✅ Attendance marked successfully!");

      setTimeout(() => {
        setScanMode(false);
        setScanned(false);
      }, 2000);
    }, 1500);
  };

  const generateNewQR = () => {
    const classId = "1";
    const sessionId = Date.now().toString();
    const qrValue = JSON.stringify({
      classId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: "attendance",
    });
    setQrData(qrValue);
    setScanResults([]);
    toast.info("New QR code generated");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 p-6 shadow-[0_8px_32px_rgba(37,99,235,0.2)]">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-purple-600/0 animate-pulse" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-textPrimary">QR Attendance v2</h3>
          </div>
          <button
            onClick={generateNewQR}
            className="text-xs text-primary hover:underline"
          >
            Generate New
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          {scanMode ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-dashed border-blue-400 flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-purple-600/0 animate-pulse" />
                {scanned ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-center relative z-10"
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-2 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                    <p className="text-lg font-medium text-green-300">Scan Successful!</p>
                  </motion.div>
                ) : (
                  <Scan className="w-20 h-20 text-blue-400 animate-pulse relative z-10" />
                )}
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setScanMode(false)}
                  className="text-xs text-textSecondary hover:text-primary mt-4"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* QR Code Display */}
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 flex items-center justify-center p-4">
                <div className="text-center">
                  <QrCode className="w-32 h-32 mx-auto text-primary/30 mb-2" />
                  <p className="text-xs text-textSecondary mt-2">QR Code Placeholder</p>
                  <p className="text-xs text-textSecondary/60 mt-1 font-mono">
                    {qrData.substring(0, 30)}...
                  </p>
                </div>
              </div>

              <div className="text-center w-full">
                <p className="text-sm text-textSecondary mb-4">
                  Display this QR code for students to scan
                </p>
                <button
                  onClick={handleScan}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.4)] flex items-center gap-2 mx-auto"
                >
                  <Scan className="w-5 h-5" />
                  Scan QR
                </button>
              </div>
            </>
          )}

          {/* Live Scan Results */}
          {scanResults.length > 0 && (
            <div className="w-full mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-semibold text-textPrimary mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Live Scans ({scanResults.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {scanResults.slice(-5).map((result, idx) => (
                    <motion.div
                      key={result.studentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between text-xs p-2 bg-green-500/10 rounded border border-green-500/20"
                    >
                      <span className="text-textPrimary">{result.studentName}</span>
                      <span className="text-green-400">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="w-full mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs font-medium text-textPrimary mb-2">Smart Features:</p>
            <ul className="text-xs text-textSecondary space-y-1">
              <li className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-400" />
                Duplicate scan detection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                Auto-update without refresh
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                Instant attendance marking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

