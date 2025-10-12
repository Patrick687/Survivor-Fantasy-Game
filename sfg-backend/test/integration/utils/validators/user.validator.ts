import { Profile, User } from 'generated/graphql';
import { DeepPartial } from '../types/deep-partial.types';

export class UserValidator {
  static validate(user: User, expectedData?: DeepPartial<User>) {
    expect(user.userId).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.role).toBeDefined();

    if (expectedData) {
      if (expectedData.userId) expect(user.userId).toBe(expectedData.userId);
      if (expectedData.email) expect(user.email).toBe(expectedData.email);
      if (expectedData.role) expect(user.role).toBe(expectedData.role);
    }

    if (user.profile) {
      ProfileValidator.validate(user.profile);
    }

    return user;
  }
}

export class ProfileValidator {
  static validate(profile: Profile, expectedData?: DeepPartial<Profile>) {
    expect(profile.id).toBeDefined();
    expect(profile.firstName).toBeDefined();
    expect(profile.lastName).toBeDefined();
    expect(profile.userName).toBeDefined();
    expect(profile.isPublic).toBeDefined();

    if (expectedData) {
      if (expectedData.firstName)
        expect(profile.firstName).toBe(expectedData.firstName);
      if (expectedData.lastName)
        expect(profile.lastName).toBe(expectedData.lastName);
      if (expectedData.userName)
        expect(profile.userName).toBe(expectedData.userName);
      if (expectedData.isPublic)
        expect(profile.isPublic).toBe(expectedData.isPublic);
    }

    return profile;
  }
}
