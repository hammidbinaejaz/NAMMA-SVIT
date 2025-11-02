"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Scan, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";

// Mock QR code component (install qrcode.react for production)
function QRCodeDisplay({ value }: { value: string }) {
  // For demo, we'll use a placeholder
  // Install: npm install qrcode.react @types/qrcode.react
  // Then use: import { QRCodeSVG } from "qrcode.react";
  
  return (
    <div className="w-64 h-64 bg-white p-4 rounded-lg border-2 border-border flex items-center justify-center">
      <div className="text-center">
        <QrCode className="w-32 h-32 mx-auto text-primary/20" />
        <p className="text-xs text-textSecondary mt-2">QR Code Placeholder</p>
        <p className="text-xs text-textSecondary/60 mt-1">{value.substring(0, 20)}...</p>
      </div>
    </div>
  );
}

export default function QRAttendance() {
  const [qrData, setQrData] = useState<string>("");
  const [scanMode, setScanMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Generate QR data for current class/session
    const classId = "1"; // In production, get from context
    const sessionId = Date.now().toString();
    const qrValue = JSON.stringify({
      classId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: "attendance",
    });
    setQrData(qrValue);
  }, []);

  const handleScan = () => {
    setScanMode(true);
    setScanned(false);
    
    // Mock scan - in production, use camera API
    setTimeout(() => {
      setScanned(true);
      setScanMode(false);
      toast.success("✅ Attendance marked successfully!");
    }, 2000);
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
    toast.info("New QR code generated");
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-textPrimary">QR Attendance</h3>
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
            className="text-center"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-dashed border-primary flex items-center justify-center mb-4">
              {scanned ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">Scanned!</p>
                </motion.div>
              ) : (
                <Scan className="w-16 h-16 text-primary animate-pulse" />
              )}
            </div>
            <p className="text-sm text-textSecondary">
              {scanned ? "Attendance marked!" : "Scanning QR code..."}
            </p>
            <button
              onClick={() => setScanMode(false)}
              className="mt-4 text-xs text-textSecondary hover:text-primary"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <>
            <QRCodeDisplay value={qrData} />
            <div className="text-center">
              <p className="text-sm text-textSecondary mb-4">
                Display this QR code for students to scan
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleScan}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  Scan QR
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 p-4 bg-background rounded-lg">
        <p className="text-xs font-medium text-textPrimary mb-2">How it works:</p>
        <ul className="text-xs text-textSecondary space-y-1">
          <li>1. Generate QR code for your class session</li>
          <li>2. Display on screen/projector</li>
          <li>3. Students scan with their devices</li>
          <li>4. Attendance automatically marked</li>
        </ul>
      </div>
    </div>
  );
}

