import { validate } from 'class-validator';
import { LoginInput } from './login.input';
import { plainToInstance } from 'class-transformer';
import expectValidate from 'src/test/utils/expectValidate';

describe('LoginInput Validation', () => {
  let li: LoginInput;

  beforeEach(() => {
    li = new LoginInput();
  });

  describe('Valid Structure', () => {
    it('should be valid with correct email and password', async () => {
      li.userNameOrEmail = 'test@mail.com';
      li.password = 'StrongP@ssw0rd';
      await expectValidate(li);
    });
  });

  describe('usernNameOrEmail Field', () => {
    it('should be invalid when empty', async () => {
      li.userNameOrEmail = '';
      li.password = 'StrongP@ssw0rd';
      await expectValidate(li, ['userNameOrEmail']);
    });

    it('should be invalid when only whitespace', async () => {
      li.userNameOrEmail = '   ';
      li.password = 'StrongP@ssw0rd';
      await expectValidate(li, ['userNameOrEmail']);
    });

    it('should be valid with a proper username', async () => {
      li.userNameOrEmail = 'validUsername';
      li.password = 'StrongP@ssw0rd';
      await expectValidate(li);
    });

    it('should be valid with a proper email', async () => {
      li.userNameOrEmail = '  test@mail.com';
      li.password = 'StrongP@ssw0rd';
      await expectValidate(li);
    });
  });

  describe('password Field', () => {
    it('should be invalid when empty', async () => {
      li.userNameOrEmail = 'test@mail.com';
      li.password = '';
      await expectValidate(li, ['password']);

      li.userNameOrEmail = '';
      li.password = '';
      await expectValidate(li, ['userNameOrEmail', 'password']);
    });

    it('should be invalid when only whitespace', async () => {
      li.userNameOrEmail = '    ';
      li.password = '   ';
      await expectValidate(li, ['userNameOrEmail', 'password']);
    });
  });
});
