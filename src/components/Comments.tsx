"use client";

import React, { useActionState } from "react";
import Post from "./Post";
import Image from "./Image";
import { Post as PostType } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { addComment } from "@/action";
// import { socket } from "@/socket";

//TODO: We are getting the comments to show from the "specific post page"
type CommentWithDetails = PostType & {
  user: { displayName: string | null; username: string; img: string | null };
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Comments = ({
  comments,
  postId,
  username,
  userImg,
}: {
  comments: CommentWithDetails[];
  postId: number;
  username: string;
  userImg: string | null;
}) => {
  const { isLoaded, isSignedIn, user } = useUser(); // getting the user

  // state holds is whatever is returned from the use action state
  // initialzied as an object and is changed to whatever ur server action returns
  // form action is the server action that is being called and it calls addcomment
  // instead of a normal html post react bundles all the data and passes it to addcomment
  const [state, formAction, isPending] = useActionState(addComment, {
    success: false,
    error: false,
  });

  // use this effect if state.success changes, and check if it is true or false
  // emitting a notification to the other user
  // useEffect(() => {
  //   if (state.success) {
  //     socket.emit("sendNotification", {
  //       receiverUsername: username,
  //       data: {
  //         senderUsername: user?.username,
  //         type: "comment",
  //         link: `/${username}/status/${postId}`,
  //       },
  //     });
  //   }
  // }, [state.success, username, user?.username, postId]);

  return (
    <div className="">
      {/* FORM IS THE POST REPLY FORM: SENDING THESE FIELDS TO SERVER ACTION: USERNAME, DESCRIPTION, POSTID */}
      {user && (
        <form
          action={formAction}
          className="flex items-center justify-between gap-4 p-4"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden -z-10">
            <Image
              path={userImg || "general/noAvatar.png"}
              alt="Andrew"
              w={100}
              h={100}
              tr={true}
            />
          </div>

          {/* JUST a way of adding our postId to the form along with our username*/}
          <input type="number" name="postId" hidden readOnly value={postId} />
          <input
            type="string"
            name="username"
            hidden
            readOnly
            value={username}
          />

          {/* using useActionhook to determine if the adding comment server action is still occuring */}
          <input
            type="text"
            name="desc"
            className="flex-1 bg-transparent outline-none p-2 text-xl"
            placeholder="Post your reply"
          />
          <button
            disabled={isPending}
            className="py-2 px-4 font-bold bg-white text-black rounded-full disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            {isPending ? "Replying" : "Reply"}
          </button>
        </form>
      )}
      {state.error && (
        <span className="text-red-300 p-4">Something went Wrong!</span>
      )}

      {/* Passing all the comments from the props */}
      {comments.map((comment) => (
        <div key={comment.id}>
          <Post post={comment} type="comment" />
        </div>
      ))}
    </div>
  );
};

export default Comments;
