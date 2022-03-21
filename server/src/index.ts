import "dotenv/config";

import { App } from "./core/app";
import express from "express";

const main = async () => {
  const server = express();
  const app = new App(server);
  await app.run();
};
main();
