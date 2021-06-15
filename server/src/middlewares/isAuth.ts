import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";
import jwt from 'jsonwebtoken'
import { User } from "../entity/User";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.cookies.qid) {
    throw new Error("Not Authenticated");
  }

  const token = context.req.cookies.qid;

  const { username }: any = jwt.verify(token, "kahdoih3i2boichdibiooy09kjvcbjchsihi");

  const user = await User.findOne(username.includes('@') ? 
    {where: {email: username}} : {where: {username: username}}
  );
  if (!user) throw new Error("Unauthenticated");

  context.res.locals.user = user;

  return next();
};
