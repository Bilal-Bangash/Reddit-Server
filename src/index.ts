import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

//creating mikro-orm instance it return promise

const main = async () => {
  const mikroORM = await MikroORM.init(mikroConfig);

  //run migrations
  await mikroORM.getMigrator().up();

  //   create simple post

  //   const post = mikroORM.em.create(Post, { title: "My first post" });
  //   await mikroORM.em.persistAndFlush(post);

  //get all posts
  const posts = await mikroORM.em.find(Post, {});
  console.log("posts", posts);
};

main().catch((err) => console.error("error", err));
