import Link from "next/link";
import moment from "moment";

import UpdootSection from './UpdootSection'
import Buttons from './Buttons'

const PostCard = ({ post }) => {
  // const [vote] = useVoteMutation()

  return (
    <div key={post.identifier} className="flex mb-4 bg-white rounded">
      {/* Vote Section */}
      <UpdootSection post={post} />

      {/* Remaining */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${post.subName}`}>
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                />
          </Link>
          <Link href={`/r/${post.subName}`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              /r/{post.subName}
            </a>
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
        <Buttons post={post} />
      </div>
    </div>
  );
}

export default PostCard