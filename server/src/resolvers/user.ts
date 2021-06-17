import { User } from "../entities/User";
import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "../types";

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hello";
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
}
