import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import { useCreatePostMutation, useGetSubQuery } from '../../../generated/graphql'

const Submit = () => {
    const router = useRouter()
    const subName = router.query.sub as string
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const [createPost] = useCreatePostMutation()
    const { data: sub, error } = useGetSubQuery({
        skip: !subName,
        variables: {name: subName}
    })

    if(error) {
        router.push('/')
    }
    return (
        <div className='container flex pt-5'>
            <div className="w-160">
                <div className="p-4 bg-white rounded">
                    <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        const { errors } = await createPost({
                            variables: {
                                title,
                                body,
                                sub: sub.getSub.name
                            },
                            update: (cache) => cache.evict({ fieldName: "getPosts:{}" })
                        })
                        if(!errors) router.push('/')
                    }}>
                        <div className="relative mb-2">
                            <input className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600" placeholder="Title" onChange={e => setTitle(e.target.value)} maxLength={300}  />
                            <div className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600" style={{ top: 11, right: 10 }}>
                                {title.trim().length}/300
                            </div>
                        </div>
                        <textarea className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600" value={body} placeholder="Text" rows={4} onChange={(e) => setBody(e.target.value)} ></textarea>
                        <div className="flex justify-end">
                            <button className="button blue px-3 py-1" disabled={title.trim().length === 0}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {sub && <Sidebar sub={sub} />}
        </div>
    )
}

export default Submit
