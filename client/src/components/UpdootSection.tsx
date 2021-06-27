import React from 'react'
import { ApolloCache, gql } from "@apollo/client";
import classNames from 'classnames'

import { useVoteMutation, VoteMutation } from "../generated/graphql";
import { useRouter } from 'next/router';

const updateAfterVote = (
    value: number,
    postId,
    cache: ApolloCache<VoteMutation>
  ) => {
    const data = cache.readFragment<{
      id: string;
      voteScore: number;
      userVote: number | null;
    }>({
      // Post:njsdhwiiihiobdc
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          id
          voteScore
          userVote
        }
      `,
    });
  // console.log(data)
    if (data) {
      // if (data.votes?.userVote !== 0) {
      //   return;
      // }
      if (data.userVote === value) {
        return;
      }
      const newPoints = (data.voteScore as number) + (!data.userVote ? 1 : 2) * value;
      cache.writeFragment({
        id: 'Post:' + postId,
        fragment: gql`
          fragment __ on Post {
            voteScore
            userVote
          }
        `,
        data: { voteScore: newPoints, userVote: value },
      });
      // console.log('data', data)
    }
  };

const UpdootSection = ({ post }) => {
    const router = useRouter()
    const [vote, { error }] = useVoteMutation()

    if(error?.message) {
        router.push('/login')
    }

    return (
        <div className="flex-shrink-0 w-10 py-3 text-center bg-gray-200 rounded-1">
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
          <i
            onClick={async () => {
              if(post?.userVote === 1) return
              await vote({
                variables: {
                    identifier: post?.identifier,
                    slug: post?.slug,
                    value: 1,
                  },
                  update: (cache) => updateAfterVote(1, post?.id, cache)
              });
            }}
            className={classNames('fas fa-arrow-up', {
              'text-red-500': post?.userVote === 1
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500">
          <i
            onClick={async () => {
              if(post?.userVote === -1) return
              await vote({
                variables: {
                    identifier: post?.identifier,
                    slug: post?.slug,
                    value: -1,
                },
                update: (cache) => updateAfterVote(-1, post?.id, cache)
              });
            }}
            className={classNames('fas fa-arrow-down', {
              'text-blue-600': post?.userVote === -1
            })}
          ></i>
        </div>
      </div>
    )
}

export default UpdootSection
