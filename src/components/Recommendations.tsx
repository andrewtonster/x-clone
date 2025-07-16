import Link from "next/link";
import Image from "./Image";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";

//TODO: part of the right bar, find users such that someone i follow is following them, and then
// i display the informationo

const Recommendations = async () => {
  const { userId } = await auth(); // the loged in user

  if (!userId) return;

  // query to find the poeple that the logged in person follows
  const followingIds = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  //  just mapping through and getting each persons id
  const followedUserIds = followingIds.map((f) => f.followingId);

  // finding people that are not me and the people that i do not follow

  const friendRecommendations = await prisma.user.findMany({
    where: {
      id: { not: userId, notIn: followedUserIds },

      // looking in the followings column for at least one or more users
      // such that the person i follow is following them
      followings: { some: { followerId: { in: followedUserIds } } },
    },
    take: 3,
    select: { id: true, displayName: true, username: true, img: true },
  });

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {friendRecommendations.map((person) => (
        <div className="flex items-center justify-between" key={person.id}>
          {/* IMAGE AND USER INFO */}
          <div className="flex items-center gap-2">
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image
                path={person.img || "general/noAvatar.png"}
                alt={person.username}
                w={100}
                h={100}
                tr={true}
              />
            </div>
            <div className="">
              <h1 className="text-md font-bold">
                {person.displayName || person.username}
              </h1>
              <span className="text-textGray text-sm">@{person.username}</span>
            </div>
          </div>
          {/* BUTTON */}
          <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
            Follow
          </button>
        </div>
      ))}

      <Link href="/" className="text-iconBlue">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
