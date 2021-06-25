// import { User } from "src/entities/User";
import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const user: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if(!context.req.session.userId) {
        return next()
    }

    // const user = await User.findOne(context.req.session.userId)

    return next()
}