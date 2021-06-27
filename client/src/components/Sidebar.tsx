import React from 'react'
import moment from "moment";
import Link from "next/link";
import { useMeQuery } from '../generated/graphql';
const Sidebar = ({ sub: {getSub} }) => {
    const { data, loading } = useMeQuery()
    return (
        <div className='ml-6 w-80'>
            <div className="bg-white rounded">
                <div className="p-3 bg-blue-500 rounded-t">
                    <p className="font-semibold text-white">About Community</p>
                </div>
                    <div className="p-3">
                        <p className="mb-3 text-md">
                            {getSub?.description}
                        </p>
                        <div className="flex mb-3 text-sm-font-medium">
                            <div className="w-1/2">
                                <p>5.2k</p>
                                <p>790</p>
                            </div>
                        </div>

                        <p className="my-3">
                            <i className="fas fa-birthday-cake mr-2">
                            </i>
                            Created {moment(parseInt(getSub?.createdAt)).format("DD MMM YYYY")}
                        </p>
                        {data?.me && (
                            <Link href={`/r/${getSub?.name}/create`}>
                                <a className="w-full blue button text-sm py-1">
                                    Create Post
                                </a>
                            </Link>
                        )}
                    </div>
            </div>
        </div>
    )
}

export default Sidebar
