import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "./token/token.service";
import { UserService } from "src/user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthPayload } from "src/graphql/graphql";
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";
import { PasswordService } from "./password/password.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) { }

    async register(input: RegisterDto): Promise<AuthPayload> {
        const user = await this.userService.createUser(input);

        await this.passwordService.createPasswordForUser(user.id, input.password);

        const token = this.tokenService.generateToken({
            userId: user.id,
            username: user.username,
            email: user.email
        });

        return { user, token };
    }

    async login(input: LoginDto): Promise<AuthPayload> {
        let user: User | null = null;
        try {
            user = await this.userService.getUser('email', input.usernameOrEmail);
        } catch (e) { }

        if (!user) {
            try {
                user = await this.userService.getUser('username', input.usernameOrEmail);
            } catch (e) { }
        }
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isAuthenticated = await this.passwordService.checkUserPassword(user.id, input.password);
        if (!isAuthenticated) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.tokenService.generateToken({
            userId: user.id,
            username: user.username,
            email: user.email
        });

        return { user, token };
    }
}