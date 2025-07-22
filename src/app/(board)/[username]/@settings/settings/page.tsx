import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";

import EditProfileForm from "@/components/EditProfileForm";

interface Props {
  params: Promise<{ username: string }>;
}
const SettingsModal = async ({ params }: Props) => {
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

  if (!user) return;

  if (user.id == userId) {
    isOwnProfile = true;
  }

  if (!isOwnProfile) return;
  return (
    <div>
      <EditProfileForm img={user.img} />
    </div>
  );
};

export default SettingsModal;
