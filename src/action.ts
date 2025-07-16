"use server";
import { auth } from "@clerk/nextjs/server";
// import { prisma } from "./prisma";
import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "@imagekit/next";
import { imagekit } from "./utils";

//TODO: Action servers that work with our backend

export type DeletePostState = {
  success: boolean;
  error: boolean;
};

export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId, // user who did the follow
      followingId: targetUserId, // user being followed
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id }, // essentially unfollow button, delete the entry
    });
  } else {
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId }, // otherwise create the following relationship
    });
  }
};

// like belongs references a user who liked the post and the post the like was used on
export const likePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId, // find a like coming from this user
      postId: postId, // find the liked post cominf from the user
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: { userId, postId }, // otherwise we create a like with the userId of the user, and the postId for which it was liked
    });
  }
};

export const rePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingRePost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId, // passing the id of the post we are reposting
    },
  });

  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    });
  } else {
    await prisma.post.create({
      // a repost is a whole new seperate post under the user who reposted
      data: { userId, rePostId: postId }, //creating a repost, where the userId is the userId who reposted, and postid
    });
  }
};

export const savePost = async (postId: number) => {
  console.log("in saved post state");
  const { userId } = await auth();

  if (!userId) return;

  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingSavedPost) {
    console.log("existing post already exist");
    await prisma.savedPosts.delete({
      where: { id: existingSavedPost.id },
    });
  } else {
    await prisma.savedPosts.create({
      data: { userId, postId }, // userId references the user that saves the post, and postId represents the post that was saved
    });
  }
};

//

export const addComment = async (
  previousState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const postId = formData.get("postId");
  const username = formData.get("username");
  const desc = formData.get("desc");

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140),
  });

  const validatedFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc,
  });

  if (!validatedFields.success) {
    return { success: false, error: true };
  }

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
      },
    });
    revalidatePath(`/${username}/status/${postId}`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ADDING POST
// formdata is populated from the form through useaction state
// also useaction state, passes state into the function
export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth(); // getting current user

  if (!userId) return { success: false, error: true }; // returning an object back to state

  const desc = formData.get("desc"); // getting description of form
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  /* Uploading our file to imagekit */
  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/posts",
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  // describing what the post should look like, description should have
  // a max characters of 140 and have a field issensitive that is a boolean
  // and is optional
  const Post = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  });

  // will hold an object with success:true, and a data field that we can access
  // our data
  const validatedFields = Post.safeParse({
    desc,
    isSensitive: JSON.parse(isSensitive),
  });

  // checking if our fields were a success
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  let img: string | undefined = "";
  let imgHeight: number | undefined = 0;
  let video: string | undefined = "";

  // checking if our file exist
  if (file.size) {
    const result: UploadResponse = await uploadFile(file); // uploading file to imagekit

    if (result.fileType === "image") {
      // if it was an image we uploaded, then we set these values
      img = result.filePath;
      imgHeight = result.height;
    } else {
      video = result.filePath;
    }
  }

  console.log({
    ...validatedFields.data,
    userId,
    img,
    imgHeight,
    video,
  });

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data, // description and if it was sensitive
        userId,
        img,
        video,
        // imgHeight, fix this is not showing up
      },
    });
    revalidatePath(`/`); // revalidates the path
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }

  return { success: false, error: true };
};

// TODO: update background img url, in this function want to update prisma db

// TODO: Update profile picture URL

// TODO: UPDATE NAME

// TODO: UPDATE BIO

// TODO: UPDATE LOCATION

export const updateProfile = async (
  previousState: { success: boolean; error: boolean } | undefined,
  formData: FormData
) => {
  "use server";
  const { userId } = await auth();
  if (!userId) return;

  const username = formData.get("username") as string | null;
  const name = formData.get("name") as string | null;
  const background = formData.get("background") as File | null;
  const profilePic = formData.get("profilePic") as File;
  const bio = formData.get("bio") as string | null;
  const job = formData.get("job") as string | null;
  const location = formData.get("location") as string | null;
  const website = formData.get("website") as string | null;

  console.log("username", username);
  console.log("background", background);
  console.log("profilePic", profilePic);
  console.log("bio", bio);
  console.log("location", location);
  console.log("website", website);

  // UPLOAD BACKGROUND TO IMAGEKIT
  const uploadBackground = async (file: File): Promise<UploadResponse> => {
    console.log("im still uploading background");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600, ar-1-1`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/background",
          transformation: {
            pre: transformation,
          },
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  let backgroundURL = "";

  if (background && background.size > 1) {
    console.log("uploading the background still");
    const result: UploadResponse = await uploadBackground(background);
    if (!result.filePath) {
      return { success: false, error: true };
    }
    backgroundURL = result.filePath;
  }

  // UPLOADING FOR PFP

  const uploadProfile = async (file: File): Promise<UploadResponse> => {
    console.log("im still updating profile pic");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600, ar-1-1`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/profile",
          transformation: {
            pre: transformation,
          },
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  let profileURL = "";

  if (profilePic && profilePic.size > 1) {
    console.log("i am in profile pic changing");
    const result: UploadResponse = await uploadProfile(profilePic);
    if (!result.filePath) {
      return { success: false, error: true };
    }
    profileURL = result.filePath;
  }

  try {
    if (username) {
      console.log("im still in username");
      await prisma.user.update({
        where: { id: userId },
        data: {
          username: username,
        },
      });
    }

    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          displayName: name,
        },
      });
    }

    if (background && background.size > 1) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          cover: backgroundURL,
        },
      });
    }

    if (profilePic && profilePic.size > 1) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          img: profileURL,
        },
      });
    }

    if (bio) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          bio: bio,
        },
      });
    }

    if (job) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          job: job,
        },
      });
    }

    if (location) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          location: location,
        },
      });
    }

    if (website) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          website: website,
        },
      });
    }

    revalidatePath(`/`);

    return { success: true, error: false, user: username };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export async function deletePost(
  previousState: DeletePostState | undefined,
  formData: FormData
): Promise<DeletePostState> {
  try {
    // 1. Who’s calling?

    console.log("I am in delete post");
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: true };
    }

    // 2. Pull out the postId from the form
    const raw = formData.get("postId");

    if (!raw) {
      return { success: false, error: true };
    }

    const postId = Number(raw);
    console.log("This is the psotId", postId);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    console.log("this is the post we found", post);
    if (!post || post.userId !== userId) {
      return { success: false, error: true };
    }

    // 4. Delete it
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (err) {
    console.error("deletePost error:", err);
    return { success: false, error: true };
  }
}

// TODO: UPDATE WEBSITE
