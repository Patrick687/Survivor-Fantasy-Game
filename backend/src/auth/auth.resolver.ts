import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthSession } from './auth-session.entity';
import { SignupInput } from './dto/signup.input';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { LoginInput } from './dto/login.input';
import { Public } from 'src/common/decorator/public.decorator';
import { VerifySessionInput } from './dto/verify-session.input';

@Resolver(() => AuthSession)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthSession, { nullable: false, name: 'signup' })
  async signup(@Args('input') input: SignupInput): Promise<AuthSession> {
    return await this.authService.signup({
      userArgs: {
        email: input.email,
        userName: input.userName,
        firstName: input.firstName,
        lastName: input.lastName,
        isPrivate: input.isPrivate,
      },
      passwordArgs: {
        password: input.password,
      },
    });
  }

  @Public()
  @Mutation(() => AuthSession, { nullable: false, name: 'login' })
  async login(@Args('input') input: LoginInput): Promise<AuthSession> {
    return await this.authService.login(input);
  }

  @Public()
  @Query(() => AuthSession, { nullable: false, name: 'verifySession' })
  async verifySession(
    @Args('input') input: VerifySessionInput,
  ): Promise<AuthSession> {
    return await this.authService.verifySession({ token: input.token });
  }

  @ResolveField(() => User, { nullable: false, name: 'me' })
  async me(@Parent() session: AuthSession): Promise<User> {
    return await this.authService.getUserFromSession(session);
  }
}
