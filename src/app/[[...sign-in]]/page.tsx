"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Login successful!");
        router.push(data.redirect || `/${data.user.role}`);
        router.refresh();
      } else {
        toast.error(data.error || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-svitLight">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-lg shadow-2xl flex flex-col gap-4 border border-svitLightGray min-w-[400px]"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <Image src="/logo.png" alt="SVIT Logo" width={48} height={48} />
          <h1 className="text-2xl font-bold text-svitPrimary">NAMMA SVIT</h1>
          <p className="text-sm text-gray-500">ERP Portal</p>
        </div>
        <h2 className="text-gray-600 text-center font-medium">
          Sign in to your account
        </h2>
        <p className="text-xs text-gray-500 text-center">
          Empowering Students & Faculty through Digital Innovation
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-600 font-medium">Username</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-svitPrimary outline-none"
            placeholder="Enter your username"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-600 font-medium">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-svitPrimary outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-svitPrimary hover:bg-svitPrimaryDark text-white my-1 rounded-md text-sm p-[10px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          Forgot password? Contact IT Department
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
