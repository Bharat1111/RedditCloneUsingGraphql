import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  // ObjectType,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";
import { MyContext } from "../types";
import { isAuth } from "../utils/isAuth";
// import { Sub } from "../entity/Sub";

@InputType()
class voteInput {
  @Field()
  identifier: string;
  @Field()
  slug: string;
  @Field()
  value: number;
}

@Resolver()
export class VoteResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("voteInput") { identifier, slug, value }: voteInput,
    @Ctx() { req }: MyContext
  ) {
    if (![-1, 0, 1].includes(value)) {
      throw new Error("Values not valid");
    }

    const user = await User.findOne(req.session.userId);
    let post = await Post.findOne({ identifier, slug });
    if (!post) {
      throw new Error("Post doesn't exist");
    }

    let vote: Vote | undefined;

    // find by post
    vote = await Vote.findOne({ user, post });

    if (!vote && value === 0) {
      // if no vote and value = 0 return error
      throw new Error("You can't vote 'nothing'");
    } else if (!vote) {
      vote = await Vote.create({ user, value, post }).save();
    } else if (value === 0) {
      // vote exists remove vote from table
      await vote.remove();
    } else if (vote.value !== value) {
      // vote changes (value)
      vote.value = value;
      vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["sub", "votes"] }
    );

    post.setUserVote(user!);
    // post.comments.forEach(c => c.setUserVote(user!))

    return true;
  }
}
