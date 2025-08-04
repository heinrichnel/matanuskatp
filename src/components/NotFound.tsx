import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404</h1>
      <p className="text-lg text-gray-600">Page Not Found</p>
    </div>
  );
}
