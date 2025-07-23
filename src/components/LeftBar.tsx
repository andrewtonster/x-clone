import React from "react";
import Link from "next/link";
import Image from "@/components/Image";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";
import SignOut from "./SignOut";

// LEFTBAR TO DISPLAY
// TODO: all we did here was display the leftbar and use our Image from Image kit

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  {
    id: 3,
    name: "Notification",
    link: "/",
    icon: "notification.svg",
  },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Liked",
    link: "/",
    icon: "job.svg",
  },
  {
    id: 7,
    name: "Reposts",
    link: "/",
    icon: "community.svg",
  },
  {
    id: 8,
    name: "Comments",
    link: "/",
    icon: "logo.svg",
  },
  {
    id: 9,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 10,
    name: "Sign Out",
    link: "/",
    icon: "back.svg",
  },
];

const LeftBar = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return redirectToSignIn();

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818]">
          <Image path="icons/logo.svg" alt="logo" w={24} h={24} />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-4">
          {menuList.map((item, i) => {
            // if (i === 2) {
            //   return <Notification key="notification" />;
            // }
            if (i === 4) {
              return (
                <Link
                  key={item.id}
                  href={`/${user?.username}/saved`}
                  className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                >
                  <Image
                    path={`icons/bookmark.svg`}
                    alt={item.name}
                    w={24}
                    h={24}
                  />
                  <span className="hidden xxl:inline">{item.name}</span>
                </Link>
              );
            }

            if (i === 5) {
              return (
                <Link
                  key={item.id}
                  href={`/${user?.username}/liked`}
                  className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                >
                  <Image
                    path={`svg/heart1.svg`}
                    alt={item.name}
                    w={24}
                    h={24}
                  />
                  <span className="hidden xxl:inline">{item.name}</span>
                </Link>
              );
            }

            if (i === 6) {
              return (
                <Link
                  key={item.id}
                  href={`/${user?.username}/reposts`}
                  className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                >
                  <Image
                    path={`svg/repost.svg`}
                    alt={item.name}
                    w={24}
                    h={24}
                  />
                  <span className="hidden xxl:inline">{item.name}</span>
                </Link>
              );
            }

            if (i === 7) {
              return (
                <Link
                  key={item.id}
                  href={`/${user?.username}/comments`}
                  className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                >
                  <Image
                    path={`svg/comments.svg`}
                    alt={item.name}
                    w={24}
                    h={24}
                  />
                  <span className="hidden xxl:inline">{item.name}</span>
                </Link>
              );
            }

            if (i == 9) {
              return <SignOut key="signout" btnType="large" />;
            }
            if (i == 8) {
              return (
                <Link
                  key={item.id}
                  href={`/${user?.username}`}
                  className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                >
                  <Image
                    path={`icons/${item.icon}`}
                    alt={item.name}
                    w={24}
                    h={24}
                  />
                  <span className="hidden xxl:inline">{item.name}</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.id}
                href={item.link}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <Image
                  path={`icons/${item.icon}`}
                  alt={item.name}
                  w={24}
                  h={24}
                />
                <span className="hidden xxl:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
        >
          <Image path="icons/post.svg" alt="new post" w={24} h={24} />
        </Link>
        {/* <Link
          href="/compose/post"
          className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
        >
          Post
        </Link> */}
      </div>
      {/*FOOTER */}
      <div className="relative flex items-center justify-between">
        <div className=" flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              path={user.img || "general/noAvatar.png"}
              alt="at"
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="font-bold">{user?.displayName}</span>
            <span className="text-sm text-textGray">@{user?.username}</span>
          </div>
        </div>
        <div className="hidden xxl:block cursor-pointer font-bold">
          <SignOut user={user.username} />
        </div>
        {/* <Socket /> */}
      </div>
    </div>
  );
};

export default LeftBar;
