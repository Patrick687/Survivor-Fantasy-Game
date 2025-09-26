import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload.entity';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthPayloadDomain } from './entities/auth-payload.domain';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => AuthPayload)
    async signup(
        @Args('data') data: SignupDto,
    ): Promise<AuthPayloadDomain> {
        const authPayloadDomain: AuthPayloadDomain = await this.authService.signup(data);
        return {
            user: authPayloadDomain.user,
            token: authPayloadDomain.token
        };
    }

    @Mutation(() => AuthPayload)
    async login(
        @Args('data') data: LoginDto,
    ): Promise<AuthPayloadDomain> {
        const authPayloadDomain: AuthPayloadDomain = await this.authService.login(data);
        return {
            user: authPayloadDomain.user,
            token: authPayloadDomain.token
        };
    }
}