import { AuthPayload, SignupDto, User, UserRole } from 'generated/graphql';
import { TestApp } from '../setup-nest-app';
import { signupMutation } from '../mutations';
import { expectGraphQLSuccess } from '../graphql-assertions';
import { DeepPartial } from '../types/deep-partial.types';
import { UserValidator } from '../validators/user.validator';

export class UserBuilder {
  constructor() {}

  public static async build(
    app: TestApp,
    userInfo?: Partial<SignupDto>,
    options?: { validate?: boolean },
  ): Promise<AuthPayload> {
    const defaultUserInfo: SignupDto = {
      email: 'default-test@test.com',
      password: 'Asdf1234!',
      firstName: 'Default',
      lastName: 'Test',
      userName: 'defaulttestuser',
    };

    const shouldValidate = options?.validate !== false;

    const data = { ...defaultUserInfo, ...(userInfo || {}) };

    const response = await app.mutation<'signup'>(signupMutation, {
      data: {
        ...data,
      },
    });

    if (shouldValidate) {
      expectGraphQLSuccess(response);
    }

    const userEntity: AuthPayload = response.body.data.signup as AuthPayload;
    if (shouldValidate) {
      UserBuilder.validateUserEntity(userEntity, data, app);
    }

    return userEntity;
  }

  private static validateUserEntity(
    userEntity: AuthPayload,
    inputData: SignupDto,
    app: TestApp,
  ) {
    const expectedUser: DeepPartial<User> = {
      email: inputData.email,
      role: UserRole.USER,
      profile: {
        firstName: inputData.firstName,
        lastName: inputData.lastName || null,
        userName: inputData.userName,
      },
    };

    UserValidator.validate(userEntity.user, expectedUser);
  }
}
