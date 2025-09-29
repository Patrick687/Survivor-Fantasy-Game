import { SignupDto, LoginDto } from '../../../../generated/graphql';

export const createUniqueSignupData = (baseName = 'test'): SignupDto => {
  const shortTimestamp = Date.now().toString().slice(-6); // Last 6 digits
  const maxBaseLength = 20 - 4 - shortTimestamp.length; // 20 - 'User' - timestamp
  const truncatedBaseName = baseName.slice(0, maxBaseLength);

  return {
    email: `${baseName}${shortTimestamp}@test.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    userName: `${truncatedBaseName}User${shortTimestamp}`, // e.g., "testUser123456" (14 chars)
  };
};

export const createLoginData = (
  emailOrUsername: string,
  password = 'TestPassword123!',
): LoginDto => ({
  userNameOrEmail: emailOrUsername,
  password,
});
