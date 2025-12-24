import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthSession } from './auth-session.entity';
import { NotImplementedException } from '@nestjs/common';
import { SignupInput } from './dto/signup.input';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { LoginInput } from './dto/login.input';

@Resolver(() => AuthSession)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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

  @Mutation(() => AuthSession, { nullable: false, name: 'login' })
  async login(@Args('input') input: LoginInput): Promise<AuthSession> {
    return await this.authService.login(input);
  }

  @ResolveField(() => User, { nullable: false, name: 'me' })
  async me(@Parent() session: AuthSession): Promise<User> {
    return await this.authService.getUserFromSession(session);
  }
}
