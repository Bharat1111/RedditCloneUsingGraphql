import DataLoader from 'dataloader'
import { User } from 'src/entities/User'
import { Vote } from '../entities/Vote'
// import { Users } from '../entities/User'

export const  createUpdootLoader = () => new DataLoader<{ postId: string, user: User }, Vote | null>(async (keys) => {
    const updoots = await Vote.findByIds(keys as any)

    const updootIdsToUpdoot: Record<string, Vote> = {}

    updoots.forEach(updoot => {
        updootIdsToUpdoot[`${updoot.user.id}|${updoot.postId}`] = updoot
    })

    return keys.map((key) => updootIdsToUpdoot[`${key.user.id}|${key.postId}`])
})