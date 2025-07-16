import Image from "@/components/Image";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";
import EditProfileForm from "@/components/EditProfileForm";

const SettingsModal = async ({ params }: { params: { username: string } }) => {
  const { userId } = await auth();
  const username = (await params).username; // getting the username

  let isOwnProfile = false;

  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      _count: { select: { followers: true, followings: true } },
      followings: userId ? { where: { followerId: userId } } : undefined, // if logged in user exists, where the logged in user is a follwer
    },
  });

  if (!user) return notFound;
  console.log("passed the user not found");
  if (user.id == userId) {
    console.log("got into if statmet");
    isOwnProfile = true;
  }

  if (!isOwnProfile) return notFound;
  console.log("ise own profile reached");
  return (
    <div>
      <EditProfileForm img={user.img} />
    </div>
  );
};

export default SettingsModal;
