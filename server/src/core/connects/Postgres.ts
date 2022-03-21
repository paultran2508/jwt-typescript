import Entities from "./../../entities";
import { createConnection } from "typeorm";

interface Config {
  database: string;
  type?: string;
  username: string;
  password: string;
}

export class Postgres {
  entities: Function[];
  constructor(public config: Config) {}

  async conn(): Promise<void> {
    console.log("loading postgres");

    await createConnection({
      ...this.config,
      type: "postgres",
      synchronize: true,
      logging: true,
      entities: Entities,
    });

    console.log("Started postgres");
  }
}
