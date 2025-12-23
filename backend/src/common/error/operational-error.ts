import { InternalServerErrorException } from '@nestjs/common';

export class InternalServerError extends InternalServerErrorException {
  constructor(message: string = 'Uh Oh! A bad request occurred.') {
    super(message);
  }
}

export class BadRequestError extends InternalServerErrorException {
  constructor(message: string = 'Uh Oh! A bad request occurred.') {
    super(message);
  }
}
