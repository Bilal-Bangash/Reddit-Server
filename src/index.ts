import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

//creating mikro-orm instance it return promise

const main = async () => {
  //database connection
  const mikroORM = await MikroORM.init(mikroConfig);
  //run migrations
  await mikroORM.getMigrator().up();

  // create express server

  const app = express();

  //simple get request
  app.get("/", (_req, res) => {
    return res.status(200).json({ message: "Assalam o Aliekum" });
  });

  app.listen(3000, () => console.log("listening on PORT 3000"));

  //   create simple post

  //   const post = mikroORM.em.create(Post, { title: "My first post" });
  //   await mikroORM.em.persistAndFlush(post);

  //get all posts
  // const posts = await mikroORM.em.find(Post, {});
  // console.log("posts", posts);
};

main().catch((err) => console.error("error", err));
