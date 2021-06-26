import React from "react";
import Link from "next/link";
const Buttons = ({ post }) => {
  return (
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
  );
};

export default Buttons;
