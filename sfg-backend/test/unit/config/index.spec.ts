import loadEnvConfig, {
  NodeEnv,
  requireEnvVariable,
} from '../../../src/config/index';

describe('Config Functions', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('requireEnvVariable', () => {
    it('should throw error if env variableName is not set in env', () => {
      // Arrange
      delete process.env.TEST_VAR;

      // Act & Assert
      expect(() => {
        requireEnvVariable('TEST_VAR', 'string');
      }).toThrow('Environment variable TEST_VAR is not set');
    });

    describe('variable = number type', () => {
      it('should throw error if env variable is not a valid number', () => {
        // Arrange
        process.env.TEST_NUMBER = 'not-a-number';

        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_NUMBER', 'number');
        }).toThrow('Environment variable TEST_NUMBER is not a valid number');
      });

      it('should return number if env variable is a valid number', () => {
        // Arrange
        process.env.TEST_NUMBER = '42';

        // Act
        const result = requireEnvVariable('TEST_NUMBER', 'number');

        // Assert
        expect(result).toBe(42);
        expect(typeof result).toBe('number');
      });

      it('should return negative number if env variable is a valid negative number', () => {
        // Arrange
        process.env.TEST_NUMBER = '-10';

        // Act
        const result = requireEnvVariable('TEST_NUMBER', 'number');

        // Assert
        expect(result).toBe(-10);
        expect(typeof result).toBe('number');
      });

      it('should return zero if env variable is set to 0', () => {
        // Arrange
        process.env.TEST_NUMBER = '0';

        // Act
        const result = requireEnvVariable('TEST_NUMBER', 'number');

        // Assert
        expect(result).toBe(0);
        expect(typeof result).toBe('number');
      });

      it('should return number if env variable is a valid float number', () => {
        // Arrange
        process.env.TEST_NUMBER = '3.14';

        // Act
        const result = requireEnvVariable('TEST_NUMBER', 'number');

        // Assert
        expect(result).toBe(3.14);
        expect(typeof result).toBe('number');
      });
    });

    describe('variable = enum type', () => {
      it('should throw error if env variable is not in enum values', () => {
        // Arrange
        process.env.TEST_ENUM = 'invalid-value';
        const enumValues = ['option1', 'option2', 'option3'];

        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_ENUM', 'enum', enumValues);
        }).toThrow(
          'Environment variable TEST_ENUM must be one of: option1, option2, option3',
        );
      });

      it('should return enum value if env variable is in enum values', () => {
        // Arrange
        process.env.TEST_ENUM = 'option2';
        const enumValues = ['option1', 'option2', 'option3'];

        // Act
        const result = requireEnvVariable('TEST_ENUM', 'enum', enumValues);

        // Assert
        expect(result).toBe('option2');
      });

      it('should be case sensitive when checking enum values', () => {
        // Arrange
        process.env.TEST_ENUM = 'Option1'; // Different case
        const enumValues = ['option1', 'option2', 'option3'];

        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_ENUM', 'enum', enumValues);
        }).toThrow(
          'Environment variable TEST_ENUM must be one of: option1, option2, option3',
        );
      });

      it('should throw error if enum values are not provided', () => {
        // Arrange
        process.env.TEST_ENUM = 'some-value';

        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_ENUM', 'enum');
        }).toThrow('Environment variable TEST_ENUM must be one of: ');
      });
    });

    describe('variable = boolean type', () => {
      it('should return true for env variable set to "true" (case insensitive)', () => {
        // Test different cases
        const trueCases = ['true', 'TRUE', 'True', 'tRuE'];

        trueCases.forEach((trueCase) => {
          // Arrange
          process.env.TEST_BOOLEAN = trueCase;

          // Act
          const result = requireEnvVariable('TEST_BOOLEAN', 'boolean');

          // Assert
          expect(result).toBe(true);
          expect(typeof result).toBe('boolean');
        });
      });

      it('should return false for env variable set to "false" (case insensitive)', () => {
        // Test different cases
        const falseCases = ['false', 'FALSE', 'False', 'fAlSe'];

        falseCases.forEach((falseCase) => {
          // Arrange
          process.env.TEST_BOOLEAN = falseCase;

          // Act
          const result = requireEnvVariable('TEST_BOOLEAN', 'boolean');

          // Assert
          expect(result).toBe(false);
          expect(typeof result).toBe('boolean');
        });
      });

      it('should throw error if env variable is not "true" or "false"', () => {
        // Test various invalid boolean values
        const invalidValues = [
          'yes',
          'no',
          '1',
          '0',
          'on',
          'off',
          'enabled',
          'disabled',
        ];

        invalidValues.forEach((invalidValue) => {
          // Arrange
          process.env.TEST_BOOLEAN = invalidValue;

          // Act & Assert
          expect(() => {
            requireEnvVariable('TEST_BOOLEAN', 'boolean');
          }).toThrow(
            "Environment variable TEST_BOOLEAN must be 'true' or 'false'",
          );
        });
      });

      it('should throw error if env variable is set to an empty string', () => {
        // Arrange
        process.env.TEST_BOOLEAN = '';

        // This will actually trigger the "not set" error since empty string is falsy
        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_BOOLEAN', 'boolean');
        }).toThrow('Environment variable TEST_BOOLEAN is not set');
      });
    });

    describe('variable = string type', () => {
      it('should return string value as is', () => {
        // Arrange
        process.env.TEST_STRING = 'hello world';

        // Act
        const result = requireEnvVariable('TEST_STRING', 'string');

        // Assert
        expect(result).toBe('hello world');
        expect(typeof result).toBe('string');
      });

      it('should throw error if env variable is an empty string', () => {
        // Arrange
        process.env.TEST_STRING = '';

        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_STRING', 'string');
        }).toThrow('Environment variable TEST_STRING is not set');
      });

      it('should return string with special characters', () => {
        // Arrange
        const specialString = 'test@#$%^&*()_+-=[]{}|;:,.<>?';
        process.env.TEST_STRING = specialString;

        // Act
        const result = requireEnvVariable('TEST_STRING', 'string');

        // Assert
        expect(result).toBe(specialString);
        expect(typeof result).toBe('string');
      });

      it('should return string with spaces', () => {
        // Arrange
        const stringWithSpaces = '  hello   world  ';
        process.env.TEST_STRING = stringWithSpaces;

        // Act
        const result = requireEnvVariable('TEST_STRING', 'string');

        // Assert
        expect(result).toBe(stringWithSpaces);
        expect(typeof result).toBe('string');
      });
    });

    describe('variable = unsupported type', () => {
      it('should throw error for unsupported type', () => {
        // Arrange
        process.env.TEST_VAR = 'some-value';
        const unsupportedType = 'array' as any;

        // Act & Assert
        expect(() => {
          requireEnvVariable('TEST_VAR', unsupportedType);
        }).toThrow(
          'Unsupported type array for environment variable TEST_VAR. Cannot start server.',
        );
      });
    });
  });

  describe('loadEnvConfig', () => {
    it('should load all environment variables correctly', () => {
      // Arrange
      process.env.NODE_ENV = NodeEnv.Development;
      process.env.HOST = 'localhost';
      process.env.PORT = '3000';
      process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
      process.env.JWT_SECRET = 'test-jwt-secret';
      process.env.SEED_DATA = 'true';

      // Act
      const config = loadEnvConfig();

      // Assert
      expect(config).toEqual({
        node_env: NodeEnv.Development,
        host: 'localhost',
        port: 3000,
        databaseUrl: 'postgresql://localhost:5432/test',
        jwtSecret: 'test-jwt-secret',
        seed_data: true,
      });
    });

    it('should throw error if required environment variable is missing', () => {
      // Arrange - deliberately not setting NODE_ENV
      delete process.env.NODE_ENV;

      // Act & Assert
      expect(() => {
        loadEnvConfig();
      }).toThrow('Environment variable NODE_ENV is not set');
    });
  });
});
