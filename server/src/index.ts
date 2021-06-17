import { createConnection } from "typeorm"
import express from 'express'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import connectRedis from 'connect-redis'

import { UserResolver } from "./resolvers/user";
import { redis } from "./redis";
import { PostResolver } from "./resolvers/post";
import { SubPageResolver } from "./resolvers/subs";
import { VoteResolver } from "./resolvers/votes";

const main = async () => {
  await createConnection();

  const app = express()
  const RedisStore = connectRedis(session)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, SubPageResolver, VoteResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res })
  })

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
  apolloServer.applyMiddleware({ app })

  app.listen(3001, () => {
    console.log('Server is running at http://localhost:3001/graphql');
  })
}

main().catch(err => console.log(err))
