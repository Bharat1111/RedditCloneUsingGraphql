import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";
// import { User } from "../entity/User";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not Authenticated");
  }

  // const userId = context.req.session.userId;

  // const user = await User.findOne(userId);
  
  // if (!user) throw new Error("Unauthenticated");

  return next();
};
