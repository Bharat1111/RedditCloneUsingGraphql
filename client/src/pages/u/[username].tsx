import { useRouter } from "next/dist/client/router";
import React from "react";
import Head from "next/head";
import Link from "next/link";

import PostCard from "../../components/PostCard";
import { useGetUserPostQuery } from "../../generated/graphql";
import moment from "moment";

const User = () => {
  const router = useRouter();
  const username = router.query.username as string;

  const { data, loading } = useGetUserPostQuery({
    skip: !username,
    variables: { username },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Head>
        <title>{data?.getUsetPosts.user.username}</title>
      </Head>

      {data && data.getUsetPosts && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.getUsetPosts.posts.map((p) => (
              <PostCard post={p} key={p.identifier} />
            ))}

            {data.getUsetPosts.comments.map((c) => (
              <div className="flex my-4 bg-white rounded">
                <div className="flex-shrink-0 w-10 py-4 text-center rounded-1">
                  <i className="fas fa-comment-alt fa-xs mr-1 text-gray-500"></i>
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs text-gray-500">
                    <Link href={`/u/${c.username}`}>
                        <a className="mr-2 text-blue-500 cursor-pointer hover:underline">
                            {c.username}
                        </a>
                    </Link>
                    <span>Commented on </span>
                    <Link href={`${c.identifier}`}>
                        <a className="cursor-pointer hover:underline">
                            {c.postId}
                        </a>
                    </Link>
                    
                    <Link href={`/r/${c.identifier}`}>
                        <a className=" ml-4 text-black cursor-pointer hover:underline">
                        {moment(parseInt(c.createdAt)).fromNow()}
                        </a>
                    </Link>
                  </p>
                  <hr />
                  <p>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
