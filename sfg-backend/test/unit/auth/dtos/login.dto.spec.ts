import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from 'src/auth/dtos/login.dto';

describe('LoginDto', () => {
  describe('userNameOrEmail transformation', () => {
    it('should transform email to lowercase', () => {
      // Arrange
      const input = {
        userNameOrEmail: 'TEST@EXAMPLE.COM',
        password: 'TestPass123!',
      };

      // Act
      const dto = plainToInstance(LoginDto, input);

      // Assert
      expect(dto.userNameOrEmail).toBe('test@example.com');
    });

    it('should transform username to lowercase', () => {
      // Arrange
      const input = {
        userNameOrEmail: 'TESTUSER123',
        password: 'TestPass123!',
      };

      // Act
      const dto = plainToInstance(LoginDto, input);

      // Assert
      expect(dto.userNameOrEmail).toBe('testuser123');
    });

    it('should handle mixed case email', () => {
      // Arrange
      const input = {
        userNameOrEmail: 'TesT@ExAmPlE.CoM',
        password: 'TestPass123!',
      };

      // Act
      const dto = plainToInstance(LoginDto, input);

      // Assert
      expect(dto.userNameOrEmail).toBe('test@example.com');
    });

    it('should handle mixed case username', () => {
      // Arrange
      const input = {
        userNameOrEmail: 'TestUser123',
        password: 'TestPass123!',
      };

      // Act
      const dto = plainToInstance(LoginDto, input);

      // Assert
      expect(dto.userNameOrEmail).toBe('testuser123');
    });

    it('should handle undefined userNameOrEmail gracefully', () => {
      // Arrange
      const input = {
        userNameOrEmail: undefined,
        password: 'TestPass123!',
      };

      // Act
      const dto = plainToInstance(LoginDto, input);

      // Assert
      expect(dto.userNameOrEmail).toBeUndefined();
    });
  });

  describe('userNameOrEmail validation', () => {
    it('should validate valid email addresses', async () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'email123@test-domain.com',
        'a@b.co',
      ];

      for (const email of validEmails) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: email,
          password: 'ValidPass123!',
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const userNameOrEmailErrors = errors.filter(
          (error) => error.property === 'userNameOrEmail',
        );
        expect(userNameOrEmailErrors).toHaveLength(0);
      }
    });

    it('should validate valid usernames (7+ characters)', async () => {
      // Arrange
      const validUsernames = [
        'username123',
        'testuser',
        'valid_user_name',
        'user1234567',
      ];

      for (const username of validUsernames) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: username,
          password: 'ValidPass123!',
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const userNameOrEmailErrors = errors.filter(
          (error) => error.property === 'userNameOrEmail',
        );
        expect(userNameOrEmailErrors).toHaveLength(0);
      }
    });

    it('should reject invalid email addresses', async () => {
      // Arrange - Only test truly invalid values that don't pass as usernames either
      const invalidValues = [
        'bad@', // Invalid email AND too short for username
        '@bad', // Invalid email AND too short for username
        'a@b', // Invalid email AND too short for username
        'user@', // Invalid email but only 5 chars (too short for username)
      ];

      for (const value of invalidValues) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: value,
          password: 'ValidPass123!',
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const userNameOrEmailErrors = errors.filter(
          (error) => error.property === 'userNameOrEmail',
        );
        expect(userNameOrEmailErrors.length).toBeGreaterThan(0);
      }
    });

    it('should reject usernames shorter than 7 characters', async () => {
      // Arrange
      const shortUsernames = ['user', 'test', 'a', 'usr123'];

      for (const username of shortUsernames) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: username,
          password: 'ValidPass123!',
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const userNameOrEmailErrors = errors.filter(
          (error) => error.property === 'userNameOrEmail',
        );
        expect(userNameOrEmailErrors.length).toBeGreaterThan(0);
        expect(userNameOrEmailErrors[0].constraints).toEqual(
          expect.objectContaining({
            UserNameOrEmail: 'Username must be at least 7 characters long.',
          }),
        );
      }
    });

    it('should reject null or empty userNameOrEmail', async () => {
      // Arrange
      const invalidValues = [null, '', undefined];

      for (const value of invalidValues) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: value,
          password: 'ValidPass123!',
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const userNameOrEmailErrors = errors.filter(
          (error) => error.property === 'userNameOrEmail',
        );
        expect(userNameOrEmailErrors.length).toBeGreaterThan(0);
      }
    });

    it('should provide correct error message for short username', async () => {
      // Arrange - Use a value that's clearly a short username
      const dto = plainToInstance(LoginDto, {
        userNameOrEmail: 'short', // 5 characters, too short for username
        password: 'ValidPass123!',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      const userNameOrEmailErrors = errors.filter(
        (error) => error.property === 'userNameOrEmail',
      );
      expect(userNameOrEmailErrors.length).toBeGreaterThan(0);
      expect(userNameOrEmailErrors[0].constraints).toEqual(
        expect.objectContaining({
          UserNameOrEmail: 'Username must be at least 7 characters long.',
        }),
      );
    });
  });

  describe('password validation', () => {
    it('should validate passwords with 8+ characters', async () => {
      // Arrange
      const validPasswords = [
        'password123',
        'ValidPass!',
        'MySecurePassword2024',
        '12345678',
      ];

      for (const password of validPasswords) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: 'test@example.com',
          password,
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const passwordErrors = errors.filter(
          (error) => error.property === 'password',
        );
        expect(passwordErrors).toHaveLength(0);
      }
    });

    it('should reject passwords shorter than 8 characters', async () => {
      // Arrange
      const shortPasswords = ['pass', '123', 'short', '1234567'];

      for (const password of shortPasswords) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: 'test@example.com',
          password,
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const passwordErrors = errors.filter(
          (error) => error.property === 'password',
        );
        expect(passwordErrors.length).toBeGreaterThan(0);
        expect(passwordErrors[0].constraints).toEqual(
          expect.objectContaining({
            minLength: 'Password must be at least 8 characters long.',
          }),
        );
      }
    });

    it('should reject null or empty passwords', async () => {
      // Arrange
      const invalidPasswords = [null, '', undefined];

      for (const password of invalidPasswords) {
        const dto = plainToInstance(LoginDto, {
          userNameOrEmail: 'test@example.com',
          password,
        });

        // Act
        const errors = await validate(dto);

        // Assert
        const passwordErrors = errors.filter(
          (error) => error.property === 'password',
        );
        expect(passwordErrors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('other fields', () => {
    it('should not transform password case', () => {
      // Arrange
      const input = {
        userNameOrEmail: 'test@example.com',
        password: 'TestPass123!',
      };

      // Act
      const dto = plainToInstance(LoginDto, input);

      // Assert
      expect(dto.password).toBe('TestPass123!'); // Password should remain unchanged
    });
  });

  describe('complete DTO validation', () => {
    it('should pass validation with valid email and password', async () => {
      // Arrange
      const dto = plainToInstance(LoginDto, {
        userNameOrEmail: 'test@example.com',
        password: 'ValidPass123!',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid username and password', async () => {
      // Arrange
      const dto = plainToInstance(LoginDto, {
        userNameOrEmail: 'testuser123',
        password: 'ValidPass123!',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with multiple invalid fields', async () => {
      // Arrange
      const dto = plainToInstance(LoginDto, {
        userNameOrEmail: 'bad',
        password: 'short',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(2);
      expect(errors.some((error) => error.property === 'userNameOrEmail')).toBe(
        true,
      );
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });
  });
});
