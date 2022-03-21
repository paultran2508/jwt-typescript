
import { GraphqlServer } from './connects/ApolloServer';
import { Postgres } from './connects/Postgres';
import type { Express, Request, Response } from 'express'
import refreshTokenRouter from './routes/refreshTokenRouter';
import cookieParser from 'cookie-parser';
import cors from 'cors'

interface Public {
  req: Request
  res: Response
  postgres: Postgres

}

export class App {

  public postgres: Postgres
  public apolloServer: GraphqlServer

  constructor(private server: Express) {

    this.postgres = new Postgres({
      database: process.env.DB_DATABASE_NAME as string,
      username: process.env.DB_USERNAME as string,
      password: process.env.DB_PASSWORD as string,
    })

    this.server.use(cookieParser())
    this.server.use(cors({
      origin: 'http://localhost:3000',
      credentials: true
    }))
    this.server.use('/refresh_token', refreshTokenRouter)

    this.apolloServer = new GraphqlServer(server)



  }

  async startServerOnPort() {
    const port = process.env.PORT || 5000
    this.server.listen(port, async () => {
      console.log(`Started Sever on port ${port}`)
    })

  }

  async run(): Promise<void[]> {


    this.apolloServer.run()
    return Promise.all([this.postgres.conn(), this.startServerOnPort(),])
  }

  public(): Public {
    return {
      req: this.server.request,
      res: this.server.response,
      postgres: this.postgres

    }
  }

}