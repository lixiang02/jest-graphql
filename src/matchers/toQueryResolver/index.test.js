import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { getIntrospectionQuery, graphqlSync } from 'graphql';
import Resolver from './resolver.test.ts';
import matcher from './';

const introspection = graphqlSync(
  buildSchemaSync({
    resolvers: [Resolver]
  }),
  getIntrospectionQuery()
);

const instantiate = new Resolver();

expect.extend(matcher);

describe('.toQueryResolver', () => {
  test('passes when given Correct Resolver', () => {
    expect(introspection).toQueryResolver([
      {
        resolver: instantiate.testSuccess,
        type: [String],
        args: []
      },
      {
        resolver: instantiate.testWithArg,
        type: String,
        args: {
          testArg: Number
        }
      }
    ]);
  });
});
