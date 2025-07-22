"use client";
import Image from "@/components/Image";
import { useState, useActionState } from "react";
import { updateProfile } from "@/action";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CSSProperties } from "react";
import { SyncLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

const EditProfileForm = ({ img }: { img: string | null }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = ""; // Clean up on unmount
    };
  }, []);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
    error: false,
    user: "",
  });

  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );

  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundPreview(URL.createObjectURL(file));
    }
  };

  const handlePFPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (state?.success) {
      router.back();
    }

    // router.back();
  }, [state?.success, router]);

  return (
    <form action={formAction}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="overflow-auto h-[635px] w-[620px] bg-black text-white p-6 rounded-xl ">
          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              <span
                className="cursor-pointer mr-5"
                onClick={() => router.back()}
              >
                X
              </span>
              <span className="text-xl font-bold">Edit Profile</span>
            </div>
            <button
              disabled={isPending}
              //   type="submit"
              className=" w-30 text-s bg-white text-black font-bold rounded-full cursor-pointer border-[1px] px-4 py-2 shadow"
            >
              Save
            </button>
          </div>

          {!isPending ? (
            <>
              <div className="flex justify-center mt-10 mb-10 h-40 relative">
                {backgroundPreview && (
                  <NextImage
                    src={backgroundPreview}
                    alt="Background"
                    fill
                    className="absolute inset-0 w-full h-full object-cover -z-0"
                  />
                )}

                <input
                  type="file"
                  name="background"
                  onChange={handleBackgroundChange}
                  id="background"
                  className="hidden"
                />

                {/* This container centers the icon */}
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <label htmlFor="background">
                    {/* Hover effect and border only around the icon */}
                    <div className="rounded-full hover:bg-black/50 duration-200 ease-in p-3 cursor-pointer">
                      <Image
                        path={"svg/camera.svg"}
                        alt={"camera"}
                        w={24}
                        h={24}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="relative w-1/6 aspect-square rounded-full overflow-hidden border-4 border-black">
                {profilePreview ? (
                  <NextImage
                    src={profilePreview}
                    alt=""
                    width={600}
                    height={600}
                  />
                ) : (
                  <Image
                    path={img || "general/noAvatar.png"}
                    alt=""
                    w={100}
                    h={100}
                    tr={true}
                  />
                )}

                <input
                  type="file"
                  name="profilePic"
                  onChange={handlePFPChange}
                  id="profilePic"
                  className="hidden"
                />
                <label htmlFor="profilePic">
                  <div className="absolute inset-0 flex items-center justify-center rounded-full hover:bg-black/50 duration-200 ease-in cursor-pointer">
                    <Image
                      path={"svg/camera.svg"}
                      alt={"camera"}
                      w={24}
                      h={24}
                    />
                  </div>
                </label>
              </div>

              <div className="mt-5">
                <div className="flex flex-col gap-5">
                  <div className="relative w-full">
                    <input
                      id="name"
                      name="username"
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-600 bg-black p-4 pt-6 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                    />

                    <label
                      htmlFor="username"
                      className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                      Username
                    </label>
                  </div>

                  <div className="relative w-full">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-600 bg-black p-4 pt-6 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                    />

                    <label
                      htmlFor="name"
                      className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                      Name
                    </label>
                    {/* <div className="absolute right-4 top-4 text-gray-400 text-sm peer-focus:text-blue-500">
              10 / 50
            </div> */}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="bio"
                      name="bio"
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-600 bg-black p-4 pt-6 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                    />

                    <label
                      htmlFor="bio"
                      className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                      Bio
                    </label>
                    {/* <div className="absolute right-4 top-4 text-gray-400 text-sm peer-focus:text-blue-500">
              10 / 50
            </div> */}
                  </div>

                  <div className="relative w-full">
                    <input
                      name="location"
                      id="location"
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-600 bg-black p-4 pt-6 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                    />

                    <label
                      htmlFor="location"
                      className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                      Location
                    </label>
                    {/* <div className="absolute right-4 top-4 text-gray-400 text-sm peer-focus:text-blue-500">
              10 / 50
            </div> */}
                  </div>

                  <div className="relative w-full">
                    <input
                      name="job"
                      id="job"
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-600 bg-black p-4 pt-6 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                    />

                    <label
                      htmlFor="job"
                      className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                      Job
                    </label>
                    {/* <div className="absolute right-4 top-4 text-gray-400 text-sm peer-focus:text-blue-500">
              10 / 50
            </div> */}
                  </div>

                  <div className="relative w-full">
                    <input
                      name="website"
                      id="website"
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-600 bg-black p-4 pt-6 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                    />

                    <label
                      htmlFor="website"
                      className="absolute left-4 top-2 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                      Website
                    </label>
                    {/* <div className="absolute right-4 top-4 text-gray-400 text-sm peer-focus:text-blue-500">
              10 / 50
            </div> */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="sweet-loading">
                <SyncLoader
                  color={color}
                  loading={loading}
                  cssOverride={override}
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default EditProfileForm;
