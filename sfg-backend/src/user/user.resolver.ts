import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => String)
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'Hello, world!';
    }
}