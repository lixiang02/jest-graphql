import { Resolver, Query, Arg } from "type-graphql"

@Resolver()
export default class Test {
    @Query(type => [String])
    async testSuccess() {
        return 'success'
    }
    @Query(type => String)
    async testWithArg(
        @Arg('testArg', type => Number) testArg: Number,
    ) {
        return 'success'
    }
}
