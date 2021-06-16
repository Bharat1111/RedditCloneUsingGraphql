import "reflect-metadata";
import express from "express";
import dotenv from 'dotenv'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cors from 'cors'
import cookieParser from "cookie-parser";
import session from 'express-session'
import connectRedis from 'connect-redis'

import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { SubResolver } from "./resolvers/subs";
import { Sub } from "./entity/Sub";
import { Comment } from "./entity/Comment";
import { redis } from "./redis";
import { Vote } from "./entity/Vote";
import { VoteResolver } from "./resolvers/vote";

dotenv.config()
const main = async () => {
  await createConnection({
    type: "postgres",
    database: "redditclone",
    username: "postgres",
    password: "lsg@11_",
    logging: true,
    synchronize: true,
    // migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Post, Sub, Comment, Vote],
  });

  const RedisStore = connectRedis(session);
  const app = express();

  app.use(cookieParser())
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, SubResolver, VoteResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({
    app,
  });

  app.listen(process.env.PORT, () => {
    console.log("Server started on port 3001");
  });
};

main().catch((err) => {
  console.log(err);
});
