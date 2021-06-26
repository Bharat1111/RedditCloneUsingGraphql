import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
  } from "type-graphql";
  import { getConnection, getRepository } from "typeorm";
  const { GraphQLUpload } = require("graphql-upload");
  import { createWriteStream } from "fs";
  
  import { User } from "../entities/User";
  import { Sub } from "../entities/Sub";
  import { isAuth } from "../utils/isAuth";
  import { Upload, MyContext } from "../types";
  import { Post } from "../entities/Post";
  import { user } from "../utils/user";
  
  @InputType()
  class SubInput {
    @Field()
    name: string;
    @Field()
    title: string;
    @Field({ nullable: true })
    description: string;
  }
  
  @Resolver()
  export class SubPageResolver {
    @Mutation(() => Sub, { nullable: true })
    @UseMiddleware(isAuth)
    async createSub(
      @Arg("subInput") { name, title, description }: SubInput,
      @Ctx() { req }: MyContext
    ) {
      const user = await User.findOne(req.session.userId)
  
      const oldsub = await getRepository(Sub)
        .createQueryBuilder("sub")
        .where("lower(sub.name) = :name", { name: name.toLowerCase() })
        .getOne();
  
      if (oldsub) {
        throw new Error("That sub already exists");
      }
      const sub = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Sub)
      .values([
          { name, description, title, user },
       ])
       .returning('*')
      .execute();
      return sub.raw[0]
    }

    @Query(() => Sub)
    @UseMiddleware(user)
    async getSub(
      @Arg('name') name: string,
      @Ctx() { req }: MyContext
    ) {
      let sub: Sub
      try {
        sub = await Sub.findOneOrFail({ name })
        const posts = await Post.find({
          where: { subName: sub },
          order: { createdAt: 'DESC'},
          relations: ['comments', 'votes']
        })

        sub.posts = posts

        if(req.session.userId) {
          const user= await User.findOneOrFail(req.session.userId)
          sub.posts.forEach(p => p.setUserVote(user))
        }
      } catch (error) {
        throw new Error('Sub not exists')
      }
      return sub
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async addProfilePicture(@Arg("picture", () => GraphQLUpload) {createReadStream, filename}: Upload) {
      const writableStream = createWriteStream(
        `${__dirname}/../../images/${filename}`,
        { autoClose: true }
      );
      return new Promise((res, rej) => {
        createReadStream()
          .pipe(writableStream)
          .on("finish", () => res(true))
          .on("error", () => rej(false));
      });
  }
  }