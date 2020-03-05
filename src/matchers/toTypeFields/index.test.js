import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { getIntrospectionQuery, graphqlSync } from 'graphql';
import { TestType, TestObjectType } from './type.test.ts';
import Resolver from './resolver.test.ts';
import matcher from './';

const introspection = graphqlSync(
  buildSchemaSync({
    resolvers: [Resolver]
  }),
  getIntrospectionQuery()
);

expect.extend(matcher);

describe('.toTypeFields', () => {
  test('passes when given Correct Resolver', () => {
    expect(introspection).toTypeFields(TestType, {
      id: Number,
      name: String,
      list: [Number],
      auther: [TestObjectType],
      otherAuther: TestObjectType
    });

    expect(introspection).toTypeFields(TestObjectType, {
      id: Number
    });
  });
});
