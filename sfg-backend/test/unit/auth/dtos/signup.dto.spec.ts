import { plainToInstance } from 'class-transformer';
import { SignupDto } from 'src/auth/dtos/signup.dto';

describe('SignupDto', () => {
  describe('email transformation', () => {
    it('should transform email to lowercase', () => {
      // Arrange
      const input = {
        email: 'TEST@EXAMPLE.COM',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.email).toBe('test@example.com');
    });

    it('should handle mixed case email', () => {
      // Arrange
      const input = {
        email: 'TesT@ExAmPlE.CoM',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.email).toBe('test@example.com');
    });

    it('should handle undefined email gracefully', () => {
      // Arrange
      const input = {
        email: undefined,
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.email).toBeUndefined();
    });
  });

  describe('userName transformation', () => {
    it('should transform userName to lowercase', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'TESTUSER123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.userName).toBe('testuser123');
    });

    it('should handle mixed case userName', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'TestUser123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.userName).toBe('testuser123');
    });

    it('should handle undefined userName gracefully', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: undefined,
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.userName).toBeUndefined();
    });
  });

  describe('other fields', () => {
    it('should not transform password case', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.password).toBe('TestPass123!'); // Password should remain unchanged
    });

    it('should not transform firstName case', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
        firstName: 'JOHN',
        lastName: 'DOE',
        userName: 'testuser123',
      };

      // Act
      const dto = plainToInstance(SignupDto, input);

      // Assert
      expect(dto.firstName).toBe('JOHN'); // firstName should remain unchanged
      expect(dto.lastName).toBe('DOE'); // lastName should remain unchanged
    });
  });
});
