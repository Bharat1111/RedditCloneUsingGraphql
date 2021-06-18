import Link from "next/link";
import { Fragment } from "react";
import moment from "moment";
import { useVoteMutation, VoteMutation } from "../generated/graphql";
import { ApolloCache, gql } from "@apollo/client";

// interface PostCardProps {
//     post: Post
// }
const updateAfterVote = (
  value: number,
  postId,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: string;
    voteScore: number;
    VoteStatus: number;
  }>({
    // Post:njsdhwiiihiobdc
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        voteScore
      }
    `,
  });
// console.log(data)
  if (data) {
    // if (data.votes?.VoteStatus !== 0) {
    //   return;
    // }
    let newPoints
    if(value === 1){
      if(data.voteScore > 0) {
        return
      }
    }
    else if(value === -1) {
      if(data.voteScore < 0) return
    }
    newPoints = (data.voteScore as number) + value;
    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment __ on Post {
          id
          voteScore
        }
      `,
      data: { voteScore: newPoints },
    });
    // console.log('data', data)
  }
};

export default function PostCard({ post }) {
  const [vote] = useVoteMutation()

  return (
    <div key={post.identifier} className="flex mb-4 bg-white rounded">
      {/* Vote Section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-1">
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
          <i
            onClick={async () => {
              await vote({
                variables: {
                    identifier: post.identifier,
                    slug: post.slug,
                    value: 1,
                  },
                  update: (cache) => updateAfterVote(1, post.id, cache)
              });
            }}
            className="fas fa-arrow-up"
          ></i>
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500">
          <i
            onClick={async () => {
              await vote({
                variables: {
                    identifier: post.identifier,
                    slug: post.slug,
                    value: -1,
                },
                update: (cache) => updateAfterVote(-1, post.id, cache)
              });
            }}
            className="fas fa-arrow-down"
          ></i>
        </div>
      </div>

      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${post.subName}`}>
            <Fragment>
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
              />
              <a className="text-xs font-bold cursor-pointer hover:underline">
                /r/{post.subName}
              </a>
            </Fragment>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">/u/{post.username}</a>
            </Link>
            <Link href={`/r/${post.subName}/${post.identifier}/${post.slug}`}>
              <a className="mx-1 hover:underline">
                {moment(parseInt(post.createdAt)).format("DD MMM YYYY")}
              </a>
            </Link>
          </p>
        </div>
        <Link href={`/r/${post.subName}/${post.identifier}/${post.slug}`}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm">{post.body}</p>}
        <div className="flex">
          <Link href={`/r/${post.subName}/${post.identifier}/${post.slug}`}>
            <a>
              <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{post.commentCount} Comments</span>
              </div>
            </a>
          </Link>
          <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </div>
          <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </div>
        </div>
      </div>
    </div>
  );
}
