import { User } from 'src/user/entities/user.entity';

export class AuthPayloadDomain {
  public user: User;
  public token: string;

  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }
}
