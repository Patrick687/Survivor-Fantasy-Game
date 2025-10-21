import { TestApp } from '../setup-nest-app';
import { loginMutation, signupMutation } from '../mutations';
import {
  expectGraphQLError,
  expectGraphQLSuccess,
  SupportedExceptionClass,
} from '../graphql-assertions';
import { DeepPartial } from '../types/deep-partial.types';
import { UserValidator } from '../validators/user.validator';
import {
  AuthPayload,
  LoginDto,
  SignupDto,
  UserRole,
} from '../../../../generated/graphql';

export class AuthActions {
  constructor(private app: TestApp) {}

  async signup(data: SignupDto) {
    return this.app.mutation<'signup'>(signupMutation, { data: data });
  }

  async login(data: LoginDto) {
    return this.app.mutation<'login'>(loginMutation, { data: data });
  }

  async expectSignupToSucceed(data: SignupDto): Promise<AuthPayload> {
    const response = await this.signup(data);

    expectGraphQLSuccess(response);

    const authPayload = response.body.data.signup as AuthPayload;

    const expectedUser: DeepPartial<AuthPayload> = {
      user: {
        email: data.email,
        role: UserRole.USER,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
        },
      },
      token: expect.any(String),
    };

    this.validateAuthPayload(authPayload, expectedUser);
    return authPayload;
  }

  async expectLoginToSucceed(data: LoginDto): Promise<AuthPayload> {
    const response = await this.login(data);

    expectGraphQLSuccess(response);

    const authPayload = response.body.data.login as AuthPayload;

    this.validateAuthPayload(authPayload, { token: expect.any(String) });

    expect(
      authPayload.user.email === data.userNameOrEmail ||
        authPayload.user.profile.userName === data.userNameOrEmail,
    ).toBe(true);

    return authPayload;
  }

  async expectSignupToFail(
    data: SignupDto,
    exceptionClass?: SupportedExceptionClass,
    messageSegments?: string[],
  ): Promise<void> {
    const response = await this.signup(data);
    expectGraphQLError(response, exceptionClass, messageSegments);
  }

  async expectLoginToFail(
    data: LoginDto,
    exceptionClass?: SupportedExceptionClass,
    messageSegments?: string[],
  ): Promise<void> {
    const response = await this.login(data);
    expectGraphQLError(response, exceptionClass, messageSegments);
  }

  private validateAuthPayload(
    authPayload: AuthPayload,
    expectedPayload: DeepPartial<AuthPayload>,
  ): void {
    if (expectedPayload.user) {
      UserValidator.validate(authPayload.user, expectedPayload.user);
    }

    if (expectedPayload.token) {
      expect(authPayload.token).toBeDefined();
    }
  }
}
