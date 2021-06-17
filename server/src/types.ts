import { Request, Response } from "express";
import { createCommentLoader } from "./utils/createCommentLoader";

export interface MyContext {
    req: Request & { session: {
        userId: any
    }};
    res: Response;
    commentLoader: ReturnType<typeof createCommentLoader>
}