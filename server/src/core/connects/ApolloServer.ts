import { buildSchema } from "type-graphql";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core/dist/plugin/drainHttpServer";
import { ApolloServer, Config } from "apollo-server-express";
import { createServer, Server } from "http";
import type { Express } from "express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  PluginDefinition,
} from "apollo-server-core";
import { GraphQLSchema } from "graphql";
import Resolvers from "../../controllers";

export class GraphqlServer {
  public httpServer: Server;
  public server: ApolloServer;
  public config: Config;
  public schema: GraphQLSchema;
  public plugins: PluginDefinition[];

  constructor(public app: Express) {
    this.httpServer = createServer(app);
    this.plugins = [
      ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ];
  }

  async setSchema() {
    // console.log(Resolver)
    this.schema = await buildSchema({
      validate: false,
      resolvers: Resolvers,
    });
  }

  async run(): Promise<void> {
    console.log("Loading Graphql");
    await this.setSchema();

    this.server = new ApolloServer({
      schema: this.schema,
      plugins: this.plugins,
      context: (context) => context,
    });

    await this.server.start();
    this.server.applyMiddleware({
      app: this.app, cors: {
        origin: 'http://localhost:3000',
        credentials: true
      }
    });
    console.log(
      "Started ApolloServer http://localhost:5000" + this.server.graphqlPath
    );
  }
}
