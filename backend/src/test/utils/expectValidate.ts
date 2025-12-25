import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

async function expectValidate<T extends object>(
  input: T,
  expectedErrorFields?: (keyof T)[],
) {
  // Use the class type for plainToInstance to get a typed object
  const inputInstance = plainToInstance(
    input.constructor as new () => T,
    input,
  );
  const errors = await validate(inputInstance);

  if (expectedErrorFields && expectedErrorFields.length > 0) {
    for (const field of expectedErrorFields) {
      expect(errors.some((e) => e.property === field)).toBe(true);
    }
    expect(errors.length).toBe(expectedErrorFields.length);
  } else {
    expect(errors.length).toBe(0);
  }
}

export default expectValidate;
