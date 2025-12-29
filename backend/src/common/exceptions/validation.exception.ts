import { BadRequestException, ValidationError } from '@nestjs/common';

const formatErrors = (errors: ValidationError[]) => {
  const formattedErrors = {};
  errors.forEach((error) => {
    if (error.constraints) {
      // Joins all constraint messages for the field
      formattedErrors[error.property] = Object.values(error.constraints);
    }
    if (error.children && error.children.length > 0) {
      // Handles nested errors, prefixes the field name
      formattedErrors[error.property] = formatErrors(error.children);
    }
  });
  return formattedErrors;
};

export const validationExceptionFactory = (errors: ValidationError[]) => {
  return new BadRequestException({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Validation failed',
    validationErrors: formatErrors(errors), // The structured error object
  });
};
