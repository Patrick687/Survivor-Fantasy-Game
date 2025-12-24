import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(): Promise<User | null> {
    return null;
  }
}
