import "reflect-metadata";
import { createConnection } from "typeorm"
import express from 'express'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import connectRedis from 'connect-redis'
import cors from 'cors'
const { graphqlUploadExpress } = require('graphql-upload');

import { UserResolver } from "./resolvers/user";
import { redis } from "./redis";
import { PostResolver } from "./resolvers/post";
import { SubPageResolver } from "./resolvers/subs";
import { VoteResolver } from "./resolvers/votes";
import { createUpdootLoader } from "./utils/createCommentLoader";

const main = async () => {
  await createConnection();

  const app = express()
  const RedisStore = connectRedis(session)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, SubPageResolver, VoteResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, commentLoader: createUpdootLoader() }),
    uploads: false 
  })

  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
  };
  app.use(cors(corsOptions));

  app.use(session({
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    name: 'qid',
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        sameSite: "lax",
      },
  }))

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(3001, () => {
    console.log('Server is running at http://localhost:3001/graphql');
  })
}

main().catch(err => console.log(err))
