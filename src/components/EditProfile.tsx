"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
const EditProfile = ({ username }: { username: string }) => {
  const router = useRouter();

  if (!username) return null;
  return (
    <Link
      href={`/${username}/settings`}
      className="py-2 px-4 text-white font-bold rounded-full border-[1px] border-gray-500 cursor-pointer"
      scroll={false}
    >
      Edit Profile
    </Link>
  );
};

export default EditProfile;
