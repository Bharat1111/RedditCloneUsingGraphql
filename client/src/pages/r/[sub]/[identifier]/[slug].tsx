import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import moment from "moment";

import {
  useCreateCommentMutation,
  usePostQuery,
  useMeQuery,
} from "../../../../generated/graphql";
import Sidebar from "../../../../components/Sidebar";
import UpdootSection from "../../../../components/UpdootSection";
import Navbar from "../../../../components/Navbar";
import Buttons from "../../../../components/Buttons";
import { useState } from "react";
import gql from "graphql-tag";

const Post = () => {
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const identifier = router.query.identifier as string;
  const sub = router.query.sub;
  const slug = router.query.slug as string;

  const { data: medata } = useMeQuery()
  const [createComment] = useCreateCommentMutation();
  const { data, loading, error } = usePostQuery({
    skip: !identifier && !slug,
    variables: {
      identifier,
      slug,
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.getPost) {
    return <div>could not find post</div>;
  }
  return (
    <div>
      <Head>
        <title>{data.getPost.title}</title>
      </Head>
      <Navbar />
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center bg-blue-500 w-full h-20 mt-10 p-8">
            <div className="container flex">
              {data?.getPost && (
                <div className="rounded-full mr-2 w-8 h-8">image</div>
              )}
              <p className="text-xl font-semibold text-white">
                /r/{data?.getPost.subName}
              </p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {data?.getPost && (
              // Vote Section
              <>
                <div className="flex">
                  <UpdootSection post={data?.getPost} />
                  <div className="p-2 w-full">
                    <div className="flex items-center">
                      <img
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                      />
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${data.getPost.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{data.getPost.username}
                          </a>
                        </Link>
                        <a className="mx-1">
                          {moment(parseInt(data.getPost.createdAt)).format(
                            "DD MMM YYYY"
                          )}
                        </a>
                      </p>
                    </div>
                    <h1 className="my-1 text-xl font-medium">
                      {data?.getPost.title}
                    </h1>
                    {/* Post Body */}
                    <p className="my-3 text-sm">{data.getPost.body}</p>
                    <Buttons post={data.getPost} />
                  </div>
                </div>
                <hr />
                {/* Post Comment */}
                {medata.me ? <div className="pl-10 mt-3 pr-6 mb-4">
                  <div>
                    <p className="mb-1 text-xs">
                      Comment as
                      <Link href={`/u/user`}>
                        <a className="ml-2 underline font-semibold text-blue-500">
                          {medata.me.username}
                        </a>
                      </Link>
                    </p>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await createComment({
                          variables: {
                            body: newComment,
                            identifier: data.getPost.identifier,
                            slug: data.getPost.slug,
                          },
                          update: (cache, { data }) => {
                            cache.modify({
                                id: "Post:" + data.createComment.postId,
                                fields: {
                                  comments(existingCommentRefs = [], { readField }) {
                                    return [...existingCommentRefs, data];
                                  }
                                }
                            });
                          },
                        });
                        setNewComment("")
                      }}
                    >
                      <textarea
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:border-gray-600 rounded"
                        onChange={(e) => setNewComment(e.target.value)}
                      ></textarea>

                      <div className="flex justify-end">
                        <button
                          disabled={newComment.trim() === ""}
                          className="px-3 py-1 blue button"
                        >
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>
                      </div> : <div>
                  <div className="flex justify-between items-center px-2 py-2 border border-gray-200 rounded">
                    <p className="text-gray-500 font-semibold">
                      login or sign up to leave a comment
                    </p>
                    <div>
                      <Link href="/login">
                        <a className="px-4 mr-4 py-1 hollow blue button">
                          Login
                        </a>
                      </Link>
                      <Link href="/register">
                        <a className="px-4 py-1 blue button">Sign Up</a>
                      </Link>
                    </div>
                  </div>
                </div>}
                {/* Comments */}
                {data.getPost.comments.map((comment) => (
                  <div className="flex mt-4" key={comment.id}>
                    <div className="flex-shrink-0 w-10 py-2">{}</div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:undeline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                                    ${moment(
                                      parseInt(comment.createdAt)
                                    ).fromNow()}
                                  `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {/* {data?.getPost && <Sidebar sub={data.getPost}/>} */}
      </div>
    </div>
  );
};

export default Post;
