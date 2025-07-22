import React from "react";
import Post from "@/components/Post";
import Comments from "@/components/Comments";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";

import BackButton from "@/components/BackButton";

//TODO: This page shows a specific post, we get post id and find all the details of
// the user that posted this, along with if we interacted with this post specifically

const StatusPage = async ({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) => {
  const { userId } = await auth(); // currently logged in user

  const postId = (await params).postId;

  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  // we are finding the post where it matches post id, and include
  // some user details (creating a post object with all the data i need)
  const post = await prisma.post.findFirst({
    where: { id: Number(postId) },
    include: {
      user: {
        // include the user that made the post
        select: { displayName: true, username: true, img: true },
      },
      _count: { select: { likes: true, rePosts: true, comments: true } }, // get all the status

      // 3) “Did I personally like/repost/save this?”
      likes: { where: { userId: userId }, select: { id: true } },
      rePosts: { where: { userId: userId }, select: { id: true } },
      saves: { where: { userId: userId }, select: { id: true } },
      comments: {
        // select the comments model
        orderBy: { createdAt: "desc" },
        include: {
          // and in the comments model we include another model the users
          user: {
            select: { displayName: true, username: true, img: true }, // from those users we select these specific field
          },
          _count: { select: { likes: true, rePosts: true, comments: true } }, // from the counot model  we get the count of the comments
          likes: { where: { userId: userId }, select: { id: true } }, // getting whether I liked this comment or not?
          rePosts: { where: { userId: userId }, select: { id: true } },
          saves: { where: { userId: userId }, select: { id: true } },
        },
      },
    },
  });

  if (!post) return;
  return (
    <div>
      {/*POST HEADER */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <BackButton />
        <h1 className="font-bold text-lg">Post</h1>
      </div>

      {/* ACTUAL POST: passing down status so it can render as 
        like the main post box, instead of a "comment" type of Post
      */}
      <Post type="status" post={post} />

      {/* LIST OF ALL COMMENTS */}
      <Comments
        comments={post.comments}
        postId={post.id}
        username={post.user.username}
        userImg={user.img}
      />
    </div>
  );
};

export default StatusPage;
