import { ObjectType, Field } from "type-graphql"

@ObjectType({ description: "test type other type" })
export class TestObjectType {
  @Field({ nullable: true })
  id: number
}

@ObjectType({ description: "test type" })
export class TestType {
  @Field({ nullable: true })
  id: number

  @Field({ nullable: true })
  name: string

  @Field(type => [Number], { nullable: true })
  list: number[]

  @Field(type => [TestObjectType], { nullable: true })
  auther: TestObjectType

  @Field(type => TestObjectType, { nullable: true })
  otherAuther: TestObjectType
}