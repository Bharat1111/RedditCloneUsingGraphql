import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { MyContext } from "../types";
import { isAuth } from "../middlewares/isAuth";
import { Post } from "../entity/Post";
import { Sub } from "../entity/Sub";
import { Comment } from "../entity/Comment";
import { User } from "../entity/User";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  getPosts() {
    return Post.find({
      order: { createdAt: "DESC" },
      relations: ['comments', 'votes', 'sub']
    });
  }

  @Query(() => Post)
  getPost(@Arg("identifier") identifier: string, @Arg("slug") slug: string) {
    try {
      return Post.findOneOrFail({ identifier, slug });
    } catch (err) {
      throw new Error("No post exists");
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
    const user = await User.findOne(userId)

    const subRecord = await Sub.findOneOrFail({ name: sub });

    return Post.create({ body, title, sub: subRecord, user }).save();
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async commentOnPost(
    @Arg("body") body: string,
    @Arg("identifier") identifier: string,
    @Arg("slug") slug: string,
    @Ctx() { req }: MyContext
  ) {
    const post = await Post.findOneOrFail({ identifier, slug });
    if (!post) {
      throw new Error("Post doesn't exists");
    }

    const user = await User.findOne(req.session.userId)

    const comment = await Comment.create({
      body,
      post: post,
      user,
    }).save();

    return comment;
  }
}
