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

//creating mikro-orm instance it return promise

const main = async () => {
  //database connection
  const mikroORM = await MikroORM.init(mikroConfig);
  //run migrations
  await mikroORM.getMigrator().up();

  // create express server

  const app = express();

  //setting up Apollo GraphQL Server

  // we need a graphql schema
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [StarterResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: mikroORM.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(3000, () => console.log("listening on PORT 3000"));

  //   create simple post

  //   const post = mikroORM.em.create(Post, { title: "My first post" });
  //   await mikroORM.em.persistAndFlush(post);

  //get all posts
  // const posts = await mikroORM.em.find(Post, {});
  // console.log("posts", posts);
};

main().catch((err) => console.error("error", err));
