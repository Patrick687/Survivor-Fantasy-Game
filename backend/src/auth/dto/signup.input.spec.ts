import expectValidate from 'src/test/utils/expectValidate';
import { SignupInput } from './signup.input';

describe('SignupInput Validation', () => {
  let si: SignupInput;

  beforeEach(() => {
    si = new SignupInput();
    si.firstName = 'John';
    si.lastName = 'Doe';
    si.userName = 'john123';
    si.email = 'john@example.com';
    si.password = 'StrongP@ssw0rd!';
    si.isPrivate = false;
  });

  it('should be valid with all correct fields', async () => {
    await expectValidate(si);
  });

  it('should be invalid with missing required fields', async () => {
    si.userName = '';
    si.email = '';
    si.password = '';
    await expectValidate(si, ['userName', 'email', 'password']);
  });

  it('should be invalid with short username', async () => {
    si.userName = 'abc';
    await expectValidate(si, ['userName']);
  });

  it('should be invalid with username containing spaces', async () => {
    si.userName = 'john doe';
    await expectValidate(si, ['userName']);
  });

  it('should be invalid with invalid email', async () => {
    si.email = 'not-an-email';
    await expectValidate(si, ['email']);
  });

  it('should be invalid with weak password', async () => {
    si.password = 'weak';
    await expectValidate(si, ['password']);
  });

  it('should be invalid if isPrivate is not boolean', async () => {
    // @ts-expect-error
    si.isPrivate = 'not-a-boolean';
    await expectValidate(si, ['isPrivate']);
  });

  it('should be valid with optional firstName and lastName omitted', async () => {
    si.firstName = undefined;
    si.lastName = undefined;
    await expectValidate(si);
  });

  it('should be invalid with firstName containing spaces', async () => {
    si.firstName = 'John Doe';
    await expectValidate(si, ['firstName']);
  });

  it('should be invalid with lastName containing spaces', async () => {
    si.lastName = 'Doe Smith';
    await expectValidate(si, ['lastName']);
  });
});
