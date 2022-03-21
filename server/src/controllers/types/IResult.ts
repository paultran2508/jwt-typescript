import { Field, InterfaceType } from "type-graphql"

@InterfaceType()
export class IResult {
  @Field()
  code: number
  @Field()
  message?: string
  @Field()
  success:boolean
}