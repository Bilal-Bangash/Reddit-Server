import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import { StarterResolver } from "./resolvers/firstResolver";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import cors from "cors";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

//creating mikro-orm instance it return promise

const main = async () => {
  //database connection
  const mikroORM = await MikroORM.init(mikroConfig);
  //run migrations
  await mikroORM.getMigrator().up();

  // create express server

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  redisClient.on("connect", function () {
    console.log("Connected");
  });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true, //security reason for javascript code in frontend you can't access the cookie
        sameSite: "lax", //crsf
        // secure: __prod__, //cookies only works on https
      },
      saveUninitialized: false,
      secret: "saddsfewfsdvsdrecfsdfwqregvcdew",
      resave: false,
    })
  );
  //setting up Apollo GraphQL Server

  // we need a graphql schema
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [StarterResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: mikroORM.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    // cors: { origin: "http://localhost:3000" },
    cors: false,
  });

  app.listen(4000, () => console.log("listening on PORT 4000"));

  //   create simple post

  //   const post = mikroORM.em.create(Post, { title: "My first post" });
  //   await mikroORM.em.persistAndFlush(post);

  //get all posts
  // const posts = await mikroORM.em.find(Post, {});
  // console.log("posts", posts);
};

main().catch((err) => console.error("error", err));
