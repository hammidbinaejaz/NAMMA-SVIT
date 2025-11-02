"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-svitLight p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-svitPrimary mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="bg-svitPrimary hover:bg-svitPrimaryDark text-white px-6 py-2 rounded-md font-medium"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}


