import argon2 from "argon2";
import { User } from "../entity/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "src/types";

@InputType()
class UserInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class Error {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    try {
      const userId = req.session.userId
      console.log(userId)
      if(!userId) return null
      
      const user = await User.findOne(userId);
      
      if(!user) return null
      return user
    } catch (error) {
      return null;
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("UserInput") { username, email, password }: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be greater than 2 letters",
          },
        ],
      };
    }

    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(email)) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is not valid!",
          },
        ],
      };
    }

    if (password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be greater than 6 letters",
          },
        ],
      };
    }

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
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "Username or Email already taken",
            },
          ],
        };
      }
    }

    req.session.userId = user.id
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ) {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Username or Email doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect Password",
          },
        ],
      };
    }

    // const token = jwt.sign(
    //   { "username": usernameOrEmail },
    //   "kahdoih3i2boichdibiooy09kjvcbjchsihi",
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    // res.cookie("gvfebfdbg", user.id, {
    //   httpOnly: true,
    //   // path: "/",
    //   secure: process.env.NODE_ENV === "production",
    // });
    req.session.userId = user.id

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    if(!req.session.userId) {
      return false
    }
    return new Promise((resolve) =>

      req.session.destroy((err: any) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie('qid');
        resolve(true);
      })
    );
  }
}
