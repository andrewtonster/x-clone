import Image from "@/components/Image";
import Feed from "@/components/Feed";
import Share from "@/components/Share";
import Link from "next/link";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";

// TODO: This will render in the layout as children, will show the links,
// the share button and the remaining feed
const page = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { followers: true, followings: true } },
      followings: userId ? { where: { followerId: userId } } : undefined, // if logged in user exists, where the logged in user is a follwer
    },
  });

  if (!user) return;
  if (!userId) return redirectToSignIn();
  return (
    <div className="">
      <div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray">
        <Link
          className="pb-3 flex items-center border-b-4 border-iconBlue"
          href="/"
        >
          For You
        </Link>
        <Link className="pb-3 flex items-center " href="/">
          Following
        </Link>
        <Link className="hidden pb-3 md:flex items-center " href="/">
          React.js
        </Link>
        <Link className="hidden pb-3 md:flex items-center " href="/">
          Javascript
        </Link>
        <Link className="hidden pb-3 md:flex items-center " href="/">
          CSS
        </Link>
      </div>

      <Share userImg={user.img} />
      <Feed />
    </div>
  );
};

export default page;
