"use client";

import React, { useState } from "react";
import { socket } from "../socket";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const SignOut = ({
  btnType = "popup",
  user,
}: {
  btnType?: "large" | "popup";
  user?: string;
}) => {
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  const logout = () => {
    socket.disconnect();
    signOut({ redirectUrl: "/sign-in" });
  };

  if (btnType === "large") {
    return (
      <button
        onClick={logout}
        className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4 cursor-pointer"
      >
        <img src="/icons/back.svg" alt="Sign Out" className="w-6 h-6" />
        <span className="hidden xxl:inline">Sign Out</span>
      </button>
    );
  }

  // Default to popout button
  return (
    <div className=" inline-block text-left">
      {/* trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer p-2 rounded-full hover:bg-gray-800"
      >
        ...
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute bottom-full left-0 mb-4 inline-block">
          <div
            className="
            hover:bg-gray-700
              bg-black
              text-white
              rounded-lg
              p-4
              shadow-lg
              relative

              ring-2
              ring-white
              ring-opacity-50   
              
              drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]  /* white glow */
            "
          >
            <button
              className="cursor-pointer  rounded px-2 py-1"
              onClick={logout}
            >
              Log out @{user}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOut;
