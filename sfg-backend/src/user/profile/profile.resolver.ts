import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Profile } from '../profile/profile.entity';
import { ProfileService } from '../profile/profile.service';

@Resolver(() => User)
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) { }

    @ResolveField(() => Profile, { nullable: false })
    async profile(@Parent() user: User): Promise<Profile | null> {
        return this.profileService.getProfile({ userId: user.userId });
    }
}