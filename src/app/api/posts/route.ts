import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

//TODO: Defining the Get function to get all the posts
// getting the parameters from the url
export async function GET(request: NextRequest) {
  // getting the URL object pointing at request to inspect and recieve params
  const searchParams = request.nextUrl.searchParams;

  // getting the profile id of the page we ar eon
  const userProfileId = searchParams.get("user");

  // getting what page we are on
  const page = searchParams.get("cursor");
  const LIMIT = 3;

  // getting logged in user
  const { userId } = await auth();

  if (!userId) return;

  // determining if we are showing home feed or a specific user feed
  const whereCondition =
    userProfileId !== "undefined"
      ? { parentPostId: null, userId: userProfileId as string } // show only top level posts of specific user
      : {
          parentPostId: null, // top level posts
          userId: {
            // selecting where my userId is in the array
            in: [
              userId, // myself
              ...(
                await prisma.follow.findMany({
                  where: { followerId: userId }, // followerId represetns person doing the following, so this represents everyone i follow
                  select: { followingId: true }, // The logged in user is a follower, select all the ids im following
                })
              ).map((follow) => follow.followingId),
            ],
          },
        };

  const postIncludeQuery = {
    user: {
      select: { displayName: true, username: true, img: true },
    },
    _count: { select: { likes: true, rePosts: true, comments: true } }, // number of interactions
    likes: { where: { userId: userId }, select: { id: true } }, // did i interact
    rePosts: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };

  // we are finding multiple posts that have the where condition and also including
  // the postInclude
  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      rePost: {
        include: postIncludeQuery,
      },
      ...postIncludeQuery,
    },
    take: LIMIT, // taking the first 3 ones
    skip: (Number(page) - 1) * LIMIT, // skip is defining how to find the one depending on the page number we r on
    orderBy: { createdAt: "desc" },
  });

  const postWithFlags = posts.map((post) => ({
    ...post,
    isAuthor: post.userId === userId,
  }));

  const totalPosts = await prisma.post.count({ where: whereCondition }); // get the amount of people logged in user is following

  const hasMore = Number(page) * LIMIT < totalPosts; // true or false value representing if we have more posts

  return Response.json({ posts: postWithFlags, hasMore }); // posts are the posts on the specific page, hasMore boolean telling us if we have more content
}
