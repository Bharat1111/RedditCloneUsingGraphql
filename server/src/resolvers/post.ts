import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
  FieldResolver,
  Int,
  Root
} from "type-graphql";

import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Sub } from "../entities/Sub";
import { MyContext } from "../types";
import { isAuth } from "../utils/isAuth";
import { user } from "../utils/user";
import { Comment } from "../entities/Comment";
import { getRepository } from "typeorm";
// import { Connection } from "typeorm";

@ObjectType()
class CountsResponse {
  @Field()
  comments: number
  @Field()
  voteScore: number
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { commentLoader, req }: MyContext
  ) {
    if(!req.session.userId) {
      return null
    }
    console.log('post loader', post)
    const user = User.findOne(req.session.userId)

    const updoot = await commentLoader.load({postId: post.id, user }) 

    return updoot ? updoot.value : null
  }
  // @FieldResolver(() => Comment)
  // async comments(
  //   @Root() comment: Comment,
  //   @Ctx() { commentLoader }: MyContext
  // ) {
  //   return commentLoader.load(comment.postId)
  // }

  @Query(() => [Post])
  @UseMiddleware(user)
  async getPosts(
    @Ctx() { req }: MyContext
  ) {

    // const users = await connection
    // .getRepository(User)
    // .createQueryBuilder("user")
    // .leftJoinAndSelect("user.photos", "photo")
    // .getMany();
    // const userRepository = getRepository(User);
    // const users = await userRepository.find({ relations: ["photos"] });
    const user = await User.findOne(req.session.userId)

    const postRepository = await getRepository(Post);

    const questions = await postRepository.find();

    if(req.session.userId) {
      questions.forEach(p => p.setUserVote(user!))
    }

    return questions
  }

  @Query(() => Post, { nullable: true })
  async getPost(
    @Arg("identifier") identifier: string,
    @Arg("slug") slug: string
  ) {
    try {
      return Post.findOneOrFail({ identifier, slug });
    } catch (error) {
      return null;
    }
  }

  @Query(() => CountsResponse)
  async getCounts(@Arg("identifier") identifier: string, @Arg("slug") slug: string) {
    try {
      const post =await Post.findOneOrFail({ identifier, slug });
      return { comments: post.commentCount, voteScore: post.voteScore }
    } catch (error) {
      throw new Error("Post doesn't exists");
    }
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Arg("sub") sub: string,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const user = await User.findOne(userId);

    const subRecord = await Sub.findOneOrFail({ name: sub });

    return Post.create({ body, title, user, sub: subRecord }).save();
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("body") body: string,
    @Arg("identifier") identifier: string,
    @Arg("slug") slug: string,
    @Ctx() { req }: MyContext
  ) {
    const post = await Post.findOneOrFail({ identifier, slug });
    if (!post) {
      throw new Error("Post doesn't exists");
    }

    const user = await User.findOne(req.session.userId);

    const comment = await Comment.create({
      body,
      post,
      user,
    }).save();

    return comment;
  }
}
