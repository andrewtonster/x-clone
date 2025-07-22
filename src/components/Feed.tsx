import React from "react";
import Post from "./Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import InfiniteFeed from "./InfiniteFeed";

// TODO: Feed Component
const Feed = async ({
  userProfileId,
  saved,
  liked,
  reposts,
  comments,
}: {
  userProfileId?: string;
  saved?: boolean | null;
  liked?: boolean | null;
  reposts?: boolean | null;
  comments?: boolean | null;
}) => {
  // getting the user id from clerk.
  const { userId } = await auth(); // gets the userId from the Auth object provided by clerk

  if (!userId) return;

  const whereCondition = userProfileId
    ? // — If you passed a specific profile ID, just show users top level Post:
      // This is for the User Page
      { parentPostId: null, userId: userProfileId } // dont get comments, just posts i made
    : {
        parentPostId: null, // get only parent post no comments
        userId: {
          in: [
            userId, // this is me
            ...(
              await prisma.follow.findMany({
                where: { followerId: userId }, // select all rows in follow table where I am a follower of someone
                select: { followingId: true }, // from those those rows return only ids of the users i follow
              })
            ).map((follow) => follow.followingId), // return the following id of the user that id follow
          ],
        },
      };

  /* query to get like the status of each posts (likes, repost, etc) shows what interaction we performed*/
  const postIncludeQuery = {
    user: {
      select: { displayName: true, username: true, img: true }, // from the user we select these
    },
    _count: { select: { likes: true, rePosts: true, comments: true } }, // prisma meta data get # of lies repost comments
    likes: { where: { userId: userId }, select: { id: true } }, // getting if we liked the post or not
    rePosts: { where: { userId: userId }, select: { id: true } }, // look at likes, repost and saves columnn, select the rows where my id matches
    saves: { where: { userId: userId }, select: { id: true } },
  };

  // get all posts from me and the people i follow, for each one of these posts,
  // go to  repost and then include the user that reposted it and for that user
  // that reposted it get their displayname, username, and img

  // SAVED PAGE
  if (saved) {
    const savedPosts = await prisma.post.findMany({
      where: {
        saves: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        rePost: {
          // get the original post if any
          include: postIncludeQuery,
        },
        ...postIncludeQuery,
      },
    });

    if (savedPosts.length === 0) return <div>No saved Posts</div>;

    return (
      <div>
        {savedPosts.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    );
  }

  // LIKED PAGE
  if (liked) {
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        rePost: {
          // get the original post if any
          include: postIncludeQuery,
        },
        ...postIncludeQuery,
      },
    });

    if (likedPosts.length === 0) return <div>No liked Posts</div>;

    return (
      <div>
        {likedPosts.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    );
  }

  // REPOSTS PAGE
  if (reposts) {
    const repostedPosts = await prisma.post.findMany({
      where: {
        rePosts: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        rePost: {
          // get the original post if any
          include: postIncludeQuery,
        },
        ...postIncludeQuery,
      },
    });

    if (repostedPosts.length === 0) return <div>No posts reposted</div>;

    return (
      <div>
        {repostedPosts.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    );
  }

  // COMMENTS PAGE
  if (comments) {
    const commentedPosts = await prisma.post.findMany({
      where: {
        comments: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        rePost: {
          // get the original post if any
          include: postIncludeQuery,
        },
        ...postIncludeQuery,
      },
    });

    if (commentedPosts.length === 0) return <div>No posts reposted</div>;

    return (
      <div>
        {commentedPosts.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    );
  }

  // get the person who reposted it and the original poster
  const posts = await prisma.post.findMany({
    where: whereCondition, // current user and people current user follows
    include: {
      rePost: {
        // the poeple i follow can repost something and i want to see original author of it
        include: postIncludeQuery,
      },
      ...postIncludeQuery,
    },
    take: 3,
    skip: 0,
    orderBy: { createdAt: "desc" }, // order in descending order by created at
  });

  const postWithFlags = posts.map((post) => ({
    ...post,
    isAuthor: post.userId === userId,
  }));

  // if it is a repost then we get both the original and the person user follows who repost to get data and use however we want

  // FETCH POSTS FROM THE CURRENT USER AND THE FOLLOWINGS
  return (
    <div className="">
      {postWithFlags.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}
      <InfiniteFeed userProfileId={userProfileId} />
    </div>
  );
};

export default Feed;
