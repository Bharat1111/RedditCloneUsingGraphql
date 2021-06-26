import { Request, Response } from "express";
import { Stream } from "stream";

import {createUpdootLoader}  from "./utils/createCommentLoader";

export interface MyContext {
    req: Request & { session: {
        userId: any
    }};
    res: Response;
    commentLoader: ReturnType<typeof createUpdootLoader>
}


export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}