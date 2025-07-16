"use client";

import { useRouter } from "next/navigation";

export default function Redirect() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <h1 className="mb-6 text-center text-2xl font-semibold">
        You are not allowed to access this page.
      </h1>
      <button
        onClick={() => router.back()}
        className="font-bold cursor-pointer flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow hover:bg-gray-200 text-black"
      >
        <span>Go Back</span>
      </button>
    </div>
  );
}
