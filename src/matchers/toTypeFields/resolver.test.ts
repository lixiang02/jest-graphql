import { Resolver, Query, Arg } from "type-graphql"
import { TestType } from './type.test'

@Resolver()
export default class Test {
    @Query(type => [TestType])
    async testSuccess() {
        return 'success'
    }

    @Query(type => TestType)
    async testWithArg(
        @Arg('testArg', type => Number) testArg: Number,
    ) {
        return 'success'
    }
}
