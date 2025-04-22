import React from "react";
import Link from "next/link";
import Image from "@/components/Image";
import Post from "@/components/Post";
import Comments from "@/components/Comments";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";
const StatusPage = async ({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) => {
  const { userId } = await auth();
  console.log(userId);
  const postId = (await params).postId;
  console.log(postId);

  if (!userId) return;

  const post = await prisma.post.findFirst({
    where: { id: Number(postId) },
    include: {
      user: {
        select: { displayName: true, username: true, img: true },
      },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: userId }, select: { id: true } },
      rePosts: { where: { userId: userId }, select: { id: true } },
      saves: { where: { userId: userId }, select: { id: true } },
    },
  });

  console.log(post);
  if (!post) return notFound();
  return (
    <div>
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>
      <Post type="status" post={post} />
      {/* <Comments /> */}
    </div>
  );
};

export default StatusPage;
