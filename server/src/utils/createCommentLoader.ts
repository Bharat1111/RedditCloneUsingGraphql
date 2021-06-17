import DataLoader from 'dataloader'
import { Comment } from '../entities/Comment'

export const createCommentLoader = () => new DataLoader<string, Comment>(async (postIds) => {
    const comments = await Comment.findByIds(postIds as string[])

    const commentIdtoComment: Record<string, Comment> = {}

    comments.forEach(c => {
        commentIdtoComment[c.id] = c
    })

    return postIds.map((postId) => commentIdtoComment[postId])
})