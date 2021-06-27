import { User } from "../entities/User";
import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "../types";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User)
  user: User
  @Field(() => [Post])
  posts: Post[]
  @Field(() => [Comment])
  comments: Comment[]
}
@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if(req.session.userId)
    return User.findOne(req.session.userId)

    return null
  }

  @Mutation(() => User, { nullable: true })
  async register(
    @Arg("RegisterInput") { username, email, password }: RegisterInput,
    @Ctx() { req }: MyContext
  ) {
    const hashedPassword = await argon2.hash(password);

    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username,
          email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (error) {
      if(error.code === 23505) {
          return null
      }
    }

    req.session.userId = user.id
    return user;
}

@Mutation(() => User, { nullable: true })
async login(
      @Arg('usernameOrEmail') usernameOrEmail: string,
      @Arg('password') password: string,
      @Ctx() { req }: MyContext
  ) {
      const user = await User.findOne(usernameOrEmail.includes('@') ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } })

    if(!user) {
        return null
    }
    const valid = await argon2.verify(user.password, password)
    if(!valid) {
        return null
    }
    
    req.session.userId = user.id
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
      if(!req.session.userId) {
          return false
      }
      return new Promise((resolve) => {
          req.session.destroy(err => {
              if(err) {
                resolve(false)
                return
              }

              res.clearCookie('qid');
              resolve(true);
          })
      })
  }

  @Query(() => UserResponse)
  async getUsetPosts(
    @Arg('username') username: string,
    @Ctx() { req }: MyContext
  ) {
    try {
      const user = await User.findOneOrFail({ username },
        { select: ['username', 'createdAt']})
      const posts = await Post.find({
        where: { user }, order: {createdAt: 'DESC'}
      })

      const comments = await Comment.find({ where: {username}, relations: ["post"], order: {createdAt: 'DESC'} })

      if(req.session.userId) {
        posts.forEach(p => p.setUserVote(user))
      }

      // let submissions: any[] = []
      // posts.forEach(p => submissions.push({ type: 'Post', ...p}))
      // comments.forEach(c => submissions.push({ type: 'Comment', ...c}))

      // submissions.sort((a, b) => {
      //   if(b.createdAt > a.createdAt) return 1
      //   if(b.createdAt < a.createdAt) return -1
      //   return 0
      // })
      return {user, posts, comments}
    } catch (error) {
      throw new Error('Something bad happen')
    }
  }
}
