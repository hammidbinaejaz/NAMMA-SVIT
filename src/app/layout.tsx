import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/lib/suppressWarnings"; // Suppress harmless React warnings
import NProgressProvider from "@/components/NProgressProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NAMMA SVIT | ERP Portal",
  description: "Empowering Students & Faculty through Digital Innovation - Sai Vidya Institute of Technology ERP Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NProgressProvider>
          {children}
        </NProgressProvider>
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
