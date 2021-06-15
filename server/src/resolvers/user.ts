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
import jwt from "jsonwebtoken";
import { MyContext } from "src/types";
// import cookie from 'cookie'

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
  async me(@Ctx() { res, req }: MyContext) {
    try {
      const token = req.cookies.qid;

      if (!token) {
        return null;
      }

      const { username }: any = jwt.verify(
        token,
        "kahdoih3i2boichdibiooy09kjvcbjchsihi"
      );
      
      const user = await User.findOne(
        username.includes("@")
        ? { where: { email: username } }
        : { where: { username: username } }
        );
      res.locals.user = user

      return user
    } catch (error) {
      return null;
    }
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("UserInput") { username, email, password }: UserInput
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
              message: "Username already taken",
            },
          ],
        };
      }
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
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

    const token = jwt.sign(
      { "username": usernameOrEmail },
      "kahdoih3i2boichdibiooy09kjvcbjchsihi",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("qid", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    // return new Promise((resolve) =>
    //   req.cookies.destroy((err) => {
    //     if (err) {
    //       console.log(err);
    //       resolve(false);
    //       return;
    //     }

    //     res.clearCookie('qid');
    //     resolve(true);
    //   })
    // );
    if(!req.cookies.qid) return false

    res.cookie('qid', '', {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0)
    })

    return true;
  }
}
