
import { NonEmptyArray } from 'type-graphql';
import { TestController } from './TestController';
import { UserController } from './UserController';

const Resolvers : NonEmptyArray<Function> = [

  UserController, 
  TestController
]

export default  Resolvers