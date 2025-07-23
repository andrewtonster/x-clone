"use client";
import React from "react";
import { useState, useOptimistic } from "react";
import { followUser } from "@/action";

//TODO: Completed understanding of useoptimistic hook and follow button
// component passes the user id and whether logged in user
// follows the person or not
const FollowButton = ({
  userId,
  isFollowed,
}: {
  userId: string;
  isFollowed: boolean;
}) => {
  // setting whether our logged in user follows this person as a state
  const [state, setState] = useState(isFollowed);
  const followAction = async () => {
    switchOptimisticFollow("");
    await followUser(userId);
    setState((prev) => !prev);
  };

  // optimistic hook to update right away.
  // all we do is pass the state we want to register immedietly,
  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  );

  return (
    <form action={followAction}>
      <button className="py-2 px-4 bg-white text-black font-bold rounded-full cursor-pointer">
        {optimisticFollow ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
};

export default FollowButton;
