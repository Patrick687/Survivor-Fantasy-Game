import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignupDto } from "./dtos/signup.dto";
import { AuthPayload } from "./entities/auth-payload.entity";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dtos/login.dto";
import { PasswordService } from "src/user/password/password.service";
import { TokenService } from "./token/token.service";
import { AuthPayloadDomain } from "./entities/auth-payload.domain";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) { }

    async signup({
        email,
        password,
        firstName,
        userName,
        lastName
    }: SignupDto): Promise<AuthPayloadDomain> {
        const user = await this.userService.createUser({
            userInfo: { email },
            passwordInfo: { rawPassword: password },
            profileInfo: { firstName, lastName, userName }
        });

        const token = await this.tokenService.issueTokenForUser(user.userId, user.role);

        return {
            user,
            token: token.token
        };
    }

    async login({
        userNameOrEmail,
        password,
    }: LoginDto): Promise<AuthPayloadDomain> {
        const userFromEmail = await this.userService.getUser({ email: userNameOrEmail }).catch();
        const userFromUserName = await this.userService.getUserByProfile({ userName: userNameOrEmail }).catch();

        if (!userFromEmail && !userFromUserName) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const user = userFromEmail ?? userFromUserName;

        const isValid = await this.passwordService.validatePassword({ userId: user.userId, rawPassword: password });
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const token = await this.tokenService.issueTokenForUser(user.userId, user.role);

        return {
            user,
            token: token.token
        };
    }
}