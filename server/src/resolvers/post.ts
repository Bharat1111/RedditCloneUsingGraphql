import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Sub } from "../entities/Sub";
import { MyContext } from "../types";
import { isAuth } from "../utils/isAuth";
import { Comment } from "../entities/Comment";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  getPosts() {
    return Post.find({
      order: { createdAt: "DESC" },
    });
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

    return Post.create({ body, title, user, sub: subRecord }).save()
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

    const user = await User.findOne(req.session.userId)

    const comment = await Comment.create({
      body,
      post,
      user,
    }).save();

    return comment;
  }
}
