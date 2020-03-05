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

describe('.toTypeChildLen', () => {
  test('passes when given Correct Resolver', () => {
    expect(introspection).toTypeChildLen(TestType, 5);
    expect(introspection).toTypeChildLen(TestObjectType, 1);
  });
});
