import { SignupDto } from 'generated/graphql';

export class SignupDataBuilder {
  private data: Partial<SignupDto> = {};

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withFirstName(firstName: string): this {
    this.data.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.data.lastName = lastName;
    return this;
  }

  withUserName(userName: string): this {
    this.data.userName = userName;
    return this;
  }

  withData(data: Partial<SignupDto>): this {
    this.data = { ...this.data, ...data };
    return this;
  }

  build(): SignupDto {
    return {
      email: 'default-test@test.com',
      password: 'Asdf1234!',
      firstName: 'Default',
      lastName: 'Test',
      userName: 'defaulttestuser',
      ...this.data,
    };
  }
}
