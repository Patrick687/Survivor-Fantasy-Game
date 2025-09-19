import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterDto } from './dto/register.dto';
import { AuthPayload } from 'src/graphql/graphql';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => AuthPayload)
    async register(@Args('body') input: RegisterDto): Promise<AuthPayload> {
        return this.authService.register(input);
    }

    @Mutation(() => AuthPayload)
    async login(@Args('body') input: LoginDto): Promise<AuthPayload> {
        return this.authService.login(input);
    }
}