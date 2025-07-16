"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "@/components/Image";
import { useActionState } from "react";
import { deletePost } from "@/action";

//TODO: just a static image of the ... in top right
function PostInfo({
  postId,
  usersPost,
}: {
  postId: number;
  usersPost: boolean | undefined;
}) {
  const [open, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(deletePost, {
    success: false,
    error: false,
  });

  const deleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const targetNode = e.target as Node;
      if (!deleteRef.current?.contains(targetNode)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  });

  return (
    <>
      <div className="cursor-pointer w-4 h-4 relative">
        <div onClick={() => setIsOpen(!open)}>
          <Image path="icons/infoMore.svg" alt="" w={16} h={16} />
        </div>
        {open && (
          <div className="absolute bottom-full right-0 top-0 mb-4  z-10">
            <div
              className="
          bg-black
          text-white
          rounded-lg
          shadow-lg
          drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
            "
            >
              <ul className="w-full">
                <li>
                  <button
                    ref={deleteRef}
                    className="px-4 block w-full cursor-pointer rounded py-1 whitespace-nowrap hover:bg-red-500 "
                  >
                    Follow User
                  </button>{" "}
                  {/* ONLY WANT TO PROVIDE THIS DELETE POST BUTTON IF IT IS ONE OF THE USERS */}
                  {usersPost && (
                    <form action={formAction}>
                      <input
                        readOnly
                        className="hidden"
                        type="text"
                        name="postId"
                        value={postId}
                      />
                      <button
                        ref={deleteRef}
                        disabled={isPending}
                        type="submit"
                        className="px-4 block w-full cursor-pointer rounded py-1 whitespace-nowrap hover:bg-red-500 "
                      >
                        Delete Post
                      </button>
                    </form>
                  )}
                  {/* {isPending && <p>PENDING</p>} */}
                  {/* ONLY WANT TO PROVIDE THIS DELETE POST BUTTON IF IT IS ONE OF THE USERS */}
                </li>
              </ul>
              {/* INCLUDE OPTION TO FOLLOW THE USER OF THIS SPECIFIC POST */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PostInfo;
