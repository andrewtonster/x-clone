"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

//TODO: Defining function to fetch the posts in one our api routes
const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const res = await fetch(
    "http://localhost:3001/api/posts?cursor=" +
      pageParam +
      "&user=" +
      userProfileId
  );
  return res.json();
};

const InfiniteFeed = ({ userProfileId }: { userProfileId?: string }) => {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"], // a key that defines what we are doing the infinite feed on
    queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId), //query fn recieves a page param, and we call our api with it
    initialPageParam: 2,
    getNextPageParam: (
      lastPage,
      pages // passes next page values to fetchnextpage
    ) => (lastPage.hasMore ? pages.length + 2 : undefined),
  });

  if (error) return "something went wrong!";
  if (status === "pending") return "Loading...";

  console.log(data);

  //data is an array and stores a list of objects returned from queryfn
  // changes each post into post array and then flattens it out into one array from flatmap
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    // <div>Infinite Feed</div>
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage} // calls this function whenever its near the end of the page
      hasMore={!!hasNextPage} // will keep listening for scrolls as lon as this is true
      loader={<h1>Posts are loading...</h1>} // message shown while waiting for next batch
      endMessage={<h1>All posts loaded</h1>} // shown when has more is false
    >
      {allPosts.map((post) => (
        <Post key={post.id} post={post} /> // shows all the posts we have
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
