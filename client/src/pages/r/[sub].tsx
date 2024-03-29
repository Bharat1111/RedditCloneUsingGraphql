import React from 'react'
import { useRouter } from 'next/router'
import { useGetSubQuery } from '../../generated/graphql'
import PostCard from '../../components/PostCard'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const Sub = () => {
  const router = useRouter()
  const subName = router.query.sub as string
  const { data, loading, error } = useGetSubQuery({
    skip: subName === undefined,
    variables: {
      name: subName
    }
  })
  // if(error) {
  //   router.push('/')
  // }
  return (
      <>
      <Navbar />
      <div className="pt-12">
        <div className="container flex pt-5">
          {error && (<small className="text-red-500">{error?.message}</small>) }
          {loading ? <div>Loading...</div> : 
          !data?.getSub?.posts ? <div>No Posts</div> : (
            (<>
            <div className="w-160">
              {data.getSub.posts.map(post => (<PostCard key={post.id} post={post} />))}
            </div>
            <Sidebar sub={data && data} />
            </>)
          )}
          
        </div>
      </div>
      </>
  )
}


export default Sub
