import { LoginDto } from 'generated/graphql';

export class LoginDataBuilder {
  private data: Partial<LoginDto> = {};

  withEmail(email: string): this {
    this.data.userNameOrEmail = email;
    return this;
  }

  withUserName(userName: string): this {
    this.data.userNameOrEmail = userName;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withData(data: Partial<LoginDto>): this {
    this.data = { ...this.data, ...data };
    return this;
  }

  build(): LoginDto {
    return {
      userNameOrEmail: 'default-test@test.com',
      password: 'Asdf1234!',
      ...this.data,
    };
  }
}
