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
                  <i className="fas fa-comment-alt fa-xs  text-gray-500"></i>
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs text-gray-500">
                    {c.username}
                    <span className='ml-2'>Commented on </span>
                    <Link href={`/r/${c.identifier}`}>
                        <a className="cursor-pointer hover:underline">
                            {c.postId}
                        </a>
                    </Link>
                    
                        <span className=" ml-4 text-black">
                        {moment(parseInt(c.createdAt)).fromNow()}
                        </span>
                  </p>
                  <hr />
                  <p>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-80 ml-6">
              <div className="bg-white rounded">
                  <div className="bg-blue-500 rounded-t p-3">
                      <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="user profile" className='w-16 h-16 mx-auto border-2 border-white rounded-full' />
                  </div>
                  <div className="p-3 text-center">
                      <h1 className='text0xl uppercase mb-3'>{
                          username
                      }</h1>
                      <hr />
                      <p className='mt-3'>Joined {moment(parseInt(data.getUsetPosts.user.createdAt)).fromNow()}</p>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
