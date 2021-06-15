// import { isEmpty } from "class-validator";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection, getRepository } from "typeorm";

import { Sub } from "../entity/Sub";
import { isAuth } from "../middlewares/isAuth";
import { MyContext } from "../types";

@InputType()
class SubInput {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field()
  description: string;
}

@Resolver()
export class SubResolver {
  @Mutation(() => Sub, { nullable: true })
  @UseMiddleware(isAuth)
  async createSub(
    @Arg("subInput") { name, title, description }: SubInput,
    @Ctx() { res }: MyContext
  ) {
    const user = res.locals.user

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
}
