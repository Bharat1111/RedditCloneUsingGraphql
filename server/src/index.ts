import "reflect-metadata";
import express from "express";
import dotenv from 'dotenv'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import { User } from "./entity/User";
import cookieParser from "cookie-parser";
import { Post } from "./entity/Post";
import { SubResolver } from "./resolvers/subs";
import { Sub } from "./entity/Sub";
import { Comment } from "./entity/Comment";

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
    entities: [User, Post, Sub, Comment],
  });
  const app = express();

  app.use(cookieParser())

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, SubResolver],
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
