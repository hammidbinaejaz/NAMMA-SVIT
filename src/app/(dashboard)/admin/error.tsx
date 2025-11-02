"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Admin Page Error
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || "An error occurred in the admin section."}
        </p>
        <button
          onClick={() => reset()}
          className="bg-svitPrimary hover:bg-svitPrimaryDark text-white px-4 py-2 rounded-md font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}



