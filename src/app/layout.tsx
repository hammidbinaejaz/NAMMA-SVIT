import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

// ✅ Load Inter font
const inter = Inter({ subsets: ["latin"] });

// ✅ Metadata for SEO + production safety
export const metadata: Metadata = {
  title: "NAMMA SVIT | ERP Portal",
  description: "Smart ERP platform for SVIT – built with Next.js and Prisma.",
  icons: {
    icon: "/favicon.ico",
  },
};

// ✅ Server Component (⚠ no "use client" here)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-[#0b0b0b] dark:text-white`}>
        {/* Theme + toast notifications */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

