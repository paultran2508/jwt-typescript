import { Field } from "type-graphql";
import { ObjectType } from "type-graphql";
import { User } from "./../../entities/postgres/User";
import { IResult } from "./IResult";

@ObjectType({ implements: IResult })
export class UserResult implements IResult {
  code: number;
  message?: string;
  success: boolean;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}
